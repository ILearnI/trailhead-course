// A FormData, from a plain object
export function formData(fields) {
  const data = new FormData();
  for (const [name, value] of Object.entries(fields)) {
    data.set(name, String(value));
  }
  return data;
}
