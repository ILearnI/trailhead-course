// A Request for a handler
export function makeRequest(path, { method = "GET", body, headers = {} } = {}) {
  const init = { method, headers: { ...headers } };
  if (body !== undefined) {
    init.body = typeof body === "string" ? body : JSON.stringify(body);
    init.headers["content-type"] = "application/json";
  }
  return new Request(`http://localhost${path}`, init);
}

// The params of a dynamic route: a promise
export const paramsOf = (values) => ({ params: Promise.resolve(values) });
