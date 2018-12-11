$("#login-button").on('click', (e) => {
    e.preventDefault();
    const username = $("#username").val();
    const password = $("#password").val();
    console.log(`User name: ${username}, password: ${password}`);
    //TODO: Add authentication python script here

    //Go to home page after authentication
    window.location = './index.html';
})
