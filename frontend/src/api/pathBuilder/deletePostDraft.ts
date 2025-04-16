import { RestLink } from 'apollo-link-rest';

export function deletePostDraftPathBuilder({
  args,
}: RestLink.RestLinkHelperProps) {
  const queryParams = new URLSearchParams();
  queryParams.set('draft_key', args.draftKey);
  queryParams.set('sequence', args.sequence);

  return `/drafts/${args.draftKey}.json?${queryParams.toString()}`;
}
