// Description:
//   A way to interact with the Google Images API.
//
// Configuration:
//   BROBBOT_GOOGLE_IMAGE_REFERER - the referer URL to pass to the Google API

var REFERER = process.env.BROBBOT_GOOGLE_IMAGE_REFERER || 'https://npmjs.org/package/brobbot-google-image';

module.exports = function(robot) {
  robot.helpCommand("brobbot image [me] `query`", "Googles `query` and returns 1st result's URL.");
  robot.helpCommand("brobbot animate [me] `query`", "Googles `query` and tries to return the first animated GIF result.");
  robot.helpCommand("brobbot mustache [me] `url`", "Adds a mustache to the image at the specified url.");
  robot.helpCommand("brobbot mustache [me] `query`", "Does an image search for `query`, then adds a mustache to the result.");

  robot.respond(/^(image|img)( me)? (.*)/i, function(msg) {
    imageMe(msg, msg.match[3], function(url) {
      msg.send(url);
    });
  });

  robot.respond(/^animate( me)? (.*)/i, function(msg) {
    imageMe(msg, msg.match[2], true, function(url) {
      msg.send(url);
    });
  });

  robot.respond(/^(?:mo?u)?sta(?:s|c)h(?:e|ify)?(?: me)? (.*)/i, function(msg) {
    var type = Math.floor(Math.random() * 6);
    var mustachify = "http://mustachify.me/" + type + "?src=";
    var imagery = msg.match[1];

    if (imagery.match(/^https?:\/\//i)) {
      encodedUrl = encodeURIComponent(imagery);
      msg.send(mustachify + encodedUrl);
    }
    else {
      imageMe(msg, imagery, false, true, function(url) {
        encodedUrl = encodeURIComponent(url);
        msg.send(mustachify + encodedUrl);
      });
    }
  });
};

function imageMe(msg, query, animated, faces, cb) {
  var q = {
    v: '1.0',
    rsz: '8',
    q: query,
    safe: 'active'
  };

  q.imgtype = typeof animated === 'boolean' && animated === true ? 'animated' : q.imgtype;
  q.imgtype = typeof faces === 'boolean' && faces === true ? 'face' : q.imgtype;

  cb = typeof animated == 'function' ? animated : cb;
  cb = typeof faces == 'function' ? faces : cb;

  msg.http('http://ajax.googleapis.com/ajax/services/search/images')
    .query(q)
    .header('Referer', REFERER)
    .get()(function(err, res, body) {
      var images = JSON.parse(body);
      images = images.responseData ? images.responseData.results : null;

      if (images && images.length > 0) {
        image = msg.random(images);
        cb(ensureImageExtension(image.unescapedUrl));
      }
    });
}

function ensureImageExtension(url) {
  var ext = url.split('.').pop();
  if (/(png|jpe?g|gif)/i.test(ext)) {
    return url;
  }
  else {
    return url + "#.png";
  }
}
