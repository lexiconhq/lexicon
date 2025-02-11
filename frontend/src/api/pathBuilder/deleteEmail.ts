import { RestLink } from 'apollo-link-rest';

export const deleteEmailPathBuilder = ({ args }: RestLink.PathBuilderProps) => {
  const queryParams = new URLSearchParams();
  queryParams.set('email', args.email);

  return `/users/${
    args.username
  }/preferences/email.json?${queryParams.toString()}`;
};
