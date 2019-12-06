var connection = require('./db.js');

connection.query('SELECT COUNT(*) FROM PF_BOARD', function (error, results, fields) {
    if (error) {
        console.log(error);
    }
    console.log(results);
});

connection.end();
