// Import necessary modules
import express from 'express';
import jwt_decode from 'jwt-decode'; // You may need to install this package

const app = express();

// Route to handle the callback from Azure AD after authentication
app.get('/auth/callback', (req, res) => {
    // Extract the ID token from the query parameters (assuming it's passed as a query parameter named 'id_token')
    const idToken = req.query.id_token;

    if (!idToken) {
        return res.status(400).send('ID token missing');
    }

    try {
        // Decode the ID token to extract user information
        const decodedToken = jwt_decode(idToken);

        // Example: Extract user details
        const userId = decodedToken.oid;
        const userName = decodedToken.name;
        const userEmail = decodedToken.email;

        // You can now use these details in your application
        res.send(`User ID: ${userId}, Name: ${userName}, Email: ${userEmail}`);
    } catch (error) {
        console.error('Error decoding token:', error);
        res.status(500).send('Internal server error');
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
