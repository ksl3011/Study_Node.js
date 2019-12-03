//https://nodejs.org/dist/latest-v12.x/docs/api/
var fs = require('fs');
fs.readFile('sample.txt', 'utf8',function(err, data){
  console.log(err);
  console.log(data);

});
