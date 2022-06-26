export enum Config {
  Region = 'eu-west-1',
  Bucket = 'nodejs-import-bucket',
};

export enum S3Operations {
  PutObject = 'putObject',
};

export enum S3Events {
  ObjectCreated = 's3:ObjectCreated:*',
};
