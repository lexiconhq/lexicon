export const changePasswordOutputResponseTransformer = (data: {
  success: string;
}) => {
  if (!data.success) {
    throw new Error(`No account found`);
  }
  return 'success';
};
