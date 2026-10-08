import React from 'react';
import './CategoryFilter.css';

const CATEGORIES = [
  { id: 'general', label: 'All' },
  { id: 'technology', label: 'Technology' },
  { id: 'business', label: 'Business' },
  { id: 'science', label: 'Science' },
  { id: 'entertainment', label: 'Entertainment' },
  { id: 'sports', label: 'Sports' },
  { id: 'health', label: 'Health' },
];

export default function CategoryFilter({ selectedCategory, onSelectCategory }) {
  return (
    <nav className="category-bar" aria-label="Category Navigation">
      {CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          className={`category-pill ${selectedCategory === cat.id ? 'active' : ''}`}
          onClick={() => onSelectCategory(cat.id)}
        >
          {cat.label}
        </button>
      ))}
    </nav>
  );
}