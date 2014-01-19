
var server = require('./server');
var router = require('./router');
var handlers = require('./handlers');


var handles = {};
handles['/'] = handlers.scan;
handles['/scan'] = handlers.scan;
handles['/results'] = handlers.results;
handles['/results.txt'] = handlers.resultsAdd;
handles['/favicon.ico'] = handlers.favicon;

server.start(router.route, handles);
