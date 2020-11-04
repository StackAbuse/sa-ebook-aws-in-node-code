const mysql = require('mysql');

const con = mysql.createConnection({
    host: 'database-1-instance-1.cpelewyxe5ot.us-east-1.rds.amazonaws.com',
	port: 3306,
    user: 'admin',
    password: ''
});

con.connect(err => {
    if (err) throw err;

    con.query('CREATE DATABASE IF NOT EXISTS main;');
    con.query('USE main;');
    con.query('CREATE TABLE IF NOT EXISTS users(id int NOT NULL AUTO_INCREMENT, username varchar(30), email varchar(255), age int, PRIMARY KEY(id));', (error, result, fields) => {
        console.log(result);
    });
    con.end();
});
