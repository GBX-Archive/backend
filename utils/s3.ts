import * as AWS from 'aws-sdk';
import { Readable } from 'stream';
import { readFileSync, unlinkSync } from 'fs';
import * as dotenv from 'dotenv';

dotenv.config();

const s3 = new AWS.S3({
  // Note: I use digital ocean spaces, so I have to set the endpoint
  endpoint: new AWS.Endpoint('https://fra1.digitaloceanspaces.com'),
  accessKeyId: process.env.SPACES_KEY,
  secretAccessKey: process.env.SPACES_SECRET,
});

// upload file from path to digital ocean spaces
const uploadFile = async (path: string, filename: string) => {
  // read file from path
  const file = readFileSync(path);

  // create readable stream
  const stream = new Readable();
  stream.push(file);
  stream.push(null);

  // upload to spaces
  const params = {
    Bucket: 'jay-cdn-01',
    Key: filename,
    Body: stream,
    ACL: 'public-read',
  };

  const result = await s3.upload(params).promise();

  // delete local file
  unlinkSync(path);

  return `https://jay-cdn-01.fra1.digitaloceanspaces.com/${filename}`;
};

export default uploadFile;
