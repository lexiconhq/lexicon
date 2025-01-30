// This implementation based on https://gist.github.com/kuroski/9a7ae8e5e5c9e22985364d1ddbf3389d

// Utility type to transform camelCase strings to snake_case
type CamelToSnake<T extends string> = T extends `${infer First}${infer Rest}`
  ? `${First extends Capitalize<First>
      ? '_'
      : ''}${Lowercase<First>}${CamelToSnake<Rest>}`
  : '';

// Transform keys of an object type from camelCase to snake_case
export type KeysToSnakeCase<T> = {
  [K in keyof T as CamelToSnake<string & K>]: T[K];
};
