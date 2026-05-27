import { Flag } from '../types';

export const NOTIFY_MODERATORS_FLAG_ID = 7;
export const NOTIFY_USER_FLAG_ID = 6;

export function normalizeFlagTypeId(id: number | string): number {
  return Number(id);
}

export function findFlagTypeById(
  flagTypes: Array<Flag> | undefined,
  flagId: number,
): Flag | undefined {
  return flagTypes?.find((flag) => normalizeFlagTypeId(flag.id) === flagId);
}

export function flagTypeRequiresMessage(
  postActionTypeId: number,
  isTopicFlag: boolean,
  topicFlagTypes: Array<Flag>,
  postActionTypes: Array<Flag>,
): boolean {
  const flagTypes = isTopicFlag ? topicFlagTypes : postActionTypes;
  const flagType = findFlagTypeById(flagTypes, postActionTypeId);
  if (!flagType) {
    return (
      postActionTypeId === NOTIFY_MODERATORS_FLAG_ID ||
      postActionTypeId === NOTIFY_USER_FLAG_ID
    );
  }
  const nameKey = flagType.nameKey ?? '';
  return (
    nameKey.includes('notify_moderators') ||
    nameKey.includes('notify_user') ||
    postActionTypeId === NOTIFY_MODERATORS_FLAG_ID ||
    postActionTypeId === NOTIFY_USER_FLAG_ID
  );
}

export function canShowReportOption(params: {
  hidden?: boolean;
  authorUsername?: string;
  currentUsername?: string;
  canFlag?: boolean;
  isLoggedIn: boolean;
}): boolean {
  const { hidden, authorUsername, currentUsername, canFlag, isLoggedIn } =
    params;

  if (hidden) {
    return false;
  }

  if (
    authorUsername &&
    currentUsername &&
    authorUsername === currentUsername
  ) {
    return false;
  }

  if (isLoggedIn) {
    return canFlag !== false;
  }

  return !!authorUsername;
}

export function reportOptionLabel(params: {
  isLoggedIn: boolean;
  canFlag?: boolean;
}): { label: string; disabled: boolean } {
  if (params.isLoggedIn && params.canFlag === false) {
    return { label: t('Reported'), disabled: true };
  }
  return { label: t('Report'), disabled: false };
}
