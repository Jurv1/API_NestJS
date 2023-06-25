export function makeException(value: string) {
  return {
    errorsMessages: [
      {
        message: expect.any(String),
        field: value,
      },
    ],
  };
}
