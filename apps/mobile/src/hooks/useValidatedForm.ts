import { useCallback, useState } from 'react';

type SafeParseResult<T> = {
  success: boolean;
  data?: T;
  error?: {
    issues: ReadonlyArray<{
      path: ReadonlyArray<PropertyKey>;
      message: string;
    }>;
  };
};

export interface UseValidatedFormOptions<T> {
  readonly schema: {
    safeParse(value: T): SafeParseResult<T>;
  };
  readonly initialValues: T;
}

export function useValidatedForm<T>({
  schema,
  initialValues,
}: UseValidatedFormOptions<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<string, string>>
  >({});

  const setField = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
    setValues(current => ({ ...current, [field]: value }));
    setFieldErrors(current => ({ ...current, [field as string]: undefined }));
  }, []);

  const validate = useCallback((): boolean => {
    const result = schema.safeParse(values);
    if (!result.success) {
      const nextErrors: Partial<Record<string, string>> = {};
      for (const issue of result.error?.issues ?? []) {
        const key = issue.path[0];
        if (typeof key === 'string' && !nextErrors[key]) {
          nextErrors[key] = issue.message;
        }
      }
      setFieldErrors(nextErrors);
      return false;
    }

    setFieldErrors({});
    return true;
  }, [schema, values]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setFieldErrors({});
  }, [initialValues]);

  return {
    values,
    fieldErrors,
    setField,
    validate,
    reset,
  };
}
