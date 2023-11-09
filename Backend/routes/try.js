function signupWithGoogle() {
    // Send a request to your backend's API for Google signup
    fetch('http://localhost:3000/auth/google', {
        method: 'GET', // You can adjust the HTTP method as needed
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        console.log('hi')
        return response.json();
    })
    .then(data => {
        // console.log(data);
        if (data.set-cookie) {
            document.getElementById('tokenValue').textContent = data.token;
        } else {
            console.error('Token not found in the response.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

signupWithGoogle();