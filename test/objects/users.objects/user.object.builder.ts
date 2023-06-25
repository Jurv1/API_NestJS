export function userObjectBuilder(
  login: string | number,
  password: string | number,
  email: string,
) {
  return {
    login: login,
    password: password,
    email: email,
  };
}
