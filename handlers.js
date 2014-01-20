
var logRequest = require('./lib/utils').logRequest;
var scanScript = require('./lib/scan');
var PORT = require('./config.json').server.port;
var http = require('http');
var jade = require('jade');
var qs = require('querystring');
var fs = require('fs');

exports.home = homeView;
exports.results = resultsView;
exports.favicon = favicon;

var jadePaths = {
  home: './views/home/body.jade',
  results: './views/results/body.jade'
};


function homeView(request, response) {
  logRequest(request.method, request.url);
  var locals = {};

  if (request.method === 'GET') {
    locals.title = 'Begin - Image dups';
    response.end(makeRenderFun(jadePaths.home)(locals));

  } else if (request.method === 'POST') {
    collectPost(request, function (POST) {
      scanScript(POST.targetDir, function (progress) {
        // scan progressed
        locals.title = 'Scanning... - Image dups';
        response.end(makeRenderFun(jadePaths.home)(locals));

      }, function () {
        // scan complete
        http.get('http://localhost:1923/results', function (response) {

        });
      });
    });

  }
}

function resultsView(request, response) {
  logRequest(request.method, request.url);
  var locals = {};
  locals.title = 'Results - Image dups';
  locals.results = fs.readFileSync('./results.txt', 'utf8');
  console.log('locals.results: ', locals.results);
  response.end(makeRenderFun(jadePaths.results)(locals));

  // if (request.method === 'POST') {
    // collectPost(request, function (POST) {
    //   scanScript(POST.targetDir, function (progress) {
    //     // scan progressed

    //   }, function () {
    //     // scan complete
    //     http.request({host:'127.0.0.1',port:1923,path:'/results',method:'GET'}, function (response) {
    //       locals.title = 'Results - Image dups';
    //       locals.results = fs.readFileSync('./results.txt');
    //       response.end(makeRenderFun(jadePaths.results)(locals));
    //     });
    //   });
    // });
  // }
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