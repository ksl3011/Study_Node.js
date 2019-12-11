var http = require('http');
var cookie = require('cookie');

http.createServer(function(req, res){
    //사이트에 있는 쿠키확인
    console.log(req.headers.cookie);

    var cookies = {};

    if(req.headers.cookie != undefined){
        cookies = cookie.parse(req.headers.cookie);
        console.log(cookies);
    }

    /*
        Max-Age
        HttpOnly : 자바스크립트로 접근불가
        Secure : https로 접근했을때만 사용가능
        Path : 특정 디렉토리에 접근했을때만 사용가능
        Domain : 서브도메인에서도 동작
    */
    res.writeHead(200,
        {
        "Set-Cookie" : [
                        "test1=val1",
                        "test2=val2",
                        `test3=val3; Max-Age=${60*60}`,
                        `test4=val4; HttpOnly`,
                        `test5=val5; Secure`,
                        `test6=val6; Path=/testPath`,
                        `test7=val7; Domain=.localhost`
                        ],
        'Content-Type':'text/html; charset=utf-8'
        }
    );
    
    res.end("쿠키테스트");
}).listen(3000);