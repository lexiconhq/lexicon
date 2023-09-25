import { useRoute } from '@react-navigation/native';
import React, { ReactNode, useMemo } from 'react';
import { FlatList, View } from 'react-native';

import Config from '../../Config';
import {
  LoadingOrError,
  NetworkStatus,
  WithRequestFailed,
} from '../components';
import { getProseEndpoint } from '../constants';
import { Text, Link, Divider } from '../core-ui';
import { useHealthQuery } from '../generated/server';
import { makeStyles } from '../theme';
import { RootStackRouteProp } from '../types';

export default function Troubleshoot() {
  let style = useStyles();
  let {
    params: { type },
  } = useRoute<RootStackRouteProp<'Troubleshoot'>>();
  let isProseReachable = type !== 'NoConnection' && type !== 'ProseUnreachable';
  let { data, loading, error } = useHealthQuery({
    skip: !isProseReachable,
  });
  let { title, description, documentationLink } = troubleshootContent[type];

  let contents: Array<TroubleshootSectionProps> = useMemo(() => {
    let contents = [
      {
        title,
        description,
      },
      {
        description: 'Prose Endpoint (src/constants/app.ts)',
        content: (
          <Text>
            {getProseEndpoint(
              Config.proseUrl,
              'inferDevelopmentHost' in Config
                ? Config.inferDevelopmentHost
                : undefined,
            )}
          </Text>
        ),
      },
    ];
    if (documentationLink) {
      contents.push({
        description: 'Documentation Link',
        content: <Link url={documentationLink} />,
      });
    }
    if (isProseReachable) {
      contents.push({
        description: 'Prose Environment Variables',
        content: (
          <>
            {loading || error ? (
              <LoadingOrError loading={loading} message={error?.message} />
            ) : null}
            {data?.health ? (
              <Text>{`PROSE_DISCOURSE_HOST=${data.health.discourseHost}`}</Text>
            ) : null}
          </>
        ),
      });
    }
    return contents;
  }, [
    data?.health,
    description,
    documentationLink,
    error,
    isProseReachable,
    loading,
    title,
  ]);

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
  ProseUnreachable: {
    title: 'Prose Unreachable',
    description: `The Prose GraphQL API was not reachable from your device. This could be due to the Prose endpoint being misconfigured within the mobile app. Please verify that the value for 'PROSE_DISCOURSE_HOST' is correct. If you continue to have issues, check the documentation.`,
    documentationLink: 'https://docs.lexicon.is/env-mobile',
  },
  REQUEST_FAILED: {
    title: 'Request failed',
    description:
      'Something went wrong with a request to the Prose GraphQL API. To troubleshoot, check the response from the server in the React Native network inspector.',
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
