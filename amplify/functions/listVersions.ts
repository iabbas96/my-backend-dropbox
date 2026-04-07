import { S3Client, ListObjectVersionsCommand } from '@aws-sdk/client-s3';

const s3 = new S3Client({});
const BUCKET_NAME = process.env.BUCKET_NAME!;

export const handler = async (event: any) => {
  const key = event.queryStringParameters?.key;
  if (!key) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing "key" query parameter' }),
    };
  }

  try {
    const command = new ListObjectVersionsCommand({
      Bucket: BUCKET_NAME,
      Prefix: key,
    });
    const response = await s3.send(command);
    const versions = response.Versions?.map(v => ({
      versionId: v.VersionId,
      lastModified: v.LastModified,
      isLatest: v.IsLatest,
      size: v.Size,
    })) || [];

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ versions }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};