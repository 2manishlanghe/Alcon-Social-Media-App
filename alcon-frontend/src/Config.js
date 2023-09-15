import { PublicClientApplication } from '@azure/msal-browser';
 
 const msalConfig = {
    auth: {
      clientId: '5cc32891-3ed2-4292-b12d-3bf73e74299d', // Replace with your actual client ID
      authority: 'https://login.microsoftonline.com/d51cd7bb-6235-4c6b-9257-46d4705cb151', // Replace with your actual tenant ID
      redirectUri: 'http://localhost:3000', // Redirect URI after login
    }
  };
  const pca = new PublicClientApplication(msalConfig);
  pca.getLogger();
  export const loginRequest = {
    scopes: ['user.read'], // Add required scopes
  };
 
  export { msalConfig };