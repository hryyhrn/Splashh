const Login = require('../models/login');

//Middleware imports
const { maxAge, createWebToken, getUser } = require('../middleware/authMiddleware');
const csrf = require('csurf');
const csrfProtection = csrf(); 

module.exports.csrfProtection = csrfProtection;

const handleErrors = function(err) {
    let errors = {username: '', password: ''};

    if(err.message === 'Invalid Username') {
        errors.username = 'Invalid Username';
    }

    if(err.message === 'Incorrect Password') {
        errors.password = 'Incorrect Password';
    }

    if(err.code == 11000) {
        errors.username = 'This Username has been taken';
    }

    if(err.message.includes('Login validation failed')) {
        Object.values(err.errors).forEach(error => {
            errors[error.properties.path] = error.properties.message;
        });
    }

    return errors;
}

//HANDLERS
//GET CONTROLLERS
module.exports.home_get = async (req, res) => {
    if(req.cookies.jwt) {
        let user = await getUser(req.cookies.jwt);

        if(user)
            res.render('app/home', { user: true });
        else
            res.render('app/home', { user: false });    
    }
    else {
        res.render('app/home', { user: false });
    }
}

module.exports.signup_get = async (req, res) => {
    if(req.cookies.jwt) {
        let user = await getUser(req.cookies.jwt);

        if(user)
            res.render('app/home', { user: true });
        else
            res.render('auth/signup', { csrfToken: req.csrfToken(), usernameErr: '', passwordErr: '' });   
    }
    else
        res.render('auth/signup', { csrfToken: req.csrfToken(), usernameErr: '', passwordErr: '' });
}

module.exports.login_get = async (req, res) => {
    if(req.cookies.jwt) {
        let user = await getUser(req.cookies.jwt);

        if(user)
            res.render('app/home', { user: true });
        else
            res.render('auth/login', { csrfToken: req.csrfToken(), usernameErr: '', passwordErr: '' });    
    }
    else
        res.render('auth/login', { csrfToken: req.csrfToken(), usernameErr: '', passwordErr: '' });
}

module.exports.signout_get = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('login');
}


//POST CONTROLLERS
module.exports.signup_post = (req, res) => {
    const data = { username: req.body.username, password: req.body.password };

    Login.create(data)
    .then((result) => {
        const token = createWebToken(result.id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000});
        res.redirect('my-page');
    })
    .catch((error) => {
        errMsg = handleErrors(error);
        res.render('auth/signup', { csrfToken: req.csrfToken(), usernameErr: errMsg.username, passwordErr: errMsg.password });
    });
}

module.exports.login_post = (req, res) => {
    const data = req.body;
    
    Login.login(data.username, data.password)
    .then((result) => {
        const token = createWebToken(result.id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000});
        res.redirect('my-page');
    })
    .catch((error) => {
        errMsg = handleErrors(error);
        res.render('auth/login', { csrfToken: req.csrfToken(), usernameErr: errMsg.username, passwordErr: errMsg.password });
    });
}