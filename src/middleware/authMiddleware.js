const jwt = require('jsonwebtoken');
const Login = require('../models/login');

//secret macro
const secret = process.env.JWT_SECRET;
//max age variable (3 days)
const maxAge = 3 * 24 * 60 * 60;

const createWebToken = (id) => {
    return jwt.sign({ id }, secret, {
        expiresIn: maxAge
    });
}

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;

    if(token) {
        jwt.verify(token, secret, (err, decodedToken) => {
            if(err) {
                console.log(err);
                res.redirect('login');
            }
            else {
                next();
            }
        });
    }
    else {
        res.redirect('login');
    }
}

const getUser = async (jwtCookie) => {
    let userID = await jwt.verify(jwtCookie, secret, (err, decodedToken) => {
        return decodedToken;
    }).id;

    let username = await Login.findById(userID);
    return username.username;
}

module.exports = { maxAge, createWebToken, requireAuth, getUser };