import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'dropboxBucket',
  access: (allow) => ({
    'private/{entity_id}/*': [allow.authenticated.to(['read', 'write', 'delete'])],
  }),
  versioned: true,   //to  enable the S3 versioning
});


