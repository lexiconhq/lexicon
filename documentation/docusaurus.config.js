module.exports = {
  title: 'Lexicon',
  tagline: 'An open-source, customizable mobile app for your Discourse Site',
  url: 'https://docs.lexicon.is',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  favicon: 'img/favicon.ico',
  organizationName: 'kodefox',
  projectName: 'lexicon',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh-Hans'],
  },
  themeConfig: {
    navbar: {
      title: 'Lexicon',
      logo: {
        alt: 'Lexicon Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'doc',
          label: 'Documentation',
          position: 'left',
          docId: 'intro',
        },
        {
          type: 'doc',
          docId: 'tutorial/intro',
          label: 'Tutorial',
          position: 'left',
        },
        {
          type: 'docsVersionDropdown',
          position: 'right',
        },
        {
          type: 'localeDropdown',
          position: 'right',
        },
        {
          href: 'https://github.com/lexiconhq/lexicon',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      copyright: `Copyright © ${new Date().getFullYear()} Lexicon. MIT License. Built with ❤️ by KodeFox.`,
    },
    zoom: {
      selector: '.markdown :not(em) > img',
      background: {
        light: 'rgb(255, 255, 255)',
        dark: 'rgb(50, 50, 50)',
      },
      // options you can specify via https://github.com/francoischalifour/medium-zoom#usage
      config: {
        margin: 48,
        scrollOffset: 70,
      },
    },
  },
  plugins: ['docusaurus-plugin-image-zoom'],
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl:
            'https://github.com/lexiconhq/lexicon/blob/master/documentation/',
          routeBasePath: '/',
          onlyIncludeVersions: ['1.0.0', '2.0.0-beta'],
          versions: {
            '2.0.0-beta': {
              path: 'version-2.0.0-beta',
              banner: 'none',
            },
            '1.0.0': {
              path: 'version-1.0.0',
              banner: 'none',
            },
          },
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
