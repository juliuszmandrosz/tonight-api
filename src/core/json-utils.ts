export function toJson<T>(item: T) {
  return JSON.parse(JSON.stringify(item));
}
