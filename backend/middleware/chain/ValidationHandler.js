const BaseHandler = require('./BaseHandler');

class ValidationHandler extends BaseHandler {
  constructor(validationRules) {
    super();
    this.validationRules = validationRules || {};
  }

  canHandle(request) {
    return Object.keys(this.validationRules).length > 0;
  }

  async process(request, response) {
    const errors = [];
    const data = { ...request.body, ...request.query, ...request.params };

    for (const [field, rules] of Object.entries(this.validationRules)) {
      const value = data[field];
      const fieldErrors = this.validateField(field, value, rules);

      if (fieldErrors.length > 0) {
        errors.push(...fieldErrors);
      }
    }

    if (errors.length > 0) {
      this.sendError(response, 400, `Validation failed: ${errors.join(', ')}`);
      return;
    }

    console.log(`Validation passed for ${request.method} ${request.path}`);
  }

  validateField(fieldName, value, rules) {
    const errors = [];

    if (rules.required && (value === undefined || value === null || value === '')) {
      errors.push(`${fieldName} is required`);
      return errors;
    }

    if (value !== undefined && value !== null && value !== '') {
      if (rules.type && typeof value !== rules.type) {
        errors.push(`${fieldName} must be of type ${rules.type}`);
      }

      if (rules.minLength && value.length < rules.minLength) {
        errors.push(`${fieldName} must be at least ${rules.minLength} characters long`);
      }

      if (rules.maxLength && value.length > rules.maxLength) {
        errors.push(`${fieldName} must be no more than ${rules.maxLength} characters long`);
      }

      if (rules.min && value < rules.min) {
        errors.push(`${fieldName} must be at least ${rules.min}`);
      }

      if (rules.max && value > rules.max) {
        errors.push(`${fieldName} must be no more than ${rules.max}`);
      }

      if (rules.pattern && !rules.pattern.test(value)) {
        errors.push(`${fieldName} format is invalid`);
      }

      if (rules.enum && !rules.enum.includes(value)) {
        errors.push(`${fieldName} must be one of: ${rules.enum.join(', ')}`);
      }

      if (rules.custom && typeof rules.custom === 'function') {
        const customError = rules.custom(value);
        if (customError) {
          errors.push(customError);
        }
      }
    }

    return errors;
  }
}

module.exports = ValidationHandler;