import { themes as prismThemes } from 'prism-react-renderer';
import path from 'path';
import { fileURLToPath } from 'url';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Personal Finance',
  tagline: 'A comprehensive guide to personal finance',
  favicon: 'favicon.ico',
  url: 'https://buildthenmarket.github.io',
  organizationName: 'buildthenmarket',
  projectName: 'Personal-Finance',
  baseUrl: '/Personal-Finance/',
  deploymentBranch: 'main',
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
            'https://github.com/ambitious-royalty/bag-flow/tree/main/',
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
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
        },
        {
          type: 'dropdown',
          label: '📚 Learning',
          position: 'left',
          items: [
            {
              label: 'Terms',
              to: '/Terms', // docs/Terms.md
            },
            {
              label: 'Links',
              to: '/Links', // docs/Links.md
            },
            {
              label: 'Tools',
              to: '/Tools', // docs/Tools.md
            }
          ],
        },
        {
          type: 'dropdown',
          label: '💳 Credit and Debt',
          position: 'left',
          items: [
            {
              label: 'Credit Cards',
              to: '/Credit and Debt/Credit Cards',
            },
            {
              label: 'Debt',
              to: '/Credit and Debt',
            },
          ],
        },
        {
          type: 'dropdown',
          label: '🏦 Saving and Investing',
          position: 'left',
          items: [
            {
              label: 'Retirement',
              to: '/Retirement',
            },
            {
              label: 'Investing',
              to: '/Investing', // docs/Investing/index.md
            }
          ],
        },
        {
          label: '🤑 Spending',
          to: '/spending', // docs/Spending/index.md
          position: 'left',
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
              href: 'https://github.com/ambitious-royalty/bag-flow',
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
