import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { ScrollView, View } from 'react-native';

import { CustomHeader } from '../../components';
import {
  ADDITIONAL_RESOURCES,
  ADDITIONAL_RESOURCE_TYPES,
  AdditionalResourceType,
} from '../../constants/accountResources';
import { Divider, Text } from '../../core-ui';
import { makeStyles } from '../../theme';
import { StackNavProp } from '../../types';

import MenuItem from '../Profile/components/MenuItem';

export default function AdditionalResources() {
  const styles = useStyles();
  const { navigate } = useNavigation<StackNavProp<'AdditionalResources'>>();

  const onPressResource = (resourceType: AdditionalResourceType) => {
    navigate('AdditionalResourceDetail', { resourceType });
  };

  return (
    <View style={styles.container}>
      <CustomHeader title={t('Additional Resources')} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text color="textLight" style={styles.description}>
          {t(
            'Some account actions must be completed on the Biohacking Forum website after you sign in.',
          )}
        </Text>
        <View style={styles.menuContainer}>
          {ADDITIONAL_RESOURCE_TYPES.map((resourceType, index) => {
            const resource = ADDITIONAL_RESOURCES[resourceType];
            return (
              <React.Fragment key={resourceType}>
                {index > 0 ? <Divider style={styles.dividerList} /> : null}
                <MenuItem
                  title={resource.title()}
                  iconName={resource.iconName}
                  onPress={() => onPressResource(resourceType)}
                />
              </React.Fragment>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const useStyles = makeStyles(({ colors, spacing }) => ({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundDarker,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: spacing.xxxl,
  },
  description: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.l,
    paddingBottom: spacing.m,
    lineHeight: 22,
  },
  menuContainer: {
    backgroundColor: colors.background,
    marginTop: spacing.m,
  },
  dividerList: {
    flexGrow: 0,
    marginLeft: 64,
    marginRight: spacing.xxl,
  },
}));
