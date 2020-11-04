const express = require('express');
const bodyParser = require('body-parser');
const AWS = require('aws-sdk');

AWS.config.update({region: 'us-east-1'});

const app = express();
const port = process.argv.slice(2)[0];
const credentials = new AWS.SharedIniFileCredentials({profile: 'sqs_profile'});
const sqs = new AWS.SQS({apiVersion: '2012-11-05', credentials: credentials});
const queueUrl = '';

app.use(bodyParser.json());

app.get('/index', (req, res) => {
    res.send('Welcome to NodeShop Orders.')
});

app.post('/order', async (req, res) => {
    let orderData = {
        userPhone: req.body['userPhone'],
        itemName: req.body['itemName'],
        itemPrice: req.body['itemPrice'],
        itemsQuantity: req.body['itemsQuantity']
    }

    let sqsOrderData = {
        MessageAttributes: {
            userPhone: {
                DataType: 'String',
                StringValue: orderData.userPhone
            },
            itemName: {
                DataType: 'String',
                StringValue: orderData.itemName
            },
            itemPrice: {
                DataType: 'Number',
                StringValue: orderData.itemPrice
            },
            itemsQuantity: {
                DataType: 'Number',
                StringValue: orderData.itemsQuantity
            }
        },
        MessageBody: JSON.stringify(orderData),
        // Changed from `userEmail` to `userPhone`
        MessageDeduplicationId: req.body['userPhone'],
        MessageGroupId: 'UserOrders',
        QueueUrl: queueUrl
    };

    try {
	   // Send the order data to the SQS queue
        let data = await sqs.sendMessage(sqsOrderData).promise();
        console.log(`OrdersSvc | SUCCESS: ${data.MessageId}`);
        res.send('Thank you for your order. Check you inbox for the confirmation email.');
    } catch((err) => {
        console.log(`OrdersSvc | ERROR: ${err}`);
        res.send('We ran into an error. Please try again.');
    }
});

console.log(`Orders service listening on port ${port}`);
app.listen(port);
