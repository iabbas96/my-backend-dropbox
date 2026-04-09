import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';
import { Stack } from 'aws-cdk-lib';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { RestApi, LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const backend = defineBackend({
  auth,
  data,
  storage,
});

// Get the S3 bucket from storage resource
const { bucket } = backend.storage.resources;

// Lambda to list versions
const listVersionsFn = new NodejsFunction(backend.createStack('ApiStack'), 'ListVersionsFn', {
  entry: join(__dirname, 'functions', 'listVersions.ts'),
  handler: 'handler',
  runtime: Runtime.NODEJS_20_X,
  environment: {
    BUCKET_NAME: bucket.bucketName,
    ALLOWED_ORIGIN: 'https://main.d14jnftetiz25k.amplifyapp.com',
  },
});

listVersionsFn.addToRolePolicy(
  new PolicyStatement({
    actions: ['s3:ListBucketVersions'],
    resources: [bucket.bucketArn],
  })
);

// Grant the authenticated role access to the bucket (using correct property name)
backend.auth.resources.authenticatedUserIamRole.addToPrincipalPolicy(
  new PolicyStatement({
    actions: ['s3:PutObject', 's3:GetObject', 's3:ListBucket', 's3:DeleteObject'],
    resources: [bucket.bucketArn, `${bucket.bucketArn}/*`],
  })
);

// REST API Gateway
const api = new RestApi(backend.createStack('ApiStack2'), 'VersionsApi', {
  restApiName: 'FileVersionsService',
  defaultCorsPreflightOptions: {
    allowOrigins: ['https://main.d14jnftetiz25k.amplifyapp.com'],
    allowMethods: ['GET', 'OPTIONS'],
  },
});
const versions = api.root.addResource('versions');
versions.addMethod('GET', new LambdaIntegration(listVersionsFn));

backend.addOutput({
  custom: {
    apiUrl: api.url,
  },
});