'use strict';

/**
 * Bootstrap: ensure Public role has find + findOne on all content-type collections.
 * Runs on every Strapi start — idempotent (skips already-granted permissions).
 */
module.exports = async ({ strapi }) => {
  const PUBLIC_COLLECTIONS = [
    'api::casino-review.casino-review',
    'api::guide-page.guide-page',
    'api::game-type-page.game-type-page',
    'api::trust-page.trust-page',
    'api::best-of-page.best-of-page',
    'api::bonus-page.bonus-page',
    'api::comparison-content.comparison-content',
    // New collections
    'api::coin-page.coin-page',
    'api::glossary-term.glossary-term',
    'api::author.author',
  ];

  const PUBLIC_ACTIONS = ['find', 'findOne'];

  try {
    // Get the Public role
    const publicRole = await strapi
      .query('plugin::users-permissions.role')
      .findOne({ where: { type: 'public' }, populate: ['permissions'] });

    if (!publicRole) {
      strapi.log.warn('[bootstrap] Public role not found — skipping permission setup');
      return;
    }

    for (const uid of PUBLIC_COLLECTIONS) {
      for (const action of PUBLIC_ACTIONS) {
        const permKey = `${uid}.${action}`;
        const alreadyGranted = publicRole.permissions?.some(
          (p) => p.action === permKey
        );
        if (alreadyGranted) continue;

        await strapi.query('plugin::users-permissions.permission').create({
          data: {
            action: permKey,
            role: publicRole.id,
          },
        });
        strapi.log.info(`[bootstrap] Granted public ${action} → ${uid}`);
      }
    }
    strapi.log.info('[bootstrap] Public permissions check complete');
  } catch (err) {
    strapi.log.error('[bootstrap] Permission setup failed:', err.message);
  }
};
