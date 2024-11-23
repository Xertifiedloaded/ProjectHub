const { google } = require('googleapis');
const { auth } = require('google-auth-library');

// Create auth client using credentials
const credentials = {
  // You'll need to fill these in from your Google Cloud Console
  client_email: "YOUR_SERVICE_ACCOUNT_EMAIL",
  private_key: "528bfe921bae13830e049e5bba5744136325c765",
};

const scopes = ['https://www.googleapis.com/auth/drive.file'];

const authClient = new auth.JWT(
  credentials.client_email,
  null,
  credentials.private_key,
  scopes
);

const drive = google.drive({ version: 'v3', auth: authClient });