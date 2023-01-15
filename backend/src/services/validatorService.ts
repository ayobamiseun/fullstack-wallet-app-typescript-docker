import Joi, { ValidationResult } from 'joi';
import passwordComplexity from 'joi-password-complexity';

const complexityOptions = {
  min: 8,
  max: 30,
  lowerCase: 1,
  upperCase: 1,
  numeric: 1,
  symbol: 1,
};

const validateUser = (data: object): ValidationResult => {
  const schema = Joi.object({
    id: Joi.number().positive().integer(),
    username: Joi.string().min(3).required(),
    password: passwordComplexity(complexityOptions).required(),
  });

  const { error, value } = schema.validate(data);
  if (error) throw error;

  return value;  
};

const validateLogin = (data: object): ValidationResult => {
  const schema = Joi.object({
    username: Joi.string().min(3).required(),
    password: passwordComplexity(complexityOptions).required(),
  });

  const { error, value } = schema.validate(data);
  if (error) throw error;

  return value;
};

const validatePassword = (password: string): void => {
  if (password.length < 8) {
    throw new Error('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    throw new Error('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    throw new Error('Password must contain at least one lowercase letter');
  }
  
  if (!/[0-9]/.test(password)) {
    throw new Error('Password must contain at least one number');
  }
  
  if (!/[^A-Za-z0-9]/.test(password)) {
    throw new Error('Password must contain at least one special character');
  }
}
export { validateUser, validateLogin, validatePassword };
