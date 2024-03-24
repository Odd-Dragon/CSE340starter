// Function to update links based on login status
function updateLinks(isLoggedIn) {
    if (isLoggedIn) {
        document.getElementById('welcomeLink').style.display = 'inline';
        document.getElementById('logoutLink').style.display = 'inline';
        document.getElementById('myAccountLink').style.display = 'none';
    } else {
        document.getElementById('welcomeLink').style.display = 'none';
        document.getElementById('logoutLink').style.display = 'none';
        document.getElementById('myAccountLink').style.display = 'inline';
    }
}

// Function to check if JWT token is valid
function checkJWTToken() {
    const jwtToken = localStorage.getItem('jwt'); // Retrieve JWT token from localStorage
    if (jwtToken) {
        // Decode JWT token (assuming you have a function to decode it)
        const decodedToken = decodeJWTToken(jwtToken); // Replace decodeJWTToken with your actual decoding function
        if (decodedToken && decodedToken.exp * 1000 > Date.now()) {
            // Token is valid and not expired
            return true;
        } else {
            // Token is expired or invalid
            return false;
        }
    } else {
        // JWT token not found
        return false;
    }
}

// Simulate login status by checking JWT token validity
const isLoggedIn = checkJWTToken();

// Call updateLinks function when the page loads
window.onload = function() {
    updateLinks(isLoggedIn);
};