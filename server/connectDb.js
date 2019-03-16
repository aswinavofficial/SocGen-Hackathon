var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "sghack",
    password: "sghack123",
    database: "swift"
});

con.connect(function(err) {
	if (err){
		console.log("\nDatabase Connection Error");
		throw err;
	}
	else
		console.log("\nDatabase Connected!.....");
});

module.exports = con;
