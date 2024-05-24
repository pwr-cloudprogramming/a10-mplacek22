var poolData = {
	UserPoolId : '{{USER_POOL_ID}}',
	ClientId : '{{USER_POOL_CLIENT_ID}}'
};
var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);


function register() {
    var username = document.getElementById('registration_username').value;
    var email = document.getElementById('registration_email').value;
    var password = document.getElementById('registration_password').value;

    var attributeList = [];

    var attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute({
        Name: 'email',
        Value: email
    });

    attributeList.push(attributeEmail);

    userPool.signUp(username, password, attributeList, null, function(err, result) {
        if (err) {
            alert(err.message || JSON.stringify(err));
            return;
        }
        var cognitoUser = result.user;
        console.log('user name is ' + cognitoUser.getUsername());
        alert('Registration successful. Please check your email for verification link.');
    });
    
    hideForms();
    showForm('code');
}

function sendCode() {
    var username = document.getElementById('code_username').value;
    var code = document.getElementById('code_code').value;
    
    var cognitoUser = new AmazonCognitoIdentity.CognitoUser({
        Username: username,
        Pool: userPool
    });
    
    cognitoUser.confirmRegistration(code, true, function (err, result) {
    	if (err) {
    		alert(err.message || JSON.stringify(err));
    		return;
    	}
    	console.log('call result: ' + result);
    	hideForms();
    	alert('Confirmation successful.')
    });
}

function signIn() {
    var username = document.getElementById('sign_in_username').value;
    var password = document.getElementById('sign_in_password').value;

    var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
        Username: username,
        Password: password,
    });

    var cognitoUser = new AmazonCognitoIdentity.CognitoUser({
        Username: username,
        Pool: userPool
    });

    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function(result) {
            console.log('Access token: ' + result.getAccessToken().getJwtToken());
            alert('Sign-in successful!');
            
            localStorage.setItem('accessToken', result.getAccessToken().getJwtToken());
            localStorage.setItem('refreshToken', result.getRefreshToken().getToken());
            
            startSessionCheck();
            
            hideForms();
            showNavOptions('logout');
        },

        onFailure: function(err) {
            alert(err.message || JSON.stringify(err));
        },
    });
}


function logout() {
    var user = userPool.getCurrentUser();
    if(user) {
        leaveGame();
        if (get_board_interval !== null) {
            clearInterval(get_board_interval);
        }
        user.signOut();
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        
        alert('Logout successful!');
        // TODO
        
        showNavOptions('login-register');
        document.getElementById('game').style.display = 'none';
        showJoinCreateButtons();
    }
}

function refreshSession() {
    const cognitoUser = userPool.getCurrentUser();
    if (cognitoUser) {
        cognitoUser.getSession(function (err, session) {
            if (err) {
                console.log('Error getting session:', err);
                return;
            }
            
            if (session.isValid()) {
                console.log('Session is still valid');
                return;
            }
            
            const refreshToken = session.getRefreshToken();
            cognitoUser.refreshSession(refreshToken, (err, newSession) => {
                if (err) {
                    console.log('Error refreshing session:', err);
                    return;
                }
                const newAccessToken = newSession.getAccessToken().getJwtToken();
                localStorage.setItem('accessToken', newAccessToken);
                console.log('Successfully refreshed token');
            });
        });
    } else {
        console.log('No current user found');
    }
}

function startSessionCheck() {
    setInterval(() => {
        refreshSession();
    }, 5 * 60 * 1000); // Check every 5 minutes
}


function showNavOptions(options) {
    if (options === 'login-register'){
        document.getElementById('nav-login-button').style.display = 'block';
        document.getElementById('nav-register-button').style.display = 'block';
        document.getElementById('nav-logout-button').style.display = 'none';
    } else {
        document.getElementById('nav-login-button').style.display = 'none';
        document.getElementById('nav-register-button').style.display = 'none';
        document.getElementById('nav-logout-button').style.display = 'block';
    }
}

function hideForms() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('register-form').style.display = 'none';
    document.getElementById('code-form').style.display = 'none';
}

function showForm(form) {
    hideForms();
    if (form === 'login') {
        document.getElementById('login-form').style.display = 'block';
    } else if (form === 'register') {
        document.getElementById('register-form').style.display = 'block';
    } else if (form === 'code') {
        document.getElementById('code-form').style.display = 'block';
    }
}

function isUserLoggedIn() {
    return userPool.getCurrentUser() !== null;
}

function getUsername() {
    return userPool.getCurrentUser().username;
}

function showJoinCreateButtons(){
    document.getElementById('create-join-buttons').style.display = 'block';
}

function hideJoinCreateButtons(){
    document.getElementById('create-join-buttons').style.display = 'none';
}

// function getOrCreateUserPool(){
//     if (localStorage.getItem("userPool") === null) {
        
//     }
// }

if (isUserLoggedIn()){
    showNavOptions('logout');
    startSessionCheck();
} else {
    showNavOptions('login-register');
}