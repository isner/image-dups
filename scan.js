
var utils = require('./utils');

var done = utils.done;
var prepare = utils.prepare;
var dupCheck = utils.dupCheck;
var getImages = utils.getImages;

var imgCount = 0;
var verboseOn = false;
var dir = process.argv[2];

if (!dir) {
  console.log('please supply a directory argument');
  console.log('>>  node scan <pathtodir>');
  process.exit();
}

prepare(function (err) {
  if (err) throw err;

  getImages(dir, function (err, images) {
    if (err) throw err;

    if (!images.length) {
      done('directory contains no images, or does not exist');
    }

    imgCount = images.length;

    console.log(imgCount + ' images found');
    console.log('scanning images');

    nextImage(0);

    function nextImage(index) {
      var image = images[index];

      if (!image) {
        done('done scanning ' + imgCount + ' images');
      }

      dupCheck(image, function (err, isDup) {
        if (err) throw err;

        var current = index + 1;
        if (current % 50 === 0) {
          console.log('scanning image ' + current + ' of ' + imgCount);
        }

        if (verboseOn) {
          var result = isDup ? 'DUP>>> ' : 'unique ';
          console.log(result + image);
        }

        index++;
        nextImage(index);
      });
    }

  });

});