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



global.RInstagram = RInstagram;
