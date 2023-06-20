export function paginator(
  counts: number,
  pageSize: number,
  pageNumber: number,
  items,
) {
  const totalCount: number = Math.ceil(counts / pageSize);

  return {
    pagesCount: totalCount,
    page: pageNumber,
    pageSize: pageSize,
    totalCount: counts,
    items: items,
  };
}
