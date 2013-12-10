var App = window.App = Ember.Application.create({
    /* Router logging */
    LOG_TRANSITIONS: true,
    LOG_TRANSITIONS_INTERNAL: true,
    /* View logging */
    LOG_VIEW_LOOKUPS: true,
    /* Controller logging */
    LOG_ACTIVE_GENERATION: true
});

/* Order and include as you please. */
require('scripts/controllers/*');
require('scripts/store');
require('scripts/models/*');
require('scripts/routes/*');
require('scripts/views/*');
require('scripts/router');
require('scripts/daywon');
