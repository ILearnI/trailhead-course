// What to write when Next catches an error
export function describeError(error, request, context) {
  return {
    message: error.message,
    fields: {
      digest: error.digest,
      method: request.method,
      path: request.path,
      route: context.routePath,
      routeType: context.routeType,
    },
  };
}
