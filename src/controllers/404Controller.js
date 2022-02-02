//HANDLERS
module.exports.errorMessage = (req, res) => {
    const errorMessage = 'Oops! Something went wrong!';
    res.status(404).render('404', { errorMessage });
}

module.exports.defaultRoute = async (req, res) => {
    res.redirect('home');
}