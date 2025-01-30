export const successResponseTransform = (data: { success: string }) => {
  return data.success === 'OK' ? 'success' : data.success;
};

export const stringResponseTransform = () => {
  return 'success';
};
