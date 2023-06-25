export function banUserObjectBuilder(
  isBanned: boolean | string,
  banReason: string | number,
) {
  return {
    isBanned: isBanned,
    banReason: banReason,
  };
}
