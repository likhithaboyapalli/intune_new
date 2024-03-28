import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();

// Your Azure AD configuration
const clientId = '02e28f55-48eb-4bad-bcc8-14210e0df077';
const clientSecret = '44v8Q~RsAmr2Uw.LTeMwVvfYz2O2caU.4XgbjapU';
const tenantId = 'fdc223cd-8687-48e5-b9e8-ad52f8adbdaa';

app.use(cors());

app.use(express.static('public'))

app.get('/getAccessToken', async (req, res) => {
    try {
        // Retrieve the app access token
        const appAuthToken = await authforApp(clientId, clientSecret, tenantId);

        res.json({
            app_token: appAuthToken
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to obtain app token' });
    }
});


async function authforApp(clientId, clientSecret, tenantId) {
    const authUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;

    // Define the request body for obtaining a token
    const authRequestBody = {
        grant_type: 'client_credentials',
        scope: 'https://graph.microsoft.com/.default',
        client_id: clientId,
        client_secret: clientSecret,
        tenant: tenantId
    };

    try {
        const response = await fetch(authUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams(authRequestBody).toString(), // Ensure the body is URL-encoded
        });

        if (response.ok) {
            const authData = await response.json();

            if (authData.access_token) {
                return authData.access_token;
            } else {
                console.error('Error obtaining app token:', authData.error_description);
                throw new Error('Error obtaining app token: No access token found');
            }
        } else {
            console.error('Error obtaining app token:', response.statusText);
            throw new Error('Error obtaining app token: Bad response status');
        }
    } catch (error) {
        console.error('Error:', error);
        throw new Error('Error obtaining app token: Network error or other issue');
    }
}
const PORT = process.env.PORT || 443;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


