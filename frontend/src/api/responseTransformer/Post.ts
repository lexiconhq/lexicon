export const postRawResponseTransform = (data: string) => {
  return { raw: data };
};

export const postCookedResponseTransform = (data: string) => {
  return { cooked: data };
};
