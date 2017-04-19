/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
var url = require('url');

var objectIdCounter = 1;

var output = { results : [] };

var requestHandler = function(request, response) {

  console.log('Serving request type ' + request.method + ' for url ' + request.url);

  // The outgoing status.
  var statusCode = null;

  var headers = {
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'access-control-allow-headers': 'content-type, accept',
    'access-control-max-age': 10 ,// Seconds.
    'Content-Type': 'application/json'
  };

  incomingUrl = url.parse(request.url).pathname;
  console.log("incomingUrl: ", incomingUrl);
  console.log("incomingUrl: ", url.parse(request.url).search);

  if (request.method === "GET") {
    if (incomingUrl === "/classes/messages") {
      statusCode = 200;
      response.writeHead( statusCode, headers );
      console.log("GET response, output object = ", output);
      console.log("Status Code = ", statusCode);
      response.end(JSON.stringify(output));
    } else {
      statusCode = 404;
      response.writeHead( statusCode, headers );
      response.end('Not a valid URL');
    }
  }

  if (request.method === 'POST') {
    var data = '';

    if (incomingUrl === "/classes/messages") {
      statusCode = 201;
      objectIdCounter++;

      request.on('data', function (chunk) {
        data += chunk;
      });
      request.on('end', function () {
        output.results.push(JSON.parse(data));
        console.log("POST data just pushed to output array: ", data);
        console.log("Status Code = ", statusCode);
        response.writeHead( statusCode, headers );
        response.end(JSON.stringify({objectId: objectIdCounter}));
      });
    } else if (incomingUrl === "/classes/room") {
      statusCode = 201;
      objectIdCounter++;

      request.on('data', function (chunk) {
        data += chunk;
      });

      request.on('end', function () {
        output.results.push(JSON.parse(data));
        console.log("Status Code = ", statusCode);
        response.writeHead( statusCode, headers );
        response.end(JSON.stringify({objectId: objectIdCounter}));
      });
    } else {
      statusCode = 404;
      response.writeHead( statusCode, headers );
      response.end('Not a valid URL');
    }
  }
  
  if (request.method === 'OPTIONS') {
    if ((incomingUrl === "/classes/messages") || (incomingUrl === "/classes/room")) {
      statusCode = 200;
      response.writeHead( statusCode, headers );
      response.end(null);
    } else {
      statusCode = 404;
      response.writeHead( statusCode, headers );
      response.end('Not a valid URL');
    }
  }
};

module.exports = {
  requestHandler : requestHandler
};





