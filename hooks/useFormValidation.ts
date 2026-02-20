import { useState, useCallback } from "react";

export interface ValidationRule<T> {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: T) => string | null;
}

export interface ValidationRules<T> {
  [K: string]: ValidationRule<T[keyof T]>;
}

export interface ValidationErrors {
  [key: string]: string;
}

/**
 * Custom hook for form validation
 * @param initialValues - Initial values for the form
 * @param validationRules - Validation rules for each field
 * @returns Form state and handlers
 */
export function useFormValidation<T extends Record<string, unknown>>(
  initialValues: T,
  validationRules: Partial<Record<keyof T, ValidationRule<T[keyof T]>>>,
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Validate a single field
  const validateField = useCallback(
    (name: keyof T, value: T[keyof T]): string | null => {
      const rules = validationRules[name];
      if (!rules) return null;

      const stringValue = String(value);

      // Required validation
      if (rules.required && (!value || stringValue.trim() === "")) {
        return "This field is required";
      }

      // Min length validation
      if (rules.minLength && stringValue.length < rules.minLength) {
        return `Minimum length is ${rules.minLength} characters`;
      }

      // Max length validation
      if (rules.maxLength && stringValue.length > rules.maxLength) {
        return `Maximum length is ${rules.maxLength} characters`;
      }

      // Pattern validation
      if (rules.pattern && !rules.pattern.test(stringValue)) {
        return "Invalid format";
      }

      // Custom validation
      if (rules.custom) {
        return rules.custom(value);
      }

      return null;
    },
    [validationRules],
  );

  // Validate all fields
  const validateAll = useCallback((): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    Object.keys(validationRules).forEach((key) => {
      const error = validateField(key as keyof T, values[key as keyof T]);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [values, validateField, validationRules]);

  // Handle field change
  const handleChange = useCallback(
    (name: keyof T, value: T[keyof T]) => {
      setValues((prev) => ({
        ...prev,
        [name]: value,
      }));

      // Clear error when user starts typing
      if (errors[name as string]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name as string];
          return newErrors;
        });
      }
    },
    [errors],
  );

  // Handle field blur
  const handleBlur = useCallback(
    (name: keyof T) => {
      setTouched((prev) => ({
        ...prev,
        [name as string]: true,
      }));

      // Validate on blur
      const error = validateField(name, values[name]);
      if (error) {
        setErrors((prev) => ({
          ...prev,
          [name as string]: error,
        }));
      }
    },
    [validateField, values],
  );

  // Reset form
  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
    reset,
    setValues,
    setErrors,
  };
}

/**
 * Common validation rules
 */
export const validationPatterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[\d\s\-\+\(\)]+$/,
  url: /^https?:\/\/.+/,
};
