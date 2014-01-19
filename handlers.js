
var logRequest = require('./lib/utils').logRequest;
var scanScript = require('./lib/scan');
var PORT = require('./config.json').server.port;
var jade = require('jade');
var qs = require('querystring');
var fs = require('fs');

exports.scan = scanView;
exports.results = resultsView;
exports.resultsAdd = resultsAdd;
exports.favicon = favicon;

var jadePaths = {
  scan: './views/home/body.jade',
  results: './views/results/body.jade'
};


function scanView(request, response) {
  var locals = {};
  locals.title = 'Start Scan - Image dups';

    // Render the /scan view
  response.end(makeRenderFun(jadePaths.scan)(locals));
  logRequest(request.method, request.url);
}

function resultsView(request, response) {
  var locals = {};
  locals.title = 'Scan Results - Image dups';
  locals.results = '';

  if (request.method == 'POST') {
    collectPost(request, function (POST) {
      scanScript(POST.targetDir);
      response.end(makeRenderFun(jadePaths.results)(locals));
    });
  }
  
  logRequest(request.method, request.url);
}

function resultsAdd(request, response) {
  response.writeHead(200, {'Access-Control-Allow-Origin': 'http://localhost:' + PORT});
  var results = fs.readFileSync('./results.txt', 'utf8');
  response.end(results);
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
        // FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST
      request.connection.destroy();
      return;
    }
  });

  request.on('end', function () {
    var POST = qs.parse(body);
    return next(POST);
  });
}