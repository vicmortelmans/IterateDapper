function handleClientLoad() {
    gapi.client.setApiKey('AIzaSyDN-6t7i93pOzKrcL56jsEi4kCsNezipq0');
    gapi.client.load('fusiontables', 'v1');
}

function auth() {
    var config = {
        'client_id': '115096030889.apps.googleusercontent.com',
        'scope': 'https://www.googleapis.com/auth/fusiontables'
    };
    gapi.auth.authorize(config, function() {
        console.log('login complete');
        console.log(gapi.auth.getToken());
    });
}
