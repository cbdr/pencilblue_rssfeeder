module.exports = function RSSFeederServiceModule(pb) {
  var request = require('request'),
    parseString = require('xml2js').parseString,
    util = pb.util;
  function RSSFeederService(){}

  RSSFeederService.init = function(cb){
    pb.log.debug("RSSFeederService: Initialized");
    cb(null, true);
  };

  RSSFeederService.getName = function(){
    return "rssFeederService";
  };

  RSSFeederService.prototype.getFeed = function(cb){
    getSettings(function(err, settings) {
      if(err) {
        cb(new Error('RSS Feeder Plugin Error', 'rssfeederPluginError'), null);
      }
      else {
        getRSSFeed(settings.feed_url, cb);
      }
    });
  };
  
  function getRSSFeed(url, cb) {
    getRawFeed(url, function(rawFeed) {
      if(rawFeed == null) {
        cb(new Error('RSS Feeder Plugin Error', 'rssfeederPluginError'), null);
      }
      else {
        parseRSSFeed(rawFeed, cb);
      }
    });
  }
  
  function parseRSSFeed(rawFeed, cb) {
    parseString(rawFeed, function (err, parsedFeed) {
      if(err) {
        cb(new Error('RSS Feeder Plugin Error', 'rssfeederPluginError'), null);
      }
      else {
        cb(parsedFeed);
      }
    });
  }
  
  function getRawFeed(url, cb) {
    request.get(url, function (err, response, body) {
      if(err || response.statusCode != 200) {
        cb(new Error('RSS Feeder Plugin Status Code: ' + response.statusCode, 'rssfeederPluginError'), null);
      }
      else {
        cb(body);
      }
    });
  }
  
  function getSettings(cb) {
    var pluginService = new pb.PluginService();
    pluginService.getSettingsKV('rssfeeder', function(err, rssFeederSettings) {
      if (util.isError(err)) {
        cb(err, null);
      }
      cb(null, rssFeederSettings);
    });
  }

  return RSSFeederService;
};
