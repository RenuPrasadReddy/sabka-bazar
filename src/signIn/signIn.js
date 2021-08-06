import signIn from './signIn.hbs';

function displaySignInContent() {
    console.log('in signIn')

    // if regsiter contetnt is showing, hide it
    // let registerSection = document.querySelector('.register-content');
    // registerSection.innerHTML = null;

    let signInSection = document.querySelector('.main-content');
    signInSection.innerHTML = signIn();
    let email = document.getElementById('email');
    email.value='test@test.com';
    email.focus();
}

document.getElementById('signIn').addEventListener('click', displaySignInContent);