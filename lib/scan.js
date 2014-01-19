
var utils = require('./utils');

var done = utils.done;
var prepare = utils.prepare;
var dupCheck = utils.dupCheck;
var getImages = utils.getImages;


module.exports = scanScript;

function scanScript(dir) {
  var imgCount = 0;
  var verboseOn = false;

  prepare(function (err) {
    if (err) {
      throw err;
    }

    getImages(dir, function (err, images) {
      if (err) {
        throw err;
      }

      if (!images.length) {
        return done('directory is empty or does not exist');
      }

      imgCount = images.length;

      console.log(imgCount + ' images found');
      console.log('scanning images');

      next(0);

      function next(index) {
        var image = images[index];
        if (!image) {
          return done('done scanning ' + imgCount + ' images');
        }

        dupCheck(image, function (err, isDup) {
          if (err) {
            throw err;
          }

          var current = index + 1;
          if (current % 50 === 0) {
            console.log('scanning image ' + current + ' of ' + imgCount);
          }

          if (verboseOn) {
            var result = isDup ? 'DUP>>> ' : 'unique ';
            console.log(result + image);
          }

          index++;
          next(index);
        });
      }

    });

  });

}
