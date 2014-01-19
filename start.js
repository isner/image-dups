
var server = require('./server');
var router = require('./router');
var handlers = require('./handlers');


var handles = {};
handles['/'] = handlers.home;
handles['/home'] = handlers.home;
handles['/results'] = handlers.results;
handles['/favicon.ico'] = handlers.favicon;

server.start(router.route, handles);
