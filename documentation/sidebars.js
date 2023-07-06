module.exports = {
  docs: {
    Lexicon: [
      'intro',
      'rationale',
      'technologies',
      'concepts',
      'discourse-features',
      'supported-devices',
      'contributing',
      'commercial-support',
    ],
    'Getting Started': ['quick-start', 'setup', 'customize'],
    'Configuring the Mobile App': ['env-mobile'],
    'White Labeling': ['white-labeling', 'assets', 'theming'],
    'Deploying Prose': ['deployment', 'env-prose', 'dedicated'],
    'Configuring Discourse': ['optimal'],
    'Publishing your App': [
      'app-store',
      'play-store',
      'lexicon-updates',
      'troubleshooting-build',
    ],
    Plugin: ['pushNotifications/introduction'],
  },
  tutorial: {
    Tutorial: [
      'tutorial/intro',
      'tutorial/setup',
      'tutorial/setup-cloud-server',
      'tutorial/setup-discourse',
      'tutorial/install-prose',
      'tutorial/setup-mobile',
      'tutorial/white-label',
      'tutorial/building',
      'tutorial/publishing',
      'tutorial/updating',
    ],
  },
  plugin: [
    {
      type: 'doc',
      id: 'pushNotifications/introduction', // document ID
      label: 'Introduction', // sidebar label
    },
    {
      type: 'doc',
      id: 'pushNotifications/plugin-interaction', // document ID
      label: 'How Push Notifications work with Lexicon', // sidebar label
    },
    {
      type: 'category',
      label: 'Setup',
      items: [
        'pushNotifications/setup/enable-plugin',
        'pushNotifications/setup/testing-mobile-push-notification',
      ],
    },
  ],
};
