var http = require('http');
var fs = require('fs');
var url = require('url'); //url과 관련된 함수데이터 패키지

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var title = queryData.id;

    var pathname = url.parse(_url, true);
    var pathnamea = url.parse(_url, false);
    //_url을 json형태로 변형시킨다.
    //console.log("----------------------------");
    //console.log(pathname);
    //console.log(pathnamea);
    //console.log("----------------------------");

    //pathname -> naver.com/패스네임?id=asd
    if(pathname.pathname == '/'){//패스네임이 없고 쿼리만 있을때 -> ~.com/?id=~
      fs.readFile(`${queryData.id}`, 'utf8', function(err, data){
        var description = data;
        if(queryData.id == undefined){
          title = 'welcome';
          var description = '디스크립션';
        }
        var template = `
          <!doctype html>
          <html>
          <head>
            <title>WEB1 - ${title}</title>
            <meta charset="utf-8">
          </head>
          <body>
            <h1><a href="/">WEB</a></h1>
            <ul>
              <li><a href="/?id=HTML">HTML</a></li>
              <li><a href="/?id=CSS">CSS</a></li>
              <li><a href="/?id=JavaScript">JavaScript</a></li>
              <li><a href="/asdasd?id=JavaScript">패스네임 오류</a></li>
            </ul>
            <h2>${title}</h2>
            <p>${description}</p>
          </body>
          </html>
        `;

        response.writeHead(200);
        response.end(template);
      });
    }else{
      response.writeHead(404);
      response.end('___error___');
    }

});
app.listen(3000);
