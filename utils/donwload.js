global.download = function download(url, dest, callback, retry) {
  log.info('RInstagramBot', 'Download %s to %s', url, dest);
  var wrapper;
  retry = retry || 0;

  if(url.substr(0,5) === "https") {
    wrapper = require('https');
  }
  else if(url.substr(0,4) === "http") {
    wrapper = require('http');
  }
  else {
    log.error('RInstagramBot', 'Url not supported for donwload: %s', url);
    return;
  }
  var fs = require('fs');

  var file = fs.createWriteStream(dest);
  var request = wrapper.get(url, function(response) {
    if(response.statusCode === 404) {
      retry++;

      if(retry > 3) {
        log.error('RInstagramBot', 'Url not found for download: %s', url);
        return;
      }

      log.info('RInstagramBot', '%d retry to download: %s', retry, url);

      setTimeout(function(){
        download(url, dest, callback, retry);
      }, 1000);
      return;
    }
    response.pipe(file);
    file.on('finish', function() {
      file.close(callback);
    });
  }).on('error', function(err) {
    fs.unlink(dest);
    if (callback) {
      callback(err.message);
    }
  });
};
