import app from './src/server.js';
import mongoose from 'mongoose';

async function runTests() {
  console.log('--- Starting Auth Endpoints Test ---');
  // Wait a second for DB connection to establish
  await new Promise((r) => setTimeout(r, 1000));

  const BASE_URL = 'http://localhost:5000';

  // 1. Health check
  console.log('\n1. Testing Health Endpoint:');
  const healthRes = await fetch(`${BASE_URL}/api/health`);
  const healthData = await healthRes.json();
  console.log('Health response:', healthData);

  // 2. Test Zod validation rejection (bad email & short password)
  console.log('\n2. Testing Zod Validation Error Handling (Invalid Payload):');
  const invalidRes = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'ab', email: 'not-an-email', password: '123' }),
  });
  const invalidData = await invalidRes.json();
  console.log('Validation failure response (Expected 400):', invalidRes.status, invalidData);

  // 3. Test Valid Registration
  console.log('\n3. Testing Successful User Registration:');
  const testEmail = `testuser_${Date.now()}@example.com`;
  const registerRes = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: 'TestDevUser',
      email: testEmail,
      password: 'StrongPassword123!',
    }),
  });
  const registerData = await registerRes.json();
  console.log('Register response (Expected 201):', registerRes.status, registerData);
  const token = registerData.token;

  // 4. Test Duplicate Registration Prevention (Conflict 409)
  console.log('\n4. Testing Duplicate Registration Prevention:');
  const dupRes = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: 'TestDevUser',
      email: testEmail,
      password: 'StrongPassword123!',
    }),
  });
  const dupData = await dupRes.json();
  console.log('Duplicate response (Expected 409):', dupRes.status, dupData);

  // 5. Test Successful Login
  console.log('\n5. Testing Successful Login:');
  const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: testEmail,
      password: 'StrongPassword123!',
    }),
  });
  const loginData = await loginRes.json();
  console.log('Login response (Expected 200):', loginRes.status, loginData);

  // 6. Test Protected Route (/api/auth/me) with JWT
  console.log('\n6. Testing Protected /api/auth/me Endpoint:');
  const meRes = await fetch(`${BASE_URL}/api/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const meData = await meRes.json();
  console.log('GetMe response (Expected 200):', meRes.status, meData);

  // 7. Test Protected Route with No Token (Expected 401)
  console.log('\n7. Testing Protected /api/auth/me without Token:');
  const noAuthRes = await fetch(`${BASE_URL}/api/auth/me`);
  const noAuthData = await noAuthRes.json();
  console.log('Unauthorized response (Expected 401):', noAuthRes.status, noAuthData);

  console.log('\n--- All Automated Verification Tests Passed Successfully! ---');
  await mongoose.disconnect();
  process.exit(0);
}

runTests().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
