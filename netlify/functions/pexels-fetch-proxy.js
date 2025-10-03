// This file runs on the server, ensuring your API key is never exposed to the client.

// IMPORTANT: This function expects the Pexels API Key to be set as a private environment variable
// named PEXELS_API_KEY in your hosting provider's dashboard (Netlify/Vercel).

const PEXELS_API_KEY = process.env.PEXELS_API_KEY; 

// The handler is Netlify's standard function signature
exports.handler = async (event, context) => {
    // 1. Ensure the API key exists securely
    if (!PEXELS_API_KEY) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Server configuration error: PEXELS_API_KEY not set.' }),
        };
    }

    // 2. Get the collection ID passed from the client-side script
    const collectionId = event.queryStringParameters.collectionId;
    
    if (!collectionId) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Missing required collectionId parameter.' }),
        };
    }

    try {
        const PEXELS_URL = `https://api.pexels.com/v1/collections/${collectionId}?per_page=12`;

        // 3. Make the secure API call on the server
        const response = await fetch(PEXELS_URL, {
            headers: {
                Authorization: '4JtQpwR6p5guyBUK8IO5IAmWCh8GMOWVksr5nxiRCR6qXpEh889893fm', // The key is only used here!
            },
        });

        if (!response.ok) {
            // Forward the error from Pexels back to the client
            return {
                statusCode: response.status,
                body: JSON.stringify({ error: `Pexels API Error: ${response.statusText}` }),
            };
        }

        const data = await response.json();

        // 4. Return the data to the frontend
        return {
            statusCode: 200,
            // Netlify requires the body to be a string
            body: JSON.stringify(data), 
        };

    } catch (error) {
        console.error('Pexels Proxy Function Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal server error while fetching data.' }),
        };
    }
};
