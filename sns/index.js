const express = require('express');
const AWS = require('aws-sdk');

const credentials = new AWS.SharedIniFileCredentials({profile: 'sns_profile'});
const sns = new AWS.SNS({credentials: credentials, region: 'us-east-1'});

const app = express();
const port = 3001;

app.use(express.json());

app.get('/status', (req, res) => res.json({status: 'ok', sns: sns}));

app.post('/subscribe-email', (req, res) => {
    let params = {
        Protocol: 'EMAIL',
        TopicArn: '<ARN>',
        Endpoint: req.body.email
    };

    sns.subscribe(params)
        .promise()
        .then(data => {
            console.log(data);
        }).catch(err => {
            console.error(err, err.stack);
        });
});

app.post('/send', (req, res) => {
    let message = {
        'default': 'SNS Notification',
        'email': 'Hello from SNS on email',
        'sms': 'Hello from SNS on SMS'
    };

    let params = {
        Message: JSON.stringify(message),
        MessageStructure: 'json',
        Subject: req.body.subject,
        TopicArn: '<ARN>'
    };

    sns.publish(params, (err, data) => {
        if (err) console.log(err, err.stack);
        else console.log(data);
    });
});


app.listen(port, () => console.log(`SNS App listening on port ${port}!`));
