import { Guard } from "./guard.util";

const deep_merge_nullish = <T extends Record<string, unknown>>(
  target: T,
  source: Partial<T>,
): T => {
  const output = { ...target } as T;

  for (const _key in source) {
    const key = _key as keyof T;

    const new_value = source[key];
    const current_value = target[key];
    if (
      typeof current_value === "object" &&
      current_value !== null &&
      !Array.isArray(current_value) &&
      typeof new_value === "object" &&
      new_value !== null &&
      !Array.isArray(new_value)
    ) {
      (output as any)[key] = deep_merge_nullish(
        current_value as T,
        new_value as T,
      );
    } else if (Guard.is_nullish(current_value)) {
      (output as any)[key] = new_value;
    }
  }

  return output;
};

export const Objects = {
  deep_merge_nullish,
};
