const chokidar = require('chokidar');
const imdb = require('imdb-api');
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


let file_ext = ['mkv','mp4','flv','wmv','mov'];
chokidar.watch('.', {ignored: /[\/\\]\./}).on('all', (event, path) => {
	let full_path = path;
	//for add event
	if(event == 'addDir' || event == 'add'){
		let separated_path = full_path.split('/');
		let last_item = separated_path[separated_path.length - 1];
		let ext = last_item.split('.');
		let check = false;
		file_ext.map(function(element){
			if(element === ext[ext.length - 1]){
				check = true;
			}
		});	
		//get data from imdb api
		if(check){
			let name = separated_path[separated_path.length - 2];
			let type = separated_path[separated_path.length - 3];
			let imdb_data;
			let title = name;
			let released = '';
			let runtime = '';
			let genres = '';
			let director = '';
			let writer = '';
			let actors = '';
			let plot = '';
			let languages = '';
			let country = '';
			let awards = '';
			let poster = '';
			let rating = '';
			let votes = '';
			let imdburl = '';

			//check if data already exists in DB
			connection.query('SELECT title FROM `all_videos` WHERE `title` = ?', [title] , function(error, results, fields){
				if(results.length <= 0){
					imdb.getReq({ name: name })
					.then(function(res){
						imdb_data = res;
						title = name;
						released = imdb_data['released'];
						runtime = imdb_data['runtime'];
						genres = imdb_data['genres'];
						director = imdb_data['director'];
						writer = imdb_data['writer'];
						actors = imdb_data['actors'];
						plot = imdb_data['plot'];
						languages = imdb_data['languages'];
						country = imdb_data['country'];
						awards = imdb_data['awards'];
						poster = imdb_data['poster'];
						rating = imdb_data['rating'];
						votes = imdb_data['votes'];
						type = imdb_data['type'];
						imdburl = imdb_data['imdburl'];	
						//insert data into DB
						let data = { title:title, type:type, languages:languages, genres:genres, video_path:full_path };
						let query = connection.query('INSERT INTO all_videos SET ? ', data, function (error, results, fields) {
							if (error) throw error;
						});
						console.log(query.sql);

					},function(err){
						//insert data into DB
						let data = { title:title, type:type, languages:languages, genres:genres, video_path:full_path };
						let query = connection.query('INSERT INTO all_videos SET ? ', data, function (error, results, fields) {
							if (error) throw error;
						});
						console.log(query.sql);
					});
				}
			});
		}
	}
	//for delete event
	if(event == 'unlink' || event == 'unlinkDir'){

	}
});