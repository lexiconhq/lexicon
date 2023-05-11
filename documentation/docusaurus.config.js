module.exports = {
  title: 'Lexicon',
  tagline: 'An open-source, customizable mobile app for your Discourse Site',
  url: 'https://docs.lexicon.is',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  favicon: 'img/favicon.ico',
  organizationName: 'kodefox',
  projectName: 'lexicon',
  themeConfig: {
    navbar: {
      title: 'Lexicon',
      logo: {
        alt: 'Lexicon Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          to: '/',
          activeBasePath: 'docs',
          label: 'Documentation',
          position: 'left',
        },
        {
          type: 'doc',
          docId: 'tutorial/intro',
          label: 'Tutorial',
          position: 'left',
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
          editUrl: 'https://github.com/lexiconhq/lexicon/blob/master/documentation/',
          routeBasePath: '/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
