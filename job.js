// require all files in utils folder
colors = require('colors');
util = require('util');
fs = require('fs');
fs.readdirSync(__dirname + '/utils/').forEach(function(file) {
  if (file.match(/\.js$/) !== null && file !== 'index.js') {
    var name = file.replace('.js', '');
    require('./utils/' + file);
  }
});

// init variables
globalUser = globalApp = globalFile = null;
job = '';
options = [];

// init logger
log = require('npmlog');
log.info('RInstagramBot', 'Init');
process.on('exit', function() {
  log.info('RInstagramBot', 'End');
  // remove process pid
  try {
    fs.unlinkSync('./pids/' + process.pid + '.pid');
  } catch (e) {
    //
  }
});

// get job + options
process.argv.forEach(function (val, index, array) {
  if(index == 2) {
    job = val;
  }

  if(index > 2) {
    options.push(val);
  }
});

// get general options
var _tmpOptions = [];
for (var i = 0, max = options.length; i < max; i++) {
  if(options[i] === '-u' || options[i] === '--user') {
    i++;
    if(i < max) {
      globalUser = options[i].toLowerCase();
    }
    else {
      log.error('RInstagramBot', 'user argument missing!');
      return;
    }
  }
  else if(options[i] === '-a' || options[i] === '--app') {
    i++;
    if(i < max) {
      globalApp = options[i];
    }
    else {
      log.error('RInstagramBot', 'app argument missing!');
      return;
    }
  }
  else if(options[i] === '-f' || options[i] === '--file') {
    i++;
    if(i < max) {
      globalFile = options[i];
    }
    else {
      log.error('RInstagramBot', 'file argument missing!');
      return;
    }
  }
  else {
    _tmpOptions.push(options[i]);
  }
}
options = _tmpOptions;

// if no job kill process
if(job.length < 1) {
  log.error('RInstagramBot', 'No job found');
  process.exit(9);
}

// get twitter app configurations and Twitter module
confInstagramApp = require('./conf.twitter.app.js');

// check confInstagramApp > not empty AND no duplicate name
if(confInstagramApp.length === 0) {
  log.error('RInstagramBot', 'File conf.twitter.app.js is empty');
  process.exit(1);
}
var _names = [];
var ready = confInstagramApp.length;
for (var i = 0; i < confInstagramApp.length; i++) {
  if(_names.indexOf(confInstagramApp[i].name) !== -1) {
    log.error('RInstagramBot', 'Duplicate names in file conf.twitter.app.js');
    process.exit(1);
  }
  _names.push(confInstagramApp[i].name);

  // populate rate_limit_cache folder if empty
  var _json = getRateLimitByName(confInstagramApp[i].name);
  if(_json === null) {
    log.info('RInstagramBot', 'Update rate_limit_cache json for %s', confInstagramApp[i].name);
    getClientRateLimit(new RTwitter(confInstagramApp[i]), function(name) {
      return function(json) {
        saveRateLimitByName(name, JSON.stringify(json));

        ready--;
        if(ready === 0) {
          doJob();
        }
      };
    } (confInstagramApp[i].name));
  }
  else {
    ready--;
    if(ready === 0) {
      doJob();
    }
  }
}

function doJob() {
  log.info('RInstagramBot', 'Search Job: %s', job);
  // search job in private folder jobs
  fs.readdir('./private_jobs', function(err, files) {
    var f, l = files.length, found = false;
    for (var i = 0; i < l; i++) {
      if (files[i] === job + '.js') {
        // save pid
        fs.writeFileSync('./pids/' + process.pid + '.pid', job + ' ' + options.join(' '), 'utf-8');
        log.info('RInstagramBot', 'Load job file: %s', files[i]);
        found = true;
        require('./private_jobs/' + files[i]);
        break;
      }
    }

    if(found === true) {
      return;
    }

    // search job in folder jobs
    fs.readdir('./jobs', function(err, files) {
      var f, l = files.length, found = false;
      for (var i = 0; i < l; i++) {
        if (files[i] === job + '.js') {
          // save pid
          fs.writeFileSync('./pids/' + process.pid + '.pid', job + ' ' + options.join(' '), 'utf-8');
          log.info('RInstagramBot', 'Load job file: %s', files[i]);
          found = true;
          require('./jobs/' + files[i]);
          break;
        }
      }

      if(found === false) {
        log.error('RInstagramBot', 'Job %s not found', job);
      }
    });

  });
};
