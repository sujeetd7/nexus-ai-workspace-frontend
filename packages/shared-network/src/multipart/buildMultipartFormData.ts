export interface MultipartField {
  readonly name: string;
  readonly value: string | Blob | File;
  readonly filename?: string;
  readonly contentType?: string;
}

/**
 * Builds a FormData payload for multipart requests.
 * Works in browser and React Native when Blob/File are available.
 */
export function buildMultipartFormData(
  fields: readonly MultipartField[],
): FormData {
  const formData = new FormData();

  for (const field of fields) {
    if (field.value instanceof Blob) {
      formData.append(
        field.name,
        field.value,
        field.filename ?? "upload.bin",
      );
      continue;
    }

    formData.append(field.name, field.value);
  }

  return formData;
}
