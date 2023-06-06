import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  ImageStyle,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleProp,
  TouchableOpacity,
  View,
} from 'react-native';
// import DateTimePicker, {
//   Event,
//   AndroidEvent,
// } from '@react-native-community/datetimepicker';
import { useRoute } from '@react-navigation/native';
import { Controller, useForm } from 'react-hook-form';
import * as ImagePicker from 'expo-image-picker';

import { CustomHeader, ShowImageModal } from '../components';
import {
  ActivityIndicator,
  Avatar,
  AvatarProps,
  Text,
  TextInput,
  TextInputType,
} from '../core-ui';
import { UploadTypeEnum } from '../generated/server';
// import { formatDateTime } from '../helpers/formatDateTime';
import {
  createReactNativeFile,
  errorHandlerAlert,
  formatExtensions,
  getFormat,
  getImage,
  getTextInputRules,
  useStorage,
} from '../helpers';
// import { formatDateTime } from '../helpers/formatDateTime';
import {
  useEditProfile,
  useLazyProfile,
  useSiteSettings,
  useStatelessUpload,
} from '../hooks';
import { makeStyles } from '../theme';
import { StackRouteProp } from '../types';

type ProfileProps = Pick<AvatarProps, 'size'> & {
  image: string;
  imageStyle?: StyleProp<ImageStyle>;
};

type ProfileForm = {
  username: string;
  name: string;
  website: string;
  bio: string;
  location: string;
  dateOfBirth: string;
};

