import { useRoute } from '@react-navigation/native';
import React, { ReactNode, useMemo } from 'react';
import { FlatList, View } from 'react-native';

import { NetworkStatus, WithRequestFailed } from '../components';
import { discourseHost } from '../constants';
import { Divider, Link, Text } from '../core-ui';
import { makeStyles } from '../theme';
import { RootStackRouteProp } from '../types';

export default function Troubleshoot() {
  let style = useStyles();
  let {
    params: { type },
  } = useRoute<RootStackRouteProp<'Troubleshoot'>>();
  let isDiscourseReachable =
    type !== 'NoConnection' && type !== 'DiscourseUnreachable';
  let { title, description, documentationLink } = troubleshootContent[type];

  let contents: Array<TroubleshootSectionProps> = useMemo(() => {
    let contents = [
      {
        title,
        description,
      },
      {
        description: 'Discourse Endpoint (./Config.ts)',
        content: <Text>{discourseHost}</Text>,
      },
    ];
    if (documentationLink) {
      contents.push({
        description: 'Documentation Link',
        content: <Link url={documentationLink} />,
      });
    }
    if (isDiscourseReachable) {
      contents.push({
        description: 'Discourse Environment Variables',
        content: <Text>{`DISCOURSE_HOST=${discourseHost}`}</Text>,
      });
    }
    return contents;
  }, [description, documentationLink, isDiscourseReachable, title]);

  return (
    <View style={style.container}>
      <FlatList
        data={contents}
        renderItem={({ item }) => <TroubleshootSection {...item} />}
        ItemSeparatorComponent={() => <Divider verticalSpacing="xl" />}
      />
    </View>
  );
}

type TroubleshootSectionProps = {
  title?: string;
  description?: string;
  content?: ReactNode;
};
function TroubleshootSection(props: TroubleshootSectionProps) {
  let style = useStyles();
  let { title, description, content } = props;
  return (
    <View style={style.sectionContainer}>
      {title && (
        <Text variant="bold" size="l" style={style.title}>
          {title}
        </Text>
      )}
      {description && <Text>{description}</Text>}
      {content}
    </View>
  );
}

type TroubleshootContent = {
  title: string;
  description: string;
  documentationLink?: string;
};

let troubleshootContent: Record<
  WithRequestFailed<Exclude<NetworkStatus, 'Online'>>,
  TroubleshootContent
> = {
  NoConnection: {
    title: 'No Connection',
    description:
      'Your device does not appear to be connected to the internet. Please double-check your connection.',
  },
  DiscourseUnreachable: {
    title: 'Discourse Unreachable',
    description: `The Discourse API could not be reached from your device. This might be due to the Discourse endpoint being misconfigured within the mobile app. Please ensure that the 'discourseUrl' value in the app's configuration is correct. If the issue persists, consult the documentation.`,
    documentationLink: 'https://docs.lexicon.is/env-mobile',
  },
  REQUEST_FAILED: {
    title: 'Request failed',
    description:
      'Something went wrong with a request to the Discourse API. To troubleshoot, check the response from the server in the reactotron.',
  },
};

let useStyles = makeStyles(({ colors, spacing }) => ({
  container: {
    padding: spacing.xxl,
    backgroundColor: colors.background,
    height: '100%',
    flex: 1,
  },
  sectionContainer: {
    backgroundColor: colors.background,
  },
  title: {
    marginBottom: 8,
  },
}));
