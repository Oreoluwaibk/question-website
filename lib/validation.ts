const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_PATTERN = /^[A-Za-z][A-Za-z\s'-]{1,49}$/;
const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

export function countPhoneDigits(phone: string) {
  return phone.replace(/\D/g, '').length;
}

export function validateEmail(email: string): string | null {
  const value = email.trim();
  if (!value) return 'Email is required';
  if (!EMAIL_PATTERN.test(value)) return 'Enter a valid email address';
  return null;
}

export function validateName(name: string, label: string): string | null {
  const value = name.trim();
  if (!value) return `${label} is required`;
  if (value.length < 2) return `${label} must be at least 2 characters`;
  if (!NAME_PATTERN.test(value)) {
    return `${label} can only contain letters, spaces, hyphens, and apostrophes`;
  }
  return null;
}

export function validatePhone(phone: string): string | null {
  const value = phone.trim();
  if (!value) return 'Phone number is required';
  const digits = countPhoneDigits(value);
  if (digits < 10 || digits > 15) {
    return 'Enter a valid phone number (10–15 digits)';
  }
  if (!/^[\d+\s()-]+$/.test(value)) {
    return 'Phone number contains invalid characters';
  }
  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) return 'Password is required';
  if (password.length < 8) return 'Password must be at least 8 characters';
  if (!PASSWORD_PATTERN.test(password)) {
    return 'Password must include uppercase, lowercase, and a number';
  }
  return null;
}

export type RegistrationFields = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword?: string;
};

export function validateRegistration(fields: RegistrationFields) {
  return {
    firstName: validateName(fields.firstName, 'First name'),
    lastName: validateName(fields.lastName, 'Last name'),
    email: validateEmail(fields.email),
    phoneNumber: validatePhone(fields.phoneNumber),
    password: validatePassword(fields.password),
    confirm:
      fields.confirmPassword !== undefined && fields.password !== fields.confirmPassword
        ? 'Passwords do not match'
        : null,
  };
}
