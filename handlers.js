
var logRequest = require('./lib/utils').logRequest;
var scanScript = require('./lib/scan');
var jade = require('jade');
var qs = require('querystring');
var fs = require('fs');

exports.scan = scan;
exports.results = results;
exports.favicon = favicon;

var locals = {};

var jadePaths = {
  scan: './views/scan.jade',
  results: './views/results.jade'
};

function makeRenderFun(filepath) {
  var render = jade.compile(fs.readFileSync(filepath), {
    'filename': filepath,
    'pretty': true
  });
  return render;
}

function scan(request, response) {
  locals.title = 'Start Scan - Image dups';

  response.end(makeRenderFun(jadePaths.scan)(locals));
  logRequest(request.method, request.url);
}

function results(request, response) {
  locals.title = 'Scan Results - Image dups';

  if (request.method == 'POST') {
    var body = '';
    request.on('data', function (data) {
      body += data;
      if (body.length > 1e6) {
          // FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST
        request.connection.destroy();
      }
    });
    request.on('end', function () {
      var POST = qs.parse(body);

      scanScript(POST.targetDir, function () {
        locals.results = fs.readFileSync('./results.txt', 'utf8');
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
