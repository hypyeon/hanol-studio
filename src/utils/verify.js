/**
 * Hanol Studio - Client Validation Utility
 * Verifies Full Name, Email, and Phone formatting
 */

export const validateClientInfo = (formData) => {
  const { name, email, phone } = formData;

  const emailLower = email.toLowerCase().trim();
  const domain = emailLower.split('@')[1];

  // 1. Full Name Check (Must have at least two parts)
  const nameParts = name.trim().split(" ");
  if (nameParts.length < 2 || nameParts[1].length < 1) {
    return "Please enter your full name (First and Last).";
  }

  // 2. Email Check (Standard RFC format)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "Please enter a valid email address.";
  }
  const blockedDomains = ['mailinator.com', '10minutemail.com', 'tempmail.com'];
  if (domain && blockedDomains.includes(domain)) {
    return "Please use a permanent email address for your booking.";
  }

  // 3. Phone Check (Minimum 10 digits)
  const phoneDigits = phone.replace(/\D/g, ""); 
  if (phoneDigits.length < 10) {
    return "Please enter a valid 10-digit phone number.";
  }

  // If we get here, everything is valid
  return null; 
};