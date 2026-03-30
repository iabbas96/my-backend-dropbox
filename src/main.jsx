import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { Amplify } from 'aws-amplify'
import './index.css'

//to get config from Environment Variable (Vercel) and a Fall back to the local file if the variable is missing (Local Dev)
let config;
if (import.meta.env.VITE_AMPLIFY_CONFIG) {
  config = JSON.parse(import.meta.env.VITE_AMPLIFY_CONFIG);
} else {
  // for the local development to run
  import('../amplify_outputs.json').then((module) => {
    Amplify.configure(module.default);
  }).catch(() => {
    console.error("Amplify config not found");
  });
}

if (config) Amplify.configure(config);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
