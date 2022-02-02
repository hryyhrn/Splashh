const Palette = require('../models/palette')

//Middleware imports
const { getUser } = require('../middleware/authMiddleware');
const csrf = require('csurf');
const csrfProtection = csrf();

module.exports.csrfProtection = csrfProtection;
//HANDLERS
//GET CONTROLLERS
module.exports.myPage = (req, res) => {
    res.render('app/index', { csrfToken: req.csrfToken() });
}

module.exports.myPalettes = async (req, res) => {
    let user = await getUser(req.cookies.jwt);
    
    Palette.find({username: user})
    .then((result) => {
        res.send(result);
    })
    .catch((error) => {
        console.error('Error:', error);
        res.redirect('error-message');
    });
}

//POST CONTROLLERS
module.exports.savePalette = async (req, res) => {
    let data = req.body;
    let user = await getUser(req.cookies.jwt);
    data.username = user;
    const palette = new Palette(data);
    
    palette.save(data)
    .then((result) => {
        res.send();
    })
    .catch((error) => {
        if(error['code'] == '11000')
            res.send('Palette with the same name exists!');
        else if(error.message == 'empty')
            res.send('Palette name cannot be empty!');
        else {
            console.error('Error:', error);
            res.redirect('error-message');
        }
    });
}

//DELETE CONTROLLERS
module.exports.deletePalette = async (req, res) => {
    let palName = req.body.palName;
    let user = await getUser(req.cookies.jwt);

    Palette.findOneAndDelete({username: user, paletteName: palName})
    .then((result) => {
        res.send();
    })
    .catch((error) => {
        console.error('Error:', error);
        res.redirect('error-message');
    });
}