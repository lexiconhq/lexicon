export const changePasswordOutputResponseTransformer = (data: {
  user_found: boolean;
}) => {
  if (!data.user_found) {
    throw new Error(`No account found`);
  }
  return 'success';
};
