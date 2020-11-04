const AWS = require('aws-sdk');

const credentials = new AWS.SharedIniFileCredentials({profile: 'ec2_profile'});

// Configure the region
AWS.config.update({credentials: credentials, region: 'us-east-1'});

// Instantiating an EC2 object
const ec2 = new AWS.EC2({apiVersion: '2016-11-15'});

let instanceParams = {
    InstanceIds: [
        'i-0609b562cd4c8d9ea',
        'i-08fd5ad87f9ede25e'
    ]
};

ec2.terminateInstances(instanceParams)
    .promise().then(data => {
    console.log(data);
});
