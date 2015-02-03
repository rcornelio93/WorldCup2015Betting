var ejs= require('ejs');
var mysql = require('mysql');

function getConnection(){
	var connection = mysql.createConnection({
		host     : 'localhost',
		user     : 'root',
		password : 'MyNewPass',
		database : 'worldcup'
	});
	return connection;
}

function myCustomPool(num_conns)
{
    this.pool = [];
    for(var i=0; i < num_conns; ++i){
	this.pool.push(getConnection());
    }
    this.last = 0;
}

myCustomPool.prototype.get = function()
{
	var cli = this.pool[this.last];
	this.last++;
	if (this.last === this.pool.length) { // cyclic increment
	this.last = 0;
	console.log("20 connections reached. Now starting from the first");
	}
	return cli;
};

var p = new myCustomPool(20);

function myPool() {
	var conn = p.get();
	return conn;
}

var nodepool  = mysql.createPool({
	host     : 'localhost',
	user     : '',
	password : '',
	database : 'test',
	connectionLimit : '20'
	});

function fetchData(callback,sqlQuery){
	
	console.log("\nSQL Query::"+sqlQuery);
	
	var connection=getConnection();
	//var connection=myPool();
	//nodepool.query(sqlQuery, function(err, rows, fields) {
	
	connection.query(sqlQuery, function(err, rows, fields) {
		if(err){
			connection.end();
			console.log("ERROR: " + err.message);
		}
		else
		{	// return err or result
			connection.end();
			callback(err, rows);
		}
		//connection.end();	
		//nodepool.release();
	});
	console.log("\nConnection closed..");
	//connection.end();*/
	
	/*nodepool.getConnection(function(err, connection) {
		  // Use the connection
			connection.query(sqlQuery, function(err, rows, fields) {
				if(err){
					//connection.end();
					console.log("ERROR: " + err.message);
				}
				else
				{	// return err or result
					//connection.end();
					callback(err, rows);
				}
				//connection.end();	
				connection.release();
			});
		});*/

}

function writeData(callback,sqlQuery){
	
	console.log("Insert Query::"+sqlQuery);
	
	var connection=getConnection();
	
	connection.query(sqlQuery, function(err) {
		if(err){
			console.log("ERROR while inserting data " + err.message);
			callback(err);
		}
		else
		{	// return err or result
			callback(err);
		}
	});
	
	console.log("\nConnection closed..");
	connection.end();
}

exports.fetchData=fetchData;
exports.writeData=writeData;