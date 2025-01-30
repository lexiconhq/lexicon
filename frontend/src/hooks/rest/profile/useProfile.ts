import {
  LazyQueryHookOptions,
  MutationHookOptions,
  QueryHookOptions,
} from '@apollo/client';

import {
  EditProfileDocument,
  EditProfileMutationVariables,
  EditProfileMutation as EditProfileType,
  ProfileDocument,
  ProfileQueryVariables,
  ProfileQuery as ProfileType,
} from '../../../generatedAPI/server';
import { ErrorAlertOptionType } from '../../../types';
import { useLazyQuery, useMutation, useQuery } from '../../../utils';

export function useProfile(
  options?: QueryHookOptions<ProfileType, ProfileQueryVariables>,
  errorAlert: ErrorAlertOptionType = 'SHOW_ALERT',
) {
  const { data, loading, error, refetch } = useQuery<
    ProfileType,
    ProfileQueryVariables
  >(
    ProfileDocument,
    {
      ...options,
    },
    errorAlert,
  );

  return { data, loading, error, refetch };
}

export function useLazyProfile(
  options?: LazyQueryHookOptions<ProfileType, ProfileQueryVariables>,
  errorAlert: ErrorAlertOptionType = 'SHOW_ALERT',
) {
  const [getProfile, { data }] = useLazyQuery<
    ProfileType,
    ProfileQueryVariables
  >(
    ProfileDocument,
    {
      ...options,
    },
    errorAlert,
  );

  return { getProfile, data };
}

export function useEditProfile(
  options?: MutationHookOptions<EditProfileType, EditProfileMutationVariables>,
) {
  const [editProfile, { loading }] = useMutation<
    EditProfileType,
    EditProfileMutationVariables
  >(EditProfileDocument, {
    ...options,
  });

  return { editProfile, loading };
}
