'use strict';

module.exports = () => ({
  'strapi-5-sitemap-plugin': {
    enabled: true,
    config: {
      hostname: 'https://crypt-pseo.vercel.app',
      excludedTypes: [],
      defaultChangefreq: 'weekly',
      defaultPriority: 0.7,
    },
  },
});
