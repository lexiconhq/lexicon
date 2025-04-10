import React from 'react';
import { ScrollView, StyleProp, View, ViewStyle } from 'react-native';

import { SelectImagePreviewEdit } from '../../../components';
import { makeStyles, useTheme } from '../../../theme';
import { Icon } from '../../../core-ui';

type Props = {
  imageUrls: Array<string>;
  onDelete?: (index: number) => void;
  style?: StyleProp<ViewStyle>;
  isEdit?: boolean;
  onPressEdit?: () => void;
  disableEdit?: boolean;
};

export function ListImageSelected(props: Props) {
  const { imageUrls, onDelete, style, isEdit, onPressEdit, disableEdit } =
    props;

  const styles = useStyles();
  const { colors } = useTheme();

  return (
    <View style={[styles.row, isEdit && styles.rowContainer, style]}>
      <ScrollView
        style={styles.container}
        horizontal
        showsHorizontalScrollIndicator={false}
        bounces={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.row}>
          {imageUrls.map((url, index) => {
            return (
              <SelectImagePreviewEdit
                key={`selectedImage-${index}`}
                src={url}
                onDelete={() => onDelete && onDelete(index)}
                style={styles.image}
                imageSize={isEdit ? 's' : 'm'}
                disableDelete={isEdit}
              />
            );
          })}
        </View>
      </ScrollView>
      {isEdit && (
        <Icon
          name="Edit"
          color={colors.textLighter}
          onPress={onPressEdit}
          disabled={disableEdit}
        />
      )}
    </View>
  );
}

const useStyles = makeStyles(({ spacing }) => ({
  container: { flexGrow: 1 },
  row: {
    flexDirection: 'row',
  },

  rowContainer: {
    alignItems: 'center',
  },

  image: {
    marginRight: spacing.xl,
    justifyContent: 'center',
  },
}));
