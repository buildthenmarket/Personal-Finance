import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Personal Finance Guide',
  tagline: 'A comprehensive guide to personal finance',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://your-site.com', // TODO: Update with Cloudflare URL
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'your-org', // Usually your GitHub org/user name.
  projectName: 'personal-finance', // Usually your repo name.

  onBrokenLinks: 'throw',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  plugins: [
    './plugins/pdf-pages-plugin.js',  // Must be first to generate MDX before docs plugin loads
    [
      'docusaurus-plugin-dotenv',
      {
        path: './.env',
        safe: false,
        systemvars: true,
        silent: false,
      }
    ],
    [
      '@easyops-cn/docusaurus-search-local',
      {
        hashed: true,
        language: ['en'],
        highlightSearchTermsOnTargetPage: true,
        explicitSearchResultPath: true,
      },
    ],
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.js',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/your-org/personal-finance/tree/main/',
        },
        blog: false, // No blog for this site
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  headTags: [
    {
      tagName: 'script',
      attributes: {
        src: 'https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js',
      },
    },
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    docs: {
      sidebar: {
        hideable: true,
      },
    },
    navbar: {
      title: '💰 Personal Finance Guide 📊',
      items: [
        // {
        //   type: 'docSidebar',
        //   sidebarId: 'tutorialSidebar',
        //   position: 'left',
        //   label: 'Guide',
        // },
        {
          label: 'Categories',
          position: 'left',
          items: [
            {
              label: 'Accounting',
              href: '/Accounting/',
            },
            {
              label: 'Banks',
              href: '/Banks/',
            },
            {
              label: 'Credit and Debt',
              href: '/Credit%20and%20Debt/',
            },
            {
              label: 'Crypto',
              href: '/Crypto/',
            },
            {
              label: 'Earning',
              href: '/Earning/',
            },
            {
              label: 'Healthcare',
              href: '/Healthcare/',
            },
            {
              label: 'Housing',
              href: '/Housing/',
            },
            {
              label: 'Investing',
              href: '/Investing/',
            },
          ],
        },
        {
          href: 'https://github.com/your-org/personal-finance',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Community',
          items: [
            {
              label: 'Stack Overflow',
              href: 'https://stackoverflow.com/questions/tagged/personal-finance',
            },
            {
              label: 'Discord',
              href: 'https://discordapp.com/invite/personal-finance',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/your-org/personal-finance',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Personal Finance Guide. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
