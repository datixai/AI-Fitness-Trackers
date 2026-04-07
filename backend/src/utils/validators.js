// src/utils/validators.js - Input Validation Utilities

/**
 * Validate email format
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
};

/**
 * Validate password strength
 * At least 8 characters
 */
export const validatePassword = (password) => {
  return password && password.length >= 8;
};

/**
 * Validate password match
 */
export const validatePasswordMatch = (password, confirmPassword) => {
  return password === confirmPassword;
};

/**
 * Validate phone number (basic)
 */
export const validatePhone = (phone) => {
  const phoneRegex = /^[\d\s\-\+\(\)]*$/;
  return phoneRegex.test(phone);
};

/**
 * Validate numeric range
 */
export const validateRange = (value, min, max) => {
  const num = parseFloat(value);
  return num >= min && num <= max;
};

/**
 * Validate weight (kg)
 */
export const validateWeight = (weight) => {
  return validateRange(weight, 30, 250);
};

/**
 * Validate height (cm)
 */
export const validateHeight = (height) => {
  return validateRange(height, 100, 250);
};

/**
 * Validate mood/energy/stress (1-10 scale)
 */
export const validateScale1to10 = (value) => {
  return validateRange(value, 1, 10);
};

/**
 * Validate date format (YYYY-MM-DD)
 */
export const validateDate = (date) => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) return false;
  
  const d = new Date(date);
  return d instanceof Date && !isNaN(d);
};

/**
 * Validate time format (HH:MM or HH:MM:SS)
 */
export const validateTime = (time) => {
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/;
  return timeRegex.test(time);
};

/**
 * Validate measurements (circumference in cm)
 */
export const validateMeasurement = (measurement) => {
  return validateRange(measurement, 10, 200);
};

/**
 * Validate body fat percentage
 */
export const validateBodyFat = (percentage) => {
  return validateRange(percentage, 2, 60);
};

/**
 * Validate heart rate (bpm)
 */
export const validateHeartRate = (bpm) => {
  return validateRange(bpm, 20, 250);
};

/**
 * Validate body temperature (Celsius)
 */
export const validateTemperature = (celsius) => {
  return validateRange(celsius, 35, 42);
};

/**
 * Validate sleep hours
 */
export const validateSleepHours = (hours) => {
  return validateRange(hours, 1, 14);
};

/**
 * Validate year of birth (reasonable range)
 */
export const validateBirthYear = (year) => {
  const currentYear = new Date().getFullYear();
  return validateRange(year, currentYear - 100, currentYear - 13);
};

/**
 * Validate calorie intake
 */
export const validateCalories = (calories) => {
  return validateRange(calories, 0, 10000);
};

/**
 * Validate macro values (grams)
 */
export const validateMacro = (grams) => {
  return validateRange(grams, 0, 1000);
};

/**
 * Validate form type
 */
export const validateFormType = (formType) => {
  const validForms = [
    'workout_log',
    'daily_log',
    'misure',
    'body_fat',
    'progress_photo'
  ];
  return validForms.includes(formType);
};

/**
 * Validate URL
 */
export const validateURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validate YouTube URL
 */
export const validateYoutubeURL = (url) => {
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube|youtu|youtube-nocookie)\.(com|be)\//;
  return youtubeRegex.test(url);
};

/**
 * Sanitize string (remove potentially dangerous characters)
 */
export const sanitizeString = (str) => {
  if (typeof str !== 'string') return '';
  return str
    .replace(/[<>]/g, '')
    .trim();
};

/**
 * Validate file size (in bytes)
 */
export const validateFileSize = (bytes, maxMB = 10) => {
  const maxBytes = maxMB * 1024 * 1024;
  return bytes <= maxBytes;
};

/**
 * Validate image file type
 */
export const validateImageType = (mimeType) => {
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  return validTypes.includes(mimeType);
};

/**
 * Validate postal code (basic pattern)
 */
export const validatePostalCode = (code) => {
  const codeRegex = /^[a-zA-Z0-9\s\-]*$/;
  return codeRegex.test(code) && code.length > 0 && code.length <= 20;
};

/**
 * Validate object has required fields
 */
export const validateRequiredFields = (obj, requiredFields) => {
  return requiredFields.every(field => {
    const value = obj[field];
    return value !== null && value !== undefined && value !== '';
  });
};
