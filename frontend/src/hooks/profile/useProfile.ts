import {
  LazyQueryHookOptions,
  MutationHookOptions,
  QueryHookOptions,
} from '@apollo/client';

import {
  EditProfile as EditProfileType,
  EditProfileVariables,
} from '../../generated/server/EditProfile';
import {
  Profile as ProfileType,
  ProfileVariables,
} from '../../generated/server/Profile';
import { EDIT_PROFILE } from '../../graphql/server/editProfile';
import { PROFILE } from '../../graphql/server/profile';
import { ErrorAlertOptionType } from '../../types';
import { useLazyQuery, useMutation, useQuery } from '../../utils';

export function useProfile(
  options?: QueryHookOptions<ProfileType, ProfileVariables>,
  errorAlert: ErrorAlertOptionType = 'SHOW_ALERT',
) {
  const { data, loading, error, refetch } = useQuery<
    ProfileType,
    ProfileVariables
  >(
    PROFILE,
    {
      ...options,
    },
    errorAlert,
  );

  return { data, loading, error, refetch };
}

export function useLazyProfile(
  options?: LazyQueryHookOptions<ProfileType, ProfileVariables>,
  errorAlert: ErrorAlertOptionType = 'SHOW_ALERT',
) {
  const [getProfile, { data }] = useLazyQuery<ProfileType, ProfileVariables>(
    PROFILE,
    {
      ...options,
    },
    errorAlert,
  );

  return { getProfile, data };
}

export function useEditProfile(
  options?: MutationHookOptions<EditProfileType, EditProfileVariables>,
) {
  const [editProfile, { loading }] = useMutation<
    EditProfileType,
    EditProfileVariables
  >(EDIT_PROFILE, {
    ...options,
  });

  return { editProfile, loading };
}
