// ======================
// PRODUCT DATA
// ======================
const products = [
    {
        id: 1,
        name: "Leather Saddle",
        price: 250,
        category: "equitation",
        desc: "Handcrafted premium leather saddle for professional riding",
        image: "images/saddle.jpg",
        
    },
     {
        id: 2,
        name: "Leather Reins",
        price: 25,
        category: "equitation",
        desc: "Durable reins with polished brass fittings",
        image: "images/reins.jpg"
    },
    {
        id: 3,
        name: "Riding Helmet",
        price: 60,
        category: "equitation",
        desc: "Ventilated ASTM/SEI-certified helmet",
        image: "images/helmet.jpg",
        sizes: ["S", "M", "L", "XL"]
    },
    {
        id: 4,
        name: "Swimming Goggles",
        price: 25,
        category: "natation",
        desc: "Anti-fog, UV-protected competition goggles",
        image: "images/goggles.jpg"
    },
    {
        id: 5,
        name: "Silicone Swim Cap",
        price: 5,
        category: "natation",
        desc: "Latex-free cap for long hair protection",
        image: "images/cap.jpg"
    },
    {
        id: 6,
        name: "Nose Clip",
        price: 3,
        category: "natation",
        desc: "Adjustable clip for synchronized swimming",
        image: "images/noseclip.jpg"
    },
    {
        id: 7,
        name: "Swim Paddles",
        price: 65,
        category: "natation",
        desc: "Training paddles for stroke improvement",
        image: "images/palms.jpg",
        sizes: ["eu 40", "eu 41", "eu 42", "eu 43"]
    },
    {
        id: 8,
        name: "Grooming Brush",
        price: 7,
        category: "equitation",
        desc: "Gentle yet effective brush for horse grooming",
        image: "images/brosse.jpg"
    },
    {
        id: 9,
        name: "Waterproof Swim Bag",
        price: 40,
        category: "natation",
        desc: "Spacious waterproof bag for wet swim gear",
        image: "images/bag.jpg"
    },
    {
        id: 10,
        name: "Basic Riding Boots",
        price: 40,
        category: "equitation",
        desc: "Classic leather boots for everyday riding",
        image: "images/boots.jpg",
        sizes: ["EU 38", "EU 40", "EU 42", "EU 44"]
    }
];

// ======================
// DATA STORAGE SYSTEMS
// ======================
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let siteFeedback = JSON.parse(localStorage.getItem('siteFeedback')) || [];

// ======================
// UTILITY FUNCTIONS
// ======================
function sanitizeInput(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ======================
// CART SYSTEM
// ======================
function addToCart(productId, size = null) {
    try {
        const existingItem = cart.find(item => 
            item.id === productId && item.size === size
        );

        if (existingItem) {
            existingItem.quantity = (existingItem.quantity || 1) + 1;
        } else {
            const product = products.find(p => p.id === productId);
            if (!product) return;
            
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                size: size,
                quantity: 1
            });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        showToast(`${product.name} ${size ? `(Size: ${size})` : ''} added to cart!`);
    } catch (error) {
        console.error('Error adding to cart:', error);
        showToast('Failed to add item to cart', 'error');
    }
}

function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    renderCartItems();
}

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelectorAll('.cart-count').forEach(el => {
        el.textContent = totalItems;
    });
}

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }, 100);
}
// ======================
// SIZE SELECTION MODAL
// ======================
function setupSizeModal() {
    const modal = document.getElementById('sizeModal');
    
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-add-to-cart')) {
            const productId = parseInt(e.target.dataset.id);
            const product = products.find(p => p.id === productId);
            
            if (product.sizes && product.sizes.length > 0) {
                showSizeModal(productId);
                e.preventDefault();
            }
        }
    });

    modal.querySelector('.confirm-size').addEventListener('click', function() {
        const selectedSize = modal.querySelector('.size-option.selected')?.textContent;
        const productId = parseInt(modal.dataset.productId);
        
        if (selectedSize) {
            addToCart(productId, selectedSize);
            modal.style.display = 'none';
        } else {
            showToast('Please select a size', 'error');
        }
    });
}

function showSizeModal(productId) {
    const modal = document.getElementById('sizeModal');
    const product = products.find(p => p.id === productId);
    
    modal.dataset.productId = productId;
    modal.querySelector('.size-options').innerHTML = product.sizes
        .map(size => `<span class="size-option" data-value="${size}">${size}</span>`)
        .join('');
    
    modal.style.display = 'block';
    
    // Reset selection
    modal.querySelectorAll('.size-option').forEach(option => {
        option.classList.remove('selected');
        option.addEventListener('click', function() {
            modal.querySelectorAll('.size-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            this.classList.add('selected');
        });
    });
}

// ======================
// SIMPLE FEEDBACK SYSTEM
// ======================
function setupFeedbackSystem() {
    // Create feedback elements if they don't exist
    if (!document.getElementById('feedback-container')) {
        createFeedbackElements();
    }

    const feedbackText = document.getElementById('feedback-text');
    const submitBtn = document.getElementById('submit-feedback');
    const feedbackDisplay = document.getElementById('feedback-display');

    // Load saved feedback
    function loadFeedback() {
        if (siteFeedback.length > 0) {
            feedbackDisplay.innerHTML = `
                <h4>Previous Feedback:</h4>
                ${siteFeedback.map(fb => `
                    <div class="feedback-item">
                        <p>${fb.comment}</p>
                        <small>${fb.date}</small>
                    </div>
                `).join('')}
            `;
        }
    }

    // Submit feedback
    submitBtn.addEventListener('click', function() {
        const comment = sanitizeInput(feedbackText.value.trim());
        
        if (!comment) {
            showToast('Please enter your feedback', 'error');
            return;
        }

        const newFeedback = {
            comment: comment,
            date: new Date().toLocaleDateString()
        };

        siteFeedback.push(newFeedback);
        localStorage.setItem('siteFeedback', JSON.stringify(siteFeedback));
        
        feedbackText.value = '';
        loadFeedback();
        showToast('Thank you for your feedback!');
    });

    // Initial load
    loadFeedback();
}

function createFeedbackElements() {
    const container = document.createElement('div');
    container.id = 'feedback-container';
    container.style.maxWidth = '500px';
    container.style.margin = '20px auto';
    container.style.padding = '20px';
    container.style.border = '1px solid #ddd';
    container.style.borderRadius = '5px';

    container.innerHTML = `
        <h3>Share Your Feedback</h3>
        <textarea id="feedback-text" placeholder="Your comments..." 
                  style="width:100%; height:100px; margin:10px 0; padding:8px;"></textarea>
        <button id="submit-feedback" 
                style="background:#4CAF50; color:white; border:none; padding:10px 20px; border-radius:4px; cursor:pointer;">
            Submit Feedback
        </button>
        <div id="feedback-display" style="margin-top:20px;"></div>
    `;

    document.body.appendChild(container);
}

// ======================
// MODAL MANAGEMENT
// ======================
function setupModals() {
    // Close modals when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });

    // Close buttons
    document.querySelectorAll('.modal .close').forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });

    // Escape key to close modals
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal').forEach(modal => {
                modal.style.display = 'none';
            });
        }
    });
}

// ======================
// INITIALIZATION
// ======================
document.addEventListener('DOMContentLoaded', function() {
    setupSizeModal();
    setupFeedbackSystem();
    setupModals();
    updateCartCount();
});