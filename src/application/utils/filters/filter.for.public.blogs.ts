export function filterForPublicBlogs(searchNameTerm: string | undefined): {
  [key: string]: string | boolean;
} {
  const filter: { [key: string]: string | boolean } = {};
  filter['nameTerm'] = '%';

  if (searchNameTerm) filter['nameTerm'] += searchNameTerm + '%';
  return filter;
}
