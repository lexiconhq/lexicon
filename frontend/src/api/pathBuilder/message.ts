import { RestLink } from 'apollo-link-rest';

export function messagePathBuilder({ args }: RestLink.PathBuilderProps) {
  const params = args.page ? `?page=${args.page}` : '';
  const type = args.messageType === 'sent' ? '-sent' : '';

  return `/topics/private-messages${type}/${args.username}.json${params}`;
}
