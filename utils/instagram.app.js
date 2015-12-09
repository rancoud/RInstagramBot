global.getInstagramApp = function getInstagramApp(name, arrayEndpoints) {
  if(globalApp !== null) {
    name = globalApp;
  }

  if(name !== undefined) {
    for (var i = 0; i < confInstagramApp.length; i++) {
      if(confInstagramApp[i].name === name) {
        log.info('RInstagramBot', 'Use Instagram app %s', name);
        client = new RInstagram(confInstagramApp[i]);
        if(globalUser !== null) {
          client.setAccessTokenByUser(globalUser);
        }
        return client;
      }
    }
    log.error('RInstagramBot', 'Instagram app %s not found', name);
    throw "no app";
  }
  else {
    // no arguments? just give the first Instagram app
    if(arrayEndpoints === undefined || !Array.isArray(arrayEndpoints) || arrayEndpoints.length < 1) {
      log.info('RInstagramBot', 'Use Instagram app %s', confInstagramApp[0].name);
      client = new RInstagram(confInstagramApp[0]);
      if(globalUser !== null) {
        client.setAccessTokenByUser(globalUser);
      }
      return client;
    }

    // for each Instagram app we read rate limits using endpoints
    var matches = [];
    for (var i = 0; i < confInstagramApp.length; i++) {
      matches.push(0);
      var _rateLimit = getRateLimitByName(confInstagramApp[i].name, false);
      for (var j = 0; j < arrayEndpoints.length; j++) {
        var _parts = arrayEndpoints[j].split('/');
        var _endpoint = _rateLimit.resources[_parts[0]]['/'+arrayEndpoints[j]];
        if(_endpoint === undefined || _endpoint.remaining > 0) {
          matches[i]++;
        }
      }

      // if we have a full matches we can use this Instagram app
      if(matches[i] === arrayEndpoints.length) {
        client = new RInstagram(confInstagramApp[i]);
        if(globalUser !== null) {
          client.setAccessTokenByUser(globalUser);
        }
        return client;
      }
    }

    log.error('RInstagramBot', 'No Instagram app available');
    throw "no app";
  }
};
