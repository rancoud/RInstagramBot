var client = getInstagramApp();
client.tag_search(options[0], function(err, result, remaining, limit) {
  console.log(err);
  console.log(result);
  console.log(remaining);
  console.log(limit);
});
