import React, { useState } from 'react';
import { View, TouchableWithoutFeedback } from 'react-native';

import { Markdown, MarkdownProps } from '../components/Markdown';
import {
  extractCollapsibleContent,
  generateMarkdownContent,
  isCollapsible,
  separateCollapsibleInContent,
} from '../helpers';
import { Icon, Text } from '../core-ui';
import { makeStyles, useTheme } from '../theme';

type Props = MarkdownProps & {
  renderPollsInCollapsible?: () => React.ReactNode;
};

export function MarkdownContent(props: Props) {
  const { content, renderPollsInCollapsible, ...otherProps } = props;
  const splittedContent = separateCollapsibleInContent(content);

  return splittedContent.map((content, index) => {
    if (isCollapsible(content)) {
      const { title, details } = extractCollapsibleContent(content);
      return (
        <Collapsible
          key={`content-${index}-${title}`}
          title={title}
          details={details}
          renderPollsInCollapsible={renderPollsInCollapsible}
        />
      );
    } else {
      return (
        <Markdown key={`content-${index}`} content={content} {...otherProps} />
      );
    }
  });
}

type CollapsibleProps = {
  title: string;
  details: string;
  renderPollsInCollapsible?: () => React.ReactNode;
};

export function Collapsible(props: CollapsibleProps) {
  const { title, details, renderPollsInCollapsible } = props;
  const styles = useStyles();
  const { colors } = useTheme();

  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={() => setIsOpen(!isOpen)}>
        <View style={styles.titleContainer}>
          <Text variant="bold" style={styles.flex}>
            {title}
          </Text>
          <Icon
            name={isOpen ? 'ChevronUp' : 'ChevronDown'}
            color={colors.textLighter}
          />
        </View>
      </TouchableWithoutFeedback>
      {isOpen && (
        <View style={styles.markdownContainer}>
          <MarkdownContent
            content={generateMarkdownContent(details)}
            nonClickable={true}
            renderPollsInCollapsible={renderPollsInCollapsible}
          />
        </View>
      )}
    </View>
  );
}

const useStyles = makeStyles(({ colors, spacing }) => ({
  flex: { flex: 1 },
  container: {
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.grey,
    marginTop: spacing.m,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: spacing.m,
    backgroundColor: colors.background,
  },
  markdownContainer: {
    padding: spacing.m,
    backgroundColor: colors.backgroundDarker,
    borderTopWidth: 1,
    borderColor: colors.grey,
  },
}));
