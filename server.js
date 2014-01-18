
var url = require('url');
var http = require('http');
var port = require('./config.json').server.port;


exports.start = start;

function start(route, handles) {

  function onRequest(request, response) {
    var pathname = url.parse(request.url).pathname;

    route(handles, pathname, request, response);
  }

  http.createServer(onRequest).listen(port);
  console.log('Image-dups running at http://127.0.0.1:' + port);
}