export default function EditProfile(props: ProfileProps) {
  const styles = useStyles();

  const { imageStyle } = props;

  const {
    params: { user: selectedUser },
  } = useRoute<StackRouteProp<'EditProfile'>>();

  const storage = useStorage();
  const username = storage.getItem('user')?.username || '';

  const {
    authorizedExtensions,
    maxUsernameLength,
    minUsernameLength,
    minPasswordLength,
    fullNameRequired,
  } = useSiteSettings();
  const extensions = authorizedExtensions?.split('|');
  const normalizedExtensions = formatExtensions(extensions);

  const { control, handleSubmit, errors, setValue, getValues } =
    useForm<ProfileForm>({
      mode: 'onChange',
    });

  const [show, setShow] = useState(false);
  const [currentUserData, setCurrentUserData] = useState(selectedUser);
  const [userImage, setUserImage] = useState('');
  const [oldUsername, setOldUsername] = useState('');
  const [avatarId, setAvatarId] = useState(0);
  const [noChanges, setNoChanges] = useState(true);

  const mounted = useRef(false);
  const nameInputRef = useRef<TextInputType>(null);
  const bioInputRef = useRef<TextInputType>(null);
  const websiteInputRef = useRef<TextInputType>(null);
  const locationInputRef = useRef<TextInputType>(null);

  let setForm = useCallback(
    (user: ProfileForm & { avatar: string }) => {
      setUserImage(getImage(user.avatar));
      setOldUsername(user.username);
      setValue('username', user.username);
      setValue('name', user.name || '');
      setValue('website', user.website);
      setValue('bio', user.bio);
      setValue('location', user.location);
      // setValue(
      //   'dateOfBirth',
      //   formatDateTime(user.dateOfBirth || '', 'medium', false, 'en-US'),
      // );
    },
    [setOldUsername, setUserImage, setValue],
  );

  const { usernameInputRules, nameInputRules } = getTextInputRules({
    maxUsernameLength,
    minUsernameLength,
    minPasswordLength,
    fullNameRequired,
  });

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (selectedUser) {
      let { avatar, username } = selectedUser;
      setUserImage(getImage(avatar, 'xl'));
      setOldUsername(username);
    }
  }, [selectedUser, setOldUsername, setUserImage]);

  const { getProfile } = useLazyProfile(
    {
      variables: { username },
    },
    'HIDE_ALERT',
  );

  const { editProfile, loading: editProfileLoading } = useEditProfile({
    onCompleted: ({ editProfile: result }) => {
      if (result) {
        const {
          id,
          avatar,
          bioRaw: bio,
          websiteName: website,
          dateOfBirth,
          username,
          name,
          location,
        } = result;

        storage.setItem('user', {
          id,
          username,
          name: name || '',
          avatar,
        });

        setForm({
          username,
          name: name || '',
          avatar,
          bio: bio || '',
          website: website || '',
          dateOfBirth: dateOfBirth || '',
          location: location || '',
        });
        setCurrentUserData({
          ...currentUserData,
          username,
          name,
          avatar,
          websiteName: website,
          bioRaw: bio,
          location,
          dateOfBirth,
        });
        getProfile({ variables: { username } });
        Alert.alert(
          t('Success!'),
          t('Profile has been updated!'),
          [{ text: t('Got it') }],
          { cancelable: false },
        );
      }
    },
    onError: (error) => {
      errorHandlerAlert(error);
    },
  });

  const { upload, loading: uploadLoading } = useStatelessUpload({
    onCompleted: ({ upload: result }) => {
      if (result && mounted.current) {
        setUserImage(result.url);
        setAvatarId(result.id);
      }
    },
    onError: (error) => {
      errorHandlerAlert(error);
    },
  });

  // const onChangeDate = (
  //   event: Event | AndroidEvent,
  //   selectedDate: Date | undefined,
  // ) => {
  //   const currentDate = selectedDate
  //     ? new Date(selectedDate).toISOString()
  //     : date;
  //   const currentSelectedDate = formatDateTime(
  //     selectedUser.dateOfBirth ? selectedUser.dateOfBirth : '',
  //     'medium',
  //     false,
  //     'en-US',
  //   );
  //   if (
  //     currentSelectedDate ===
  //     formatDateTime(currentDate, 'medium', false, 'en-US')
  //   ) {
  //     setNoChanges(true);
  //   } else {
  //     setNoChanges(false);
  //   }
  //   setShow(Platform.OS === 'ios');
  //   setDate(currentDate);
  //   setValue(
  //     'dateOfBirth',
  //     formatDateTime(currentDate, 'medium', false, 'en-US'),
  //   );
  // };

  // const showMode = () => {
  //   setShow(!show);
  // };

  // const toggleDatepicker = () => {
  //   showMode();
  // };

  const onPressCancel = () => {
    setShow(false);
  };

  const pickImage = async () => {
    let stringifyExtensions = normalizedExtensions.toString();
    let user = storage.getItem('user');
    if (user) {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
      if (!result.canceled) {
        let format = getFormat(result.assets[0].uri);
        if (normalizedExtensions.includes(format)) {
          const reactNativeFile = createReactNativeFile(result.assets[0].uri);
          upload({
            variables: {
              file: reactNativeFile,
              userId: user?.id,
              type: UploadTypeEnum.Avatar,
            },
          });
          setNoChanges(false);
        } else {
          Alert.alert(
            t('Failed!'),
            t(`Please upload image with {stringifyExtensions} format`, {
              stringifyExtensions,
            }),
            [{ text: t('Got it') }],
          );
        }
      }
      return;
    }
  };

  const onPressRight = handleSubmit(() => {
    let dateOfBirth = new Date(getValues('dateOfBirth'));
    dateOfBirth.setDate(dateOfBirth.getDate() + 1);
    let newUsername = getValues('username');
    let newName = getValues('name');
    let newWebsite = getValues('website');
    let newBio = getValues('bio');
    let newLocation = getValues('location');

    editProfile({
      variables: {
        newUsername: oldUsername !== newUsername ? newUsername : undefined,
        username: oldUsername,
        editProfileInput: {
          name: newName,
          website: newWebsite,
          bioRaw: newBio,
          location: newLocation,
          dateOfBirth: dateOfBirth.toJSON(),
        },
        uploadId: avatarId,
      },
    });

    setNoChanges(true);
  });

  const scrollViewRef = useRef<ScrollView>(null);
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      contentContainerStyle={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      enabled
      keyboardVerticalOffset={90}
    >
      <ScrollView
        ref={scrollViewRef}

        // onContentSizeChange={() => {
        //   if (scrollViewRef.current && show) {
        //     scrollViewRef.current.scrollToEnd({ animated: true });
        //   }
        // }}
      >
        <CustomHeader
          title=""
          rightTitle="Save"
          onPressRight={onPressRight}
          noShadow
          isLoading={editProfileLoading}
          disabled={noChanges || uploadLoading}
        />
        <View style={styles.pictureContainer}>
          {!uploadLoading ? (
            <Avatar
              src={userImage}
              size="l"
              style={[styles.image, imageStyle]}
              onPress={() => {
                setShow(true);
              }}
            />
          ) : (
            <ActivityIndicator size="large" style={styles.avatarLoading} />
          )}
          <TouchableOpacity
            onPress={pickImage}
            style={styles.changePictureContainer}
            disabled={uploadLoading || editProfileLoading}
          >
            <Text color={!uploadLoading ? 'primary' : 'textLighter'}>
              {t('Change Picture')}
            </Text>
          </TouchableOpacity>
        </View>

        {!editProfileLoading && selectedUser && currentUserData && (
          <View style={styles.inputContainer}>
            <Controller
              name="username"
              defaultValue={currentUserData.username}
              rules={usernameInputRules}
              control={control}
              render={({ onChange, value }) => (
                <TextInput
                  label={t('Username')}
                  error={errors.username != null}
                  errorMsg={errors.username?.message}
                  value={value}
                  editable={
                    currentUserData.canEditUsername || currentUserData.admin
                  }
                  onChangeText={(text) => {
                    if (currentUserData.username === text) {
                      setNoChanges(true);
                    } else {
                      setNoChanges(false);
                    }
                    onChange(text);
                  }}
                  onSubmitEditing={() => nameInputRef.current?.focus()}
                  returnKeyType="next"
                  autoCapitalize="none"
                  style={styles.spacingBottom}
                />
              )}
            />
            <Controller
              name="name"
              defaultValue={currentUserData.name}
              rules={nameInputRules}
              control={control}
              render={({ onChange, value }) => (
                <TextInput
                  inputRef={nameInputRef}
                  label={t('Name')}
                  error={errors.name != null}
                  value={value}
                  onChangeText={(text) => {
                    if (currentUserData.name === text) {
                      setNoChanges(true);
                    } else {
                      setNoChanges(false);
                    }
                    onChange(text);
                  }}
                  onSubmitEditing={() => websiteInputRef.current?.focus()}
                  returnKeyType="next"
                  autoCapitalize="words"
                  style={styles.spacingBottom}
                />
              )}
            />
            <Controller
              name="website"
              defaultValue={currentUserData.websiteName}
              control={control}
              render={({ onChange, value }) => (
                <TextInput
                  inputRef={websiteInputRef}
                  label={t('Website')}
                  placeholder={t('Insert your website')}
                  error={errors.website != null}
                  value={value}
                  onChangeText={(text) => {
                    if (currentUserData.websiteName === text) {
                      setNoChanges(true);
                    } else {
                      setNoChanges(false);
                    }
                    onChange(text);
                  }}
                  onSubmitEditing={() => bioInputRef.current?.focus()}
                  returnKeyType="next"
                  autoCapitalize="none"
                  style={styles.spacingBottom}
                />
              )}
            />
            <Controller
              name="bio"
              defaultValue={currentUserData.bioRaw}
              control={control}
              render={({ onChange, value }) => (
                <TextInput
                  inputRef={bioInputRef}
                  label={t('Bio')}
                  placeholder={t('Insert your bio')}
                  error={errors.bio != null}
                  value={value}
                  onChangeText={(text) => {
                    if (currentUserData.bioRaw === text) {
                      setNoChanges(true);
                    } else {
                      setNoChanges(false);
                    }
                    onChange(text);
                  }}
                  autoCapitalize="none"
                  style={styles.spacingBottom}
                  multiline
                  maxLength={120}
                />
              )}
            />
            <Controller
              name="location"
              defaultValue={currentUserData.location}
              control={control}
              render={({ onChange, value }) => (
                <TextInput
                  inputRef={locationInputRef}
                  label={t('Location')}
                  placeholder={t('Insert your location')}
                  error={errors.location != null}
                  value={value}
                  onChangeText={(text) => {
                    if (currentUserData.location === text) {
                      setNoChanges(true);
                    } else {
                      setNoChanges(false);
                    }
                    onChange(text);
                  }}
                  returnKeyType="done"
                  autoCapitalize="none"
                  style={styles.spacingBottom}
                />
              )}
            />
            {/* 
            // Commented out because normal discourse doesn't have DoB (Need plugins)
            <Controller
              name="dateOfBirth"
              defaultValue={formatDateTime(
                selectedUser.dateOfBirth || '',
                'medium',
                false,
                'en-US',
              )}
              control={control}
              render={({ value }) => (
                <View>
                  <TextInput
                    label={t('Date of Birth')}
                    placeholder={t('Insert your date of birth')}
                    editable={false}
                    value={value}
                    style={styles.spacingBottom}
                    rightIcon="Event"
                    onPressIcon={toggleDatepicker}
                    onTouchStart={toggleDatepicker}
                  />
                  {show && (
                    <DateTimePicker
                      testID="dateTimePicker"
                      value={new Date(date)}
                      mode={t('date')}
                      display="default"
                      onChange={onChangeDate}
                    />
                  )}
                </View>
              )}
            /> */}

            <ShowImageModal
              show={show}
              userImage={{ uri: userImage }}
              onPressCancel={onPressCancel}
            />
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const useStyles = makeStyles(({ colors, spacing }) => ({
  container: {
    flexGrow: 1,
    backgroundColor: colors.backgroundDarker,
    flex: 1,
  },
  inputContainer: {
    paddingHorizontal: spacing.xxl,
    backgroundColor: colors.background,
    marginTop: spacing.m,
    paddingTop: spacing.l,
  },
  spacingBottom: {
    paddingBottom: spacing.xxl,
    paddingVertical: spacing.l,
  },
  image: {
    alignItems: 'center',
  },
  pictureContainer: {
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingBottom: spacing.xl,
  },
  changePictureContainer: {
    paddingVertical: spacing.xl,
  },
  avatarLoading: {
    marginTop: 40,
    marginBottom: 20,
  },
}));
