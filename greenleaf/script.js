document.addEventListener('DOMContentLoaded', () => {

    // ---CONFIGURATION---
    // Replace with your WhatsApp number (include country code without '+')
    const your_phone_number = '7004869356'; 
    // Replace with your email address
    const your_email = 'sudhanshushekhar448860@gmail.com';
    // -------------------

    const plantTiles = document.querySelectorAll('.plant-tile');
    const modal = document.getElementById('plantModal');
    const closeButton = document.querySelector('.close-button');
    
    // Modal elements
    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const modalPrice = document.getElementById('modal-price');
    const modalDescription = document.getElementById('modal-description');
    
    // Contact buttons
    const whatsappBtn = document.getElementById('whatsapp-btn');
    const emailBtn = document.getElementById('email-btn');

    let currentPlant = {};

    plantTiles.forEach(tile => {
        tile.addEventListener('click', () => {
            // Get data from the clicked tile's data attributes
            currentPlant.name = tile.dataset.plantName;
            currentPlant.price = tile.dataset.plantPrice;
            currentPlant.image = tile.dataset.plantImage;
            currentPlant.description = tile.dataset.plantDescription;

            // Populate the modal with the plant data
            modalImg.src = currentPlant.image;
            modalTitle.textContent = currentPlant.name;
            modalPrice.textContent = currentPlant.price;
            modalDescription.textContent = currentPlant.description;
            
            // Show the modal
            modal.style.display = 'block';
        });
    });

    // Function to close the modal
    const closeModal = () => {
        modal.style.display = 'none';
    };

    // Event listeners for closing the modal
    closeButton.addEventListener('click', closeModal);
    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            closeModal();
        }
    });

    // --- UPDATED WHATSAPP BUTTON ---
    whatsappBtn.addEventListener('click', () => {
        // The message now includes the image link on a new line
        const message = `Hello! I am interested in ordering the "${currentPlant.name}" priced at ${currentPlant.price}. Please let me know the next steps. Thank you!\n\nhttps://agriplantsapp.vercel.app/${currentPlant.image}`;
        const whatsappUrl = `https://wa.me/${your_phone_number}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    });

    // --- UPDATED EMAIL BUTTON ---
    emailBtn.addEventListener('click', () => {
        const subject = `Plant Order: ${currentPlant.name}`;
        // The body now includes a line for the image link
        const body = `Hello,\n\nI would like to place an order for the following plant:\n\nPlant Name: ${currentPlant.name}\nPrice: ${currentPlant.price}\nImage Link: https://agriplantsapp.vercel.app/${currentPlant.image}\n\nPlease provide me with payment and delivery details.\n\nThank you!`;
        const emailUrl = `mailto:${your_email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = emailUrl;
    });
});
