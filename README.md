# My Backend Dropbox

A serverless file hosting app inspired by Dropbox, built with React and AWS.

## Live URL

the live url: https://inquisitive-semifreddo-b5bef8.netlify.app/

## Features

- User authentication (AWS Cognito)
- File upload with progress bar
- File download
- File versioning (S3 versioning)
- Delete files
- Responsive UI

## Tech Stack

- Frontend: React + Vite
- Storage: AWS S3 (with versioning)
- Auth: AWS Cognito via Amplify
- Hosting: AWS Amplify
- Database: MongoDB Atlas (metadata)

## Setup

1. Clone the repo
2. Run `npm install`
3. Run `npm create amplify@latest`
4. Run `npx ampx sandbox`
5. Run `npm run dev`
