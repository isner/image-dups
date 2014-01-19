
exports.route = route;

function route(handles, pathname, request, response) {
  if (typeof handles[pathname] === 'function') {
    handles[pathname](request, response);

  } else {
    console.log('no request handler found for ' + pathname);
    response.writeHead(404);
    response.end();
  }
}