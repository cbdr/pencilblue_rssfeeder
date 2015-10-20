var util = require('util');
module.exports.getMockPB = function () {
  var templateService = require('./template_service_mock')(),
    pluginService = require('./plugin_service_mock')();

  var pb = {
    log: {
      info: function () {},
      error: function () {},
      debug: function() {},
      silly: function() {}
    },
    PluginService: pluginService,
    SiteService: {
      GLOBAL_SITE:'global'
    },
    TemplateService: templateService,
    util : util
  };
  return pb;
};
