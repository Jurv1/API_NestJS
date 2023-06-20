export function filterForUsersByAdmin(
  banStatus: string | undefined,
  searchLoginTerm: string | undefined,
  searchEmailTerm: string | undefined,
): { [key: string]: string | boolean } {
  const filter: { [key: string]: string | boolean } = {};
  filter['loginTerm'] = '%';
  filter['emailTerm'] = '%';

  if (banStatus === 'banned') {
    filter['banCond'] = true;
    filter['banCond1'] = true;
  } else if (banStatus === 'notBanned') {
    filter['banCond'] = false;
    filter['banCond1'] = false;
  } else {
    filter['banCond'] = true;
    filter['banCond1'] = false;
  }

  if (searchEmailTerm && searchLoginTerm) {
    filter['loginTerm'] = filter['loginTerm'] + searchLoginTerm + '%';
    filter['emailTerm'] = filter['emailTerm'] + searchEmailTerm + '%';
  } else if (searchLoginTerm || searchEmailTerm) {
    if (searchLoginTerm) {
      filter['loginTerm'] = filter['loginTerm'] + searchLoginTerm + '%';
      filter['emailTerm'] = '';
    }

    if (searchEmailTerm) {
      filter['emailTerm'] = filter['emailTerm'] + searchEmailTerm + '%';
      filter['loginTerm'] = '';
    }
  }
  return filter;
}
