import { auth, db } from './firebase-config.js';
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Initialize EmailJS
emailjs.init("90UD56CRQuVX6h6aT");

let verificationCode = '';

document.addEventListener('DOMContentLoaded', function() {
    const emailForm = document.getElementById('emailForm');
    const verificationSection = document.getElementById('verificationSection');
    const verifyBtn = document.getElementById('verifyBtn');
    const inputs = document.querySelectorAll('.code-input');

    // Add input handling for verification code boxes
    inputs.forEach((input, index) => {
        // Handle numeric input
        input.addEventListener('input', function(e) {
            // Only allow numbers
            this.value = this.value.replace(/[^0-9]/g, '');
            
            // Move to next input if value is entered
            if (this.value && index < inputs.length - 1) {
                inputs[index + 1].focus();
            }
        });

        // Handle backspace
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Backspace' && !this.value && index > 0) {
                // Move to previous input on backspace if current input is empty
                inputs[index - 1].focus();
            }
        });

        // Handle paste event
        input.addEventListener('paste', function(e) {
            e.preventDefault();
            const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '');
            
            // Distribute pasted numbers across inputs
            inputs.forEach((input, i) => {
                if (pastedData[i]) {
                    input.value = pastedData[i];
                    if (i < inputs.length - 1) {
                        inputs[i + 1].focus();
                    }
                }
            });
        });
    });

    // Email form submission
    emailForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const email = document.getElementById('emailInput').value;
        const sendCodeBtn = document.getElementById('sendCodeBtn');
        
        try {
            // Show loading state
            sendCodeBtn.classList.add('loading');
            sendCodeBtn.disabled = true;
            
            // Generate verification code
            verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
            
            // Send email using EmailJS
            await emailjs.send("service_ramkosp", "template_zltq1oc", {
                user_email: email,
                verification_code: verificationCode,
                from_name: "HASUTA"
            });

            localStorage.setItem('userEmail', email);
            localStorage.setItem('verificationCode', verificationCode);
            
            emailForm.style.display = 'none';
            verificationSection.style.display = 'block';
            document.getElementById('emailDisplay').textContent = `Code sent to ${email}`;
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to send code. Please try again.');
        } finally {
            // Remove loading state
            sendCodeBtn.classList.remove('loading');
            sendCodeBtn.disabled = false;
        }
    });

    // Verify button click
    verifyBtn.addEventListener('click', async function() {
        const enteredCode = Array.from(inputs).map(input => input.value).join('');
        const storedCode = localStorage.getItem('verificationCode');
        const email = localStorage.getItem('userEmail');

        try {
            // Show loading state
            verifyBtn.classList.add('loading');
            verifyBtn.disabled = true;

            if (enteredCode === storedCode) {
                try {
                    const email = localStorage.getItem('userEmail');
                    
                    // Create/update user document
                    const userDoc = doc(db, "users", email);
                    await setDoc(userDoc, {
                        email: email,
                        lastLogin: new Date().toISOString()
                    }, { merge: true }); // Use merge to preserve existing data

                    // Initialize cart if it doesn't exist
                    const cartRef = doc(db, `users/${email}/cart/data`);
                    const cartDoc = await getDoc(cartRef);
                    if (!cartDoc.exists()) {
                        await setDoc(cartRef, {
                            items: [],
                            updatedAt: new Date().toISOString()
                        });
                    }

                    // Initialize wishlist if it doesn't exist
                    const wishlistRef = doc(db, `users/${email}/wishlist/data`);
                    const wishlistDoc = await getDoc(wishlistRef);
                    if (!wishlistDoc.exists()) {
                        await setDoc(wishlistRef, {
                            items: [],
                            updatedAt: new Date().toISOString()
                        });
                    }

                    await handleSuccessfulLogin(email);
                } catch (error) {
                    console.error('Login error:', error);
                    alert('Login failed: ' + error.message);
                }
            } else {
                alert('Invalid verification code. Please try again.');
            }
        } finally {
            // Remove loading state
            verifyBtn.classList.remove('loading');
            verifyBtn.disabled = false;
        }
    });
});

async function handleSuccessfulLogin(email) {
    try {
        // Set login status
        localStorage.setItem('userEmail', email);
        localStorage.setItem('isLoggedIn', 'true');

        // Load cart data
        const cartRef = doc(db, `users/${email}/cart/data`);
        const cartDoc = await getDoc(cartRef);
        if (cartDoc.exists()) {
            localStorage.setItem('cartItems', JSON.stringify(cartDoc.data().items || []));
        } else {
            localStorage.setItem('cartItems', JSON.stringify([]));
        }

        // Load wishlist data
        const wishlistRef = doc(db, `users/${email}/wishlist/data`);
        const wishlistDoc = await getDoc(wishlistRef);
        if (wishlistDoc.exists()) {
            localStorage.setItem('wishlist', JSON.stringify(wishlistDoc.data().items || []));
        } else {
            localStorage.setItem('wishlist', JSON.stringify([]));
        }

        window.location.href = 'index.html';
    } catch (error) {
        console.error('Error loading user data:', error);
        alert('Error loading user data. Please try again.');
    }
} 