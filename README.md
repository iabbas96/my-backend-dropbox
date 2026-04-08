# Live URL: https://main.d3ez0fjqtjc8s8.amplifyapp.com/

# Task

Dropbox is a file hosting service operated by the American company Dropbox, Inc., headquartered in San Francisco, California, that offers cloud storage, file synchronization, personal cloud, and client software. My Backend Dropbox is A serverless file hosting application inspired by Dropbox, built with React and AWS. This project implements cloud storage, file synchronization, and user authentication using serverless architecture.

# Description

My Backend Dropbox is a fully serverless cloud storage application that allows authenticated users to upload, download, delete, and manage files in the cloud. The application leverages AWS services for backend infrastructure including S3 for file storage with versioning, Cognito for user authentication, and Amplify for backend management. The frontend is built with React and Vite, providing a fast and responsive user interface.

The application demonstrates the power of serverless computing — there are no fixed servers to manage. AWS handles all scaling, availability, and infrastructure automatically, charging only for actual usage.

-> Features

- User authentication (sign up, sign in, sign out, email verification)
- File upload with real-time progress bar
- File download via secure signed URLs
- File deletion
- File versioning (AWS S3 versioning enabled)
- Responsive and clean UI
- Protected routes — only authenticated users can access files

-> Tech Stack

| Layer          | Technology                       |
| -------------- | -------------------------------- |
| Frontend       | React 19, Vite                   |
| Authentication | AWS Cognito via AWS Amplify      |
| File Storage   | AWS S3 (with versioning enabled) |
| Backend        | AWS Amplify Gen 2 (serverless)   |
| Hosting        | Netlify                          |
| Language       | JavaScript                       |

-> Project Structure

```
my-backend-dropbox/
├── amplify/
│   ├── auth/
│   │   └── resource.ts        # Cognito auth configuration
│   ├── storage/
│   │   └── resource.ts        # S3 storage configuration
│   └── backend.ts             # Main backend entry point
├── src/
│   ├── components/
│   │   ├── FileList.jsx       # Displays uploaded files
│   │   ├── FileList.css       # Styles for FileList
│   │   ├── UploadButton.jsx   # Handles file uploads
│   │   └── UploadButton.css   # Styles for UploadButton
│   ├── App.jsx                # Main app component with auth
│   ├── App.css                # Main app styles
│   └── main.jsx               # Entry point with Amplify config
├── .gitignore
├── vercel.json
├── package.json
└── README.md
```

-> Requirements

- Node.js v20 or higher
- npm v8 or higher
- AWS Account (free tier)
- Git

# Installation

1. Clone the repository as follows:

```bash
git clone https://github.com/iabbas96/my-backend-dropbox.git
cd my-backend-dropbox
```

2. Install dependencies as follows:

```bash
npm install
```

3. Install AWS Amplify dependencies as follows:

```bash
npm create amplify@latest
```

4. Configure your AWS credentials as follows:

```bash
aws configure
```

Enter your AWS Access Key ID, Secret Access Key, and set region to `us-north-1`.

5. Start the Amplify sandbox (deploys backend to AWS):

```bash
npx ampx sandbox
```

-> Wait for the output message:

```
-> Deployment completed
File written: amplify_outputs.json
```

6. Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

# Usage

LIVE URL: https://main.d3ez0fjqtjc8s8.amplifyapp.com/

-> Sign Up:

1. Visit the live URL or run locally
2. Click "Create Account"
3. Enter your email and a password (min 8 characters, must include uppercase, number and special character)
4. Check your email for a verification code and enter it

-> Upload a File:

1. Log in to your account
2. Click the "+ Upload File" button
3. Select any file from your computer
4. Watch the progress bar as it uploads to AWS S3
5. Click "Refresh" to see the file appear in the list

-> sDownload a File:

1. Find the file in the file list
2. Click the "Download" button
3. The file will open or download in your browser

-> Delete a File:

1. Find the file in the file list
2. Click the "Delete" button
3. Confirm the deletion
4. The file is permanently removed from S3

-> Environment

This project uses AWS Amplify Gen 2 which automatically generates an `amplify_outputs.json` file containing your cloud resource configuration. This file is excluded from version control via `.gitignore` for security reasons.

-> .gitignore

```
node_modules/
amplify_outputs.json
aws-exports.js
.env
.env.local
dist/
```

# The Core Team

By: ABBAS IBRAHIM
OGTL ACADEMY
Made at Qwasar SV -- Software Engineering School <img alt='Qwasar SV -- Software Engineering School's Logo' src='https://storage.googleapis.com/qwasar-public/qwasar-logo_50x50.png' width='20px' />

## Live URL
