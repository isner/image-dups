
var logRequest = require('./lib/utils').logRequest;
var scanScript = require('./lib/scan');
var jade = require('jade');
var qs = require('querystring');
var fs = require('fs');

exports.home = homeView;
exports.results = resultsView;
exports.favicon = favicon;

var jadePaths = {
  scan: './views/home/body.jade',
  results: './views/results/body.jade'
};


function homeView(request, response) {
  var locals = {};
  locals.title = 'Start Scan - Image dups';
  response.end(makeRenderFun(jadePaths.scan)(locals));
  logRequest(request.method, request.url);
}

function resultsView(request, response) {
  var locals = {};
  locals.title = 'Scan Results - Image dups';

  if (request.method == 'POST') {

    collectPost(request, function (POST) {
      scanScript(POST.targetDir, function (progress) {
        console.log('progress: ', progress);

      }, function () {
        locals.results = fs.readFileSync('./results.txt');
        response.end(makeRenderFun(jadePaths.results)(locals));
      });
    });
    
  }
  
  logRequest(request.method, request.url);
}

function favicon(request, response) {
  response.end(fs.readFileSync('./assets/images/favicon.ico'));
  logRequest(request.method, request.url);
}

/**
 * Creates a jade-rendering function that accepts locals
 * @param  {String} filepath - path of the jade to be compiled
 * @return {Function}        - call it to render markup with locals as a single parameter
 * @api private
 */
function makeRenderFun(filepath) {
  var render = jade.compile(fs.readFileSync(filepath), {
    'filename': filepath,
    'pretty': true
  });
  return render;
}

/**
 * Collects the data from a POST request
 * @param  {Object}   request - the http request object
 * @param  {Function} next    - the callback function
 * @return {Function}         - callback with POST data as a single param
 * @api private
 */
function collectPost(request, next) {
  var body = '';

  request.on('data', function (data) {
    body += data;
    if (body.length > 1e6) {
      request.connection.destroy(); // FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST
      return;
    }

  }).on('end', function () {
    var POST = qs.parse(body);
    return next(POST);

  }).on('error', function (error) {
    console.log(error.message);
  });
}