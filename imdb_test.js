// const imdb = require('imdb-api');

// // Promises!

// imdb.getReq({ name: 'Game Of Thrones' }).then(function(res){
// 	console.log(res);
// });

const mysql = require('mysql');
//DB connecction
const connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : 'root',
	database : 'movieDB'
});
connection.connect(function(err) {
	if (err) {
		console.error('error connecting: ' + err.stack);
		return;
	}
	console.log('connected as id ' + connection.threadId);
});

let name = 'I Am Legend';
connection.query('SELECT * FROM `all_videos` WHERE `title` = ?', [name] , function (error, results, fields) {
  // error will be an Error if one occurred during the query
  // results will contain the results of the query
  // fields will contain information about the returned results fields (if any)

  console.log(results);

});
