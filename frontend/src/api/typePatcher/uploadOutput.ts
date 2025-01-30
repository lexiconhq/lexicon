import { RestLink } from 'apollo-link-rest';

export const uploadOutputPatcher: RestLink.FunctionalTypePatcher = (
  data,
  _,
  __,
  ctx,
) => {
  const { token } = ctx.resolverParams.args.input;

  return {
    __typename: 'UploadOutput',
    ...data,
    token: token ?? null,
  };
};
