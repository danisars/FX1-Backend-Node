export default function (ids: string[]) {
  const length = ids.length;
  if (length > 1 || length === 0) {
    throw new Error(`Sport ID length is invalid. Length: ${length}.`);
  }
}
