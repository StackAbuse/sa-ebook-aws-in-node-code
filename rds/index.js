const express = require('express');
const mysql = require('mysql');

const app = express();
const port = 3001;

const con = mysql.createConnection({
    // NOTE: Be sure to change the host to the one for your RDS instance
    host: 'database-1-instance-1.cpelewyxe5ot.us-east-1.rds.amazonaws.com',
	port: 3306,
    user: 'admin',
    password: ''
});

app.post('/users', (req, res) => {
    if (req.query.username && req.query.email && req.query.age) {
        console.log('Request received');

        con.connect(err => {
            con.query(`INSERT INTO main.users (username, email, age) VALUES ('${req.query.username}', '${req.query.email}', '${req.query.age}')`, (err, result, fields) => {
                if (err) res.send(err);
                if (result) res.send({username: req.query.username, email: req.query.email, age: req.query.age});
                if (fields) console.log(fields);
            });
        });
    } else {
        console.log('Missing a parameter');
    }
});

app.get('/users', (req, res) => {
    con.connect(err => {
        con.query(`SELECT * FROM main.users`, (err, result, fields) => {
            if (err) res.send(err);
            if (result) res.send(result);
        });
    });
});

app.get('/users/:username/age', (req, res) => {
    const username = req.params.username;
    con.connect(err => {
        con.query(`SELECT age FROM main.users WHERE username = ? `, username, (err, result, fields) => {
            res.send(result);
        });
    })
})

app.put('/users/:username/email', (req, res) => {
    const username = req.params.username;
    const email = req.query.email;
    con.connect(err => {
        con.query(`UPDATE main.users SET email = ? WHERE username = ?`, [email, username], (err, result) => {
            if (err) res.send(err);
            if (result) res.send(result);
        });
    });
});

app.get('/users/:username', (req, res) => {
    const username = req.params.username;
    con.connect(err => {
        con.query(`SELECT * FROM main.users WHERE username = ? `, username, (err, result, fields) => {
            res.send(result);
        });
    })
});

app.delete('/users/:username', (req, res) => {
    const username = req.params.username;
    con.connect(err => {
        con.query(`DELETE FROM main.users WHERE username = ?`, username, (err, result) => {
            if (err) res.send(err);
            if (result) res.send(result);
        });
    });
});

app.delete('/users/:username', (req, res) => {
    const username = req.params.username;
    con.connect(err => {
        con.query(`DELETE FROM main.users WHERE username = ?`, username, (err, result) => {
            if (err) res.send(err);
            if (result) res.send(result);
        });
    });
});

app.listen(port, () => console.log(`RDS App listening on port ${port}!`));
