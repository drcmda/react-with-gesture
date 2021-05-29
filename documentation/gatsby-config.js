module.exports = {
  flags: { PRESERVE_WEBPACK_CACHE: true },
  plugins: [
    {
      resolve: 'gatsby-plugin-pnpm',
      options: {
        include: ['smooth-doc']
      }
    },
    {
      resolve: 'smooth-doc',
      options: {
        name: '@use-gesture',
        siteUrl: 'https://use-gesture.netlify.app',
        description: `@use-gesture allows you to implement advanced UI interactions with just a few lines of code.`,
        author: 'David Bismut',
        sections: ['About', 'Reference', 'More'],
        navItems: [
          { title: 'Docs', url: '/docs/' },
          { title: 'API', url: '/docs/gestures' }
        ],
        docSearch: {
          apiKey: '8f83d46775c065911151bd1d02788227',
          indexName: 'use-gesture'
        },
        twitterAccount: 'pmndrs',
        githubRepositoryURL: 'https://github.com/pmndrs/use-gesture'
      }
    },

    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: 'UA-162749258-1'
      }
    }
  ]
}
