export function filterForUsersByBlogger(searchLoginTerm: string) {
  const filter: { [key: string]: string } = {};
  filter['loginTerm'] = '%';

  if (searchLoginTerm) {
    filter['loginTerm'] = filter['loginTerm'] + searchLoginTerm + '%';
  }

  return filter;
}
