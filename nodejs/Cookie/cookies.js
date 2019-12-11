var http = require('http');
var cookie = require('cookie');

http.createServer(function(req, res){

    console.log(req.headers.cookie);

    res.writeHead(200, {
        "Set-Cookie" : ["test1=val1","test2=val2"]
    });
  
    res.end("asd l;'");
}).listen(3000);