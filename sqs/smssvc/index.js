const AWS = require('aws-sdk');
const { Consumer } = require('sqs-consumer');
const nodemailer = require('nodemailer');

AWS.config.update({region: 'us-east-1'});

const credentialsSQS = new AWS.SharedIniFileCredentials({profile: 'sqs_profile'});
const credentialsSNS = new AWS.SharedIniFileCredentials({profile: 'sns_profile'});
const sqs = new AWS.SQS({apiVersion: '2012-11-05', credentials:credentialsSQS});
const sns = new AWS.SNS({region: 'us-east-1', credentials:credentialsSNS});
const queueUrl = '';


async function sendSMS(message) {
    let msg = JSON.parse(message.Body);

    let textMsg = `Hi ${msg.userPhone}. Your order of ${msg.itemsQuantity} ${msg.itemName} has been received and is being processed. Thank you for shopping with us!`

    let params = {
        Message: textMsg,
        Subject: 'Order Received | NodeShop',
        PhoneNumber: msg.userPhone,
    };

    try {
        let data = await sns.publish(params).promise();
        console.log(`Message sent: ${data.MessageId}`)
    } catch(err => {
        console.error(err, err.stack);
    }
}

// Create our consumer
const app = Consumer.create({
    queueUrl: queueUrl,
    handleMessage: async message => {
        await sendSMS(message);
    },
    sqs: sqs
});

app.on('error', (err) => {
    console.error(err.message);
});

app.on('processing_error', (err) => {
    console.error(err.message);
});

console.log('SMS service is running');

app.start();
