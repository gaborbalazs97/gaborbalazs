// NOTE: This logic should replace the core fetch function in your original gallery.js file.

document.addEventListener('DOMContentLoaded', () => {
    const gallery = document.getElementById('pexels-gallery');
    
    // 1. **CRITICAL CHANGE:** We call a secure, local endpoint, NOT the Pexels API directly.
    // The Serverless Function will handle the API key securely.
    const SECURE_PROXY_URL = '/.netlify/functions/pexels-fetch-proxy.js'; // Adjust if using Vercel/another provider

    async function fetchPexelsPhotosSecurely() {
        try {
            // 2. Pass the Collection ID in the query string (the key stays hidden on the server)
            const COLLECTION_ID = 'hg3j8sx'; // Re-use your working Collection ID
            
            // Add cache-buster to ensure fresh data
            const timestamp = new Date().getTime(); 
            const fetchUrl = `${SECURE_PROXY_URL}?collectionId=${COLLECTION_ID}&cachebuster=${timestamp}`;

            gallery.innerHTML = '<p class="text-center py-10 text-gray-500">Loading photos securely...</p>'; 

            // 3. Fetch from the local proxy endpoint
            const response = await fetch(fetchUrl);
            
            if (!response.ok) {
                // If the proxy fails, throw an error
                throw new Error(`Proxy error! Status: ${response.status}.`);
            }

            const data = await response.json();
            
            gallery.innerHTML = ''; // Clear loading message

            // 4. Check if the function returned an error message
            if (data.error) {
                 throw new Error(data.error);
            }

            const photos = data.media.filter(item => item.type === 'Photo');

            if (photos.length === 0) {
                 gallery.innerHTML = '<p class="text-center py-10 text-gray-500">Collection is empty or contains no photos.</p>';
                 return;
            }

            // 5. Normal photo rendering logic (using photo.src.large)
            photos.forEach(photo => {
                // ... (your existing photo rendering logic, simplified here)
                const photoLink = document.createElement('a');
                photoLink.href = photo.url; 
                photoLink.target = '_blank';
                photoLink.classList.add('photo-item');
                
                const img = document.createElement('img');
                img.src = photo.src.large; 
                img.alt = photo.alt || `Photo by ${photo.photographer}`;
                img.loading = 'lazy'; 

                // NOTE: You would re-add your overlay/details logic here

                photoLink.appendChild(img);
                gallery.appendChild(photoLink);
            });

        } catch (error) {
            console.error('Error fetching Pexels photos:', error);
            gallery.innerHTML = `<p class="text-center py-10 text-red-500">Error loading photos: ${error.message}</p>`;
        }
    }

    fetchPexelsPhotosSecurely();
});

