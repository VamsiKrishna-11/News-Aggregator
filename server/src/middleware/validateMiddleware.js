/**
 * Middleware factory that validates incoming req.body against a Zod schema.
 * Replaces req.body with parsed/sanitized data if successful.
 * Returns 400 Bad Request with field-level errors if validation fails.
 *
 * @param {import('zod').ZodSchema} schema
 */
export const validate = (schema) => (req, res, next) => {
  try {
    const parseResult = schema.safeParse(req.body);

    if (!parseResult.success) {
      const formattedErrors = parseResult.error.errors.map((err) => ({
        field: err.path.join('.') || 'body',
        message: err.message,
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: formattedErrors,
      });
    }

    // Attach sanitized/parsed data to req.body
    req.body = parseResult.data;
    next();
  } catch (error) {
    next(error);
  }
};
