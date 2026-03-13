import { z } from 'zod';

/**
 * Validate an Indian phone number (10 digits, optionally prefixed with +91).
 */
export function isValidPhone(phone: string): boolean {
  return /^(\+91)?[6-9]\d{9}$/.test(phone.replace(/\s/g, ''));
}

/**
 * Validate an email address.
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Validate a 6-digit OTP.
 */
export function isValidOtp(otp: string): boolean {
  return /^\d{6}$/.test(otp);
}

/**
 * Validate a pincode (6 digits for Indian pincodes).
 */
export function isValidPincode(pincode: string): boolean {
  return /^\d{6}$/.test(pincode);
}

/**
 * Validate a GST number.
 */
export function isValidGST(gst: string): boolean {
  return /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}$/.test(gst);
}

/**
 * Validate a PAN number.
 */
export function isValidPAN(pan: string): boolean {
  return /^[A-Z]{5}\d{4}[A-Z]{1}$/.test(pan);
}

// ─── Zod Schemas ────────────────────────────────────

export const phoneSchema = z
  .string()
  .min(10, 'Phone number must be at least 10 digits')
  .refine(isValidPhone, 'Invalid phone number');

export const emailSchema = z.string().email('Invalid email address');

export const otpSchema = z
  .string()
  .length(6, 'OTP must be 6 digits')
  .refine(isValidOtp, 'OTP must contain only digits');

export const pincodeSchema = z
  .string()
  .length(6, 'Pincode must be 6 digits')
  .refine(isValidPincode, 'Invalid pincode');

export const gstSchema = z
  .string()
  .length(15, 'GST must be 15 characters')
  .refine(isValidGST, 'Invalid GST number');

export const panSchema = z
  .string()
  .length(10, 'PAN must be 10 characters')
  .refine(isValidPAN, 'Invalid PAN number');
