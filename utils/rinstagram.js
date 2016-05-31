function RInstagram(confInstagramApp) {
  this.client = require('instagram-node').instagram();
  this.client.use({
    client_id: confInstagramApp.client_id,
    client_secret: confInstagramApp.client_secret
  });
}

RInstagram.prototype.tag_media_recent = function (tag, callback) {
  this.client.tag_media_recent(tag, callback);
};

RInstagram.prototype.get_authorization_url = function (a, b) {
  return this.client.get_authorization_url(a, b);
};

RInstagram.prototype.authorize_user = function (code, redirect_uri, callback) {
  this.client.authorize_user(code, redirect_uri, callback);
};

RInstagram.prototype.user = function (user_id, callback) {
  this.client.user(user_id, callback);
};

RInstagram.prototype.tag = function (tag, callback) {
  this.client.tag(tag, callback);
};

RInstagram.prototype.tag_media_recent = function (tag, options, callback) {
  this.client.tag_media_recent(tag, options, callback);
};

RInstagram.prototype.user_media_recent = function (user, options, callback) {
  this.client.user_media_recent(user, options, callback);
};

RInstagram.prototype.user_details = function (callback) {
  var that = this;

  var retry = function() {
    that.user_details(callback);
  };
  console.log(require('util').inspect(that, { depth: null }));
/*
    private method not good
  call('GET', '/users/self', {}, function(err, result, remaining, limit) {
    if(err) {
      return handle_error(err, callback, retry);
    } else if(result && result.meta && result.meta.code === 200) {
      return callback(null, result.data, remaining, limit);
    } else {
      return handle_error(result, callback, retry);
    }
  }, retry);
*/
};

RInstagram.prototype.tag_search = function (tag, callback) {
  this.client.tag_search(tag, callback);
};

global.RInstagram = RInstagram;
