var client = getInstagramApp();
client.tag_media_recent(options[0], {}, function(err, medias, pagination, remaining, limit) {
  console.log(err);
  console.log(medias);
  console.log(pagination);
  console.log(remaining);
  console.log(limit);
});
