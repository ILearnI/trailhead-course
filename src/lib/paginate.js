// The page and limit, kept in range
export function readPaging(searchParams) {
  const page = Math.max(1, Math.floor(Number(searchParams.get("page"))) || 1);
  const asked = Math.floor(Number(searchParams.get("limit"))) || 20;
  return { page, limit: Math.min(Math.max(asked, 1), 50) };
}

// One page of a list, and its meta
export function paginate(items, { page, limit }) {
  const pages = Math.max(1, Math.ceil(items.length / limit));
  const start = (page - 1) * limit;
  return {
    data: items.slice(start, start + limit),
    meta: { page, limit, total: items.length, pages },
  };
}
