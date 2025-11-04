document.addEventListener('DOMContentLoaded', () => {
    const gallery = document.getElementById('pexels-gallery');
    
    // 1. >>> YOUR SECRETS ARE EXPOSED HERE! DO NOT DEPLOY THIS LIVE! <<<
    const PEXELS_API_KEY = '4JtQpwR6p5guyBUK8IO5IAmWCh8GMOWVksr5nxiRCR6qXpEh889893fm'; 
    
    // 2. PASTE YOUR COLLECTION ID HERE (e.g., 'v45xW8Z')
    const COLLECTION_ID = 'hg3j8sx'; 

    // 3. USE THE COLLECTION ENDPOINT:
    // This calls the specific collection ID and fetches its media.
    const PEXELS_URL = `https://api.pexels.com/v1/collections/${COLLECTION_ID}?per_page=40`;

    async function fetchPexelsPhotos() {
        try {
            // Fetch data, passing the API key in the Authorization header
            const response = await fetch(PEXELS_URL, {
                headers: {
                    Authorization: PEXELS_API_KEY,
                },
            });
            
            if (!response.ok) {
                // If key or ID is wrong, this will catch the error
                throw new Error(`HTTP error! Status: ${response.status}. Check API Key and Collection ID.`);
            }

            const data = await response.json();
            
            gallery.innerHTML = ''; 

            // 4. Important: The collections endpoint returns photos in a slightly different structure (data.media)
            const photos = data.media.filter(item => item.type === 'Photo');

            if (photos.length === 0) {
                 gallery.innerHTML = '<p>Collection is empty or contains no photos.</p>';
                 return;
            }

            // Loop through the photos
            photos.forEach(photo => {
                const photoLink = document.createElement('a');
                // The URL property is slightly different in the collection object
                photoLink.href = photo.url; 
                photoLink.target = '_blank';
                photoLink.classList.add('photo-item');

                const img = document.createElement('img');
                // Use the 'medium' size for your gallery view
                img.src = photo.src.large; 
                img.alt = photo.alt || `Photo by ${photo.photographer}`;
                img.loading = 'lazy'; 

                photoLink.appendChild(img);
                gallery.appendChild(photoLink);
            });

        } catch (error) {
            console.error('Error fetching Pexels photos:', error);
            gallery.innerHTML = `<p>Sorry, could not load photos. Error: ${error.message}</p>`;
        }
    }

    fetchPexelsPhotos();
});
