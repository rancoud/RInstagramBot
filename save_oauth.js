// require all files in utils folder
colors = require('colors');
util = require('util');
fs = require('fs');
fs.readdirSync(__dirname + '/utils/').forEach(function(file) {
  if (file.match(/\.js$/) !== null && file !== 'index.js') {
    var name = file.replace('.js', '');
    require(__dirname + '/utils/' + file);
  }
});

// init variables
globalUser = globalApp = null;
options = [];
authData = {};

// init logger
log = require('npmlog');
log.info('RInstagramBot SaveOauth', 'Init');

// get options
process.argv.forEach(function (val, index, array) {
  if(index > 1) {
    options.push(val);
  }
});

// get general options
var _tmpOptions = [];
for (var i = 0, max = options.length; i < max; i++) {
  if(options[i] === '-a' || options[i] === '--app') {
    i++;
    if(i < max) {
      globalApp = options[i];
    }
    else {
      log.error('RInstagramBot', 'app argument missing!');
      return;
    }
  }
  else {
    _tmpOptions.push(options[i]);
  }
}
options = _tmpOptions;

// get instagram app configurations
confInstagramApp = require(__dirname + '/conf.instagram.app.js');

// check confInstagramApp > not empty AND no duplicate name
if(confInstagramApp.length === 0) {
  log.error('RInstagramBot', 'File conf.instagram.app.js is empty');
  process.exit(1);
}
var _names = [];
var ready = confInstagramApp.length;
for (var i = 0; i < confInstagramApp.length; i++) {
  if(_names.indexOf(confInstagramApp[i].name) !== -1) {
    log.error('RInstagramBot', 'Duplicate names in file conf.instagram.app.js');
    process.exit(1);
  }
  _names.push(confInstagramApp[i].name);
}

if(options[0] !== undefined) {
  client = getInstagramApp(options[0]);
}
else {
  client = getInstagramApp();
}

// setup server
http = require('http');
server = http.createServer(function (req, res) {
  if(req.url === '/') {
    var url = client.get_authorization_url('http://127.0.0.1:3000/', { scope: ['public_content'] });
    log.info('RInstagramBot SaveOauth', 'Generate authentification url %s', url);
    res.writeHead(302, {'Location': url} );
    res.end();
  }
  else {
    var query = require('url').parse(req.url, true).query;
    if(query.code === undefined) {
      return;
    }

    client.authorize_user(query.code, 'http://127.0.0.1:3000/', function(err, result) {
      if (err) {
        console.log(err.body);
        //res.send("Didn't work");
        res.end();
      } else {
        console.log('Yay! Access token is ' + result.access_token);

        //client.get

        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end("Access Token saved");
      }
    });
    return;
    
    client.resetAccessToken();

    client.authenticate(query.oauth_token, authData.oauth_token_secret, query.oauth_verifier, function(accessToken) {
      if(accessToken !== false) {
        accessToken.app_name = client.getAppName();
        client.setAccessToken(accessToken.access_token_key, accessToken.access_token_secret);
        client.get('account/settings',  function(error, tweet, response) {
          if(error) {
            logInstagramError(error);
            throw error;
          }

          // write file in oauth_access_cache
          var fileToken = __dirname + '/oauth_access_cache/' + tweet.screen_name.toLowerCase() + '.tok';
          var accessTokenFileStats = null;
          var accessTokenJson = [];
          var found = false;

          try {
            accessTokenFileStats = fs.statSync(fileToken);
          } catch (e) {
            //
          }

          if(accessTokenFileStats !== null) {
            accessTokenFileJson = fs.readFileSync(fileToken, 'utf8');
            accessTokenJson = JSON.parse(accessTokenFileJson);
            for (var i = 0; i < accessTokenJson.length; i++) {
              if(accessTokenJson[i].app_name === accessToken.app_name) {
                found = true;
                log.info('RInstagramBot SaveOauth', 'Update access token for user %s for app %s', tweet.screen_name.toLowerCase(), accessToken.app_name);
                accessTokenJson[i] = accessToken;
                break;
              }
            }
          }

          if(accessTokenFileStats === null || !found) {
            log.info('RInstagramBot SaveOauth', 'Add access token user %s for app %s', tweet.screen_name.toLowerCase(), accessToken.app_name);
            accessTokenJson.push(accessToken);
          }

          fs.writeFileSync(fileToken, JSON.stringify(accessTokenJson));
        });

        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end("Access Token saved");

        return;
      }
      else {
        log.error('RInstagramBot SaveOauth', 'Error in callback authenticate');

        res.writeHead(500, {'Content-Type': 'text/plain'});
        res.end("Error when callback authenticate");

        return;
      }
    });
  }
});

// now that server is running
server.listen(3000, '127.0.0.1', function(){
  log.info('RInstagramBot SaveOauth', 'Server listening');
});
