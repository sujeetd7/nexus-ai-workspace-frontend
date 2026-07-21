import { useState } from "react";

export function useSample() {
  const [value, setValue] = useState<unknown>(null);

  return { value, setValue };
}
