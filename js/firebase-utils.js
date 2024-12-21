import { db } from './firebase-config.js';
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Save Cart with proper path
export async function saveCart(userId, cartItems) {
    if (!userId) return;
    const cartRef = doc(db, `users/${userId}/cart/data`);
    await setDoc(cartRef, { 
        items: cartItems,
        updatedAt: new Date().toISOString()
    });
}

// Load Cart
export async function loadCart(userId) {
    if (!userId) return [];
    const cartRef = doc(db, `users/${userId}/cart/data`);
    const cartDoc = await getDoc(cartRef);
    return cartDoc.exists() ? cartDoc.data().items : [];
}

// Add to Cart
export async function addToCart(userId, product) {
    if (!userId) return;
    
    try {
        const cartItems = await loadCart(userId);
        const existingItemIndex = cartItems.findIndex(item => 
            item.title === product.title && item.price === product.price
        );
        
        if (existingItemIndex !== -1) {
            cartItems[existingItemIndex].quantity += 1;
        } else {
            cartItems.push({
                ...product,
                quantity: 1
            });
        }
        
        await saveCart(userId, cartItems);
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        return cartItems;
    } catch (error) {
        console.error('Error adding to cart:', error);
        throw error;
    }
}

// Save Order
export async function saveOrder(userId, orderData) {
    if (!userId) throw new Error('User ID is required');
    
    try {
        // Create a reference to the orders collection
        const ordersCollectionRef = collection(db, 'users', userId, 'orders');
        
        // Create a new document with auto-generated ID
        const newOrderRef = doc(ordersCollectionRef);
        
        const orderToSave = {
            ...orderData,
            userId,
            orderId: newOrderRef.id, // Use Firestore's auto-generated ID
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        console.log('Saving order:', {
            userId,
            path: newOrderRef.path,
            data: orderToSave
        });
        
        // Save the document
        await setDoc(newOrderRef, orderToSave);
        
        return newOrderRef.id;
    } catch (error) {
        console.error('Error saving order:', error);
        throw error;
    }
}

// Add a function to test if orders are working
export async function testOrderSave(userId) {
    try {
        const testOrder = {
            items: [{
                name: "Test Product",
                price: "₹999",
                quantity: 1
            }],
            total: "₹999",
            status: "pending"
        };
        
        const orderId = await saveOrder(userId, testOrder);
        console.log('Test order saved successfully with ID:', orderId);
        return orderId;
    } catch (error) {
        console.error('Test order failed:', error);
        throw error;
    }
}

// Save Wishlist
export async function saveWishlist(userId, wishlistItems) {
    if (!userId) return;
    const wishlistRef = doc(db, `users/${userId}/wishlist/data`);
    await setDoc(wishlistRef, {
        items: wishlistItems,
        updatedAt: new Date().toISOString()
    });
}

// Save Address
export async function saveAddress(userId, addressData) {
    const addressRef = doc(db, `users/${userId}/address`);
    await setDoc(addressRef, addressData);
}

// Load Wishlist
export async function loadWishlist(userId) {
    if (!userId) return [];
    try {
        const wishlistRef = doc(db, `users/${userId}/wishlist/data`);
        const wishlistDoc = await getDoc(wishlistRef);
        return wishlistDoc.exists() ? wishlistDoc.data().items : [];
    } catch (error) {
        console.error('Error loading wishlist:', error);
        return [];
    }
}

export async function loadOrders(userId) {
    if (!userId) return [];
    
    try {
        const ordersRef = collection(db, 'users', userId, 'orders');
        const ordersSnapshot = await getDocs(ordersRef);
        
        return ordersSnapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id
        }));
    } catch (error) {
        console.error('Error loading orders:', error);
        return [];
    }
} 