var mysql      = require('mysql');
// 비밀번호는 별도의 파일로 분리해서 버전관리에 포함시키지 않아야 합니다.
var connection = mysql.createConnection({
  host     : 'sunnyside.cgwvs8hxdkc3.ap-northeast-2.rds.amazonaws.com',
  user     : 'SUNNYSIDE',
  password : 'SUNNYSIDE1029',
  database : 'SUNNYSQL'
});

connection.connect();

connection.query('SELECT COUNT(*) FROM PF_BOARD', function (error, results, fields) {
    if (error) {
        console.log(error);
    }
    console.log(results);
});

connection.end();
