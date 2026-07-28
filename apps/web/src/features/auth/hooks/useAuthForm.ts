import { useCallback, useState } from "react";

type ParseResult<T> =
  | { readonly success: true; readonly data: T }
  | {
      readonly success: false;
      readonly error: {
        readonly issues: ReadonlyArray<{
          readonly path: ReadonlyArray<PropertyKey>;
          readonly message: string;
        }>;
      };
    };

export interface UseAuthFormOptions<T extends Record<string, string>> {
  readonly schema: {
    safeParse(value: T): ParseResult<T>;
  };
  readonly initialValues: T;
}

export function useAuthForm<T extends Record<string, string>>({
  schema,
  initialValues,
}: UseAuthFormOptions<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof T, string>>
  >({});

  const setField = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
    setValues((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => ({ ...current, [field]: undefined }));
  }, []);

  const validate = useCallback((): {
    ok: boolean;
    errors: Partial<Record<keyof T, string>>;
  } => {
    const result = schema.safeParse(values);
    if (result.success === false) {
      const nextErrors: Partial<Record<keyof T, string>> = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0];
        if (typeof key === "string" && !nextErrors[key as keyof T]) {
          nextErrors[key as keyof T] = issue.message;
        }
      }
      setFieldErrors(nextErrors);
      return { ok: false, errors: nextErrors };
    }

    setFieldErrors({});
    return { ok: true, errors: {} };
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
