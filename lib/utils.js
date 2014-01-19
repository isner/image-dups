
var fs = require('fs');
var path = require('path');
var walk = require('fs-walk');
var crypto = require('crypto');

var dupMods = {};
var imageExtname = /jpg|gif|png|tif$/i;
var logFile = __dirname + './../results.txt';
var records = {};
var dupCount = 0;

module.exports = dupMods;

dupMods.prepare = function (fn) {
  console.log('');
  records = {}; // Clear the cached records from previous scans
  dupCount = 0; // Reset the dup count from previous scans
  var now = new Date().toString();
  fs.writeFile(logFile, 'Scan complete: ' + now + '\r\n\r\n', function (err) {
    if (err) {
      return fn(err);
    }
    fn(null);
  });
};

dupMods.getImages = function (dir, fn) {
  var files = [];
  console.log('fetching images from all directories in ' + dir);
  walk.walkSync(dir, function (basedir, filename) {
    files.push(path.join(basedir, filename));
  });
  fn(null, files.filter(dupMods.isImage));
};


/**
 * Checks whether a filename ends in an image extension
 * 
 * @param  {String}  file - The filepath to check
 * @return {Boolean}      - Answers: "Is the filepath to an image?"
 */
dupMods.isImage = function (file) {
  return imageExtname.test(path.extname(file));
};


dupMods.makeHash = function (buffer) {
  var hash = crypto.createHash('sha1');
  hash.update(buffer.toString('base64'));
  return hash.digest('hex');
};

dupMods.dupCheck = function (file, fn) {
  fs.readFile(file, function (err, buffer) {
    if (err) {
      return fn(err);
    }

    var checksum = dupMods.makeHash(buffer);

    if (records[checksum]) {
      dupCount++;
      dupMods.writeLog(dupCount, file, records[checksum]);
      return fn(null, true);
    }

    records[checksum] = file;
    fn(null, false);
  });
};

/**
 * Writes the results of the image-dup scan to log.txt
 * 
 * @param  {String} filename1 [description]
 * @param  {String} filename2 [description]
 * @return {Function}       callback with error
 */
dupMods.writeLog = function (dupNo, filename1, filename2) {
  var string1 = dupNo + 'a) ' + filename1 + '\r\n';
  var string2 = dupNo + 'b) ' + filename2 + '\r\n';
  var string = string1 + string2 + '\r\n';

  fs.appendFile(logFile, string, function (err) {
    if (err) throw err;
  });
};

dupMods.done = function (msg) {
  console.log(msg);
};

/**
 * Logs a legibly-spaced console message for http requests
 * 
 * @param  {String} requestMethod - eg, "GET", "POST", etc.
 * @param  {String} pathname      - eg. "/home"
 */
dupMods.logRequest = function (requestMethod, pathname) {
  var i;

  var message = requestMethod;
  for (i = requestMethod.length; i < 4; i++)
    message += ' ';

  message += ' ' + pathname;
  for (i = pathname.length; i < 15; i++)
    message += ' ';

  var date = '' + new Date();
  date = date.substr(0, date.indexOf('('));
  message += ' ' + date;

  console.log(message);
};