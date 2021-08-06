import register from './register.hbs';

function displayRegisterContent(e) {
    // console.log(e);

    // if signin contetnt is showing, hide it
    // let signInSection = document.querySelector('.signIn-content');
    // signInSection.innerHTML = null;


    let registerSection = document.querySelector('.main-content');
    registerSection.innerHTML = register();
    document.getElementById("firstName").focus();
}

document.getElementById('register').addEventListener('click', displayRegisterContent)