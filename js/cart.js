// Cart-specific functions
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    location.reload(); // Refresh to update display
}

function calculateTotal() {
    return cart.reduce((total, item) => total + item.price, 0);
}