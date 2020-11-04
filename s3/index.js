const AWS = require('aws-sdk');
const fs = require('fs');

// NOTE: Enter copied or downloaded access ID and secret key here
const ID = '';
const SECRET = '';

// NOTE: Chagne to the name of the bucket that you have created
const BUCKET_NAME = 'test-bucket-2222';

const s3 = new AWS.S3({
    accessKeyId: ID,
    secretAccessKey: SECRET
});

const downloadFile = (filePath, bucketName, key) => {
    // Setting up S3 parameters
    const params = {
        Bucket: bucketName, // Name of your bucket
        Key: key            // Name of the file you want to download
    };

    // Get the object
    s3.getObject(params, (err, data) => {
        if (err) {
            throw err;
        }

        fs.writeFileSync(filePath, data.Body);

        console.log('File downloaded successfully.');
		console.log(data);
    });
};

downloadFile('cat-local.jpg', BUCKET_NAME, 'cat.jpg');
