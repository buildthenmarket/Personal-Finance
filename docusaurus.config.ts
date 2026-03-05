import { themes as prismThemes } from 'prism-react-renderer';
import path from 'path';
import { fileURLToPath } from 'url';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Personal Finance',
  tagline: 'A comprehensive guide to personal finance',
  favicon: 'favicon.ico',
  organizationName: 'buildthenmarket',
  deploymentBranch: 'gh-pages',
  projectName: 'Personal-Finance',
  url: 'https://buildthenmarket.github.io',
  baseUrl: '/Personal-Finance/',
  onBrokenLinks: 'throw',
  onDuplicateRoutes: 'warn',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  plugins: [
    path.resolve(path.dirname(fileURLToPath(import.meta.url)), './plugins/pdf-pages-plugin.ts'),  // Must be first to generate MDX before docs plugin loads
    [
      'docusaurus-plugin-dotenv',
      {
        path: './.env',
        safe: true,        // Validate against .env.example
        systemvars: false, // Don't expose system environment variables
        silent: false,
      }
    ],
    [
      '@easyops-cn/docusaurus-search-local',
      /** @type {import("@easyops-cn/docusaurus-search-local").PluginOptions} */
      {
        hashed: true,
        indexBlog: false,
        language: ['en'],
        highlightSearchTermsOnTargetPage: true,
        explicitSearchResultPath: true,
        docsDir: 'docs',
        docsRouteBasePath: '/',
      },
    ],
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/buildthenmarket/Personal-Finance/tree/main/',
        },
        blog: false, // No blog for this site
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  headTags: [],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    docs: {
      sidebar: {
        hideable: true,
        autoCollapseCategories: true
      },
    },
    navbar: {
      title: '💰 Personal Finance Guide 📊',
      items: [
        {
          type: 'dropdown',
          label: '📘 Foundations',
          position: 'left',
          items: [
            {
              label: 'Home',
              to: '/',
            },
            {
              label: 'Earning',
              to: '/Foundations/Earning',
            },
            {
              label: 'Spending',
              to: '/Foundations/Spending',
            },
            {
              label: 'Credit and Debt',
              to: '/Foundations/Credit-And-Debt',
            },
            {
              label: 'Accounting',
              to: '/Foundations/Accounting',
            },
          ],
        },
        {
          type: 'dropdown',
          label: '📈 Build Wealth',
          position: 'left',
          items: [
            {
              label: 'Investing',
              to: '/Build-Wealth/Investing',
            },
            {
              label: 'Retirement',
              to: '/Build-Wealth/Retirement',
            },
            {
              label: 'Crypto',
              to: '/Build-Wealth/Crypto',
            },
          ],
        },
        {
          type: 'dropdown',
          label: '🛡️ Protect Wealth',
          position: 'left',
          items: [
            {
              label: 'Tax',
              to: '/Protect-Wealth/Tax/Income-Tax',
            },
            {
              label: 'Healthcare',
              to: '/Protect-Wealth/Healthcare',
            },
            {
              label: 'Life Event',
              to: '/Protect-Wealth/Life-Event/Divorce',
            },
          ],
        },
        {
          type: 'dropdown',
          label: '🏠 Housing',
          position: 'left',
          items: [
            {
              label: 'Real Estate',
              to: '/Housing/Real-Estate',
            },
            {
              label: 'Locations',
              to: '/Housing/Locations',
            },
          ],
        },
        {
          type: 'dropdown',
          label: '📚 Reference',
          position: 'left',
          items: [
            {
              label: 'Terms',
              to: '/Reference/Terms',
            },
            {
              label: 'Links',
              to: '/Reference/Links',
            },
            {
              label: 'Travel',
              to: '/Reference/Travel',
            },
          ],
        }
      ]
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/buildthenmarket/Personal-Finance',
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
