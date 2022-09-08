export const groupBy = <T>(arr: T[], cb: (arg: T) => any): Record<string, T[]> => {
  const result = {};
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    const bucketGroup = cb(item);
    const bucket = result[bucketGroup];

    if (!Array.isArray(bucket)) {
      result[bucketGroup] = [item];
    } else {
      result[bucketGroup].push(item);
    }
  }

  return result;
};
