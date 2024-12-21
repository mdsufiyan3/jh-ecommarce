document.addEventListener('DOMContentLoaded', async function() {
    const loadingOverlay = document.querySelector('.loading-overlay');
    
    try {
        // Get email from localStorage
        const userEmail = localStorage.getItem('userEmail');
        
        if (!userEmail) {
            window.location.href = 'login.html';
            return;
        }

        // Display name (using email username part)
        const userName = userEmail.split('@')[0];
        document.getElementById('profileName').textContent = userName.toUpperCase();
        
        // Display email
        document.getElementById('profileEmail').textContent = userEmail;

        // Set avatar
        const hash = md5(userEmail.toLowerCase().trim());
        const gravatarUrl = `https://www.gravatar.com/avatar/${hash}?d=identicon`;
        
        // Wait for avatar to load
        await new Promise((resolve) => {
            const img = new Image();
            img.onload = resolve;
            img.src = gravatarUrl;
        });
        
        document.getElementById('profileAvatar').src = gravatarUrl;
        
    } catch (error) {
        console.error('Error loading profile:', error);
    } finally {
        // Hide loading overlay
        loadingOverlay.classList.add('hidden');
    }
});

// Logout function
window.logout = function() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    window.location.href = 'login.html';
} 