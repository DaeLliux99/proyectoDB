const express = require('express');
const router = express.Router();
const { isLoggedIn , isNotLoggedIn} = require('../lib/auth');

const passport = require('passport');

router.get('/login', isNotLoggedIn, (req, res) => {
    res.render('auth/login');
});

router.post('/login',isNotLoggedIn, passport.authenticate('local.login', {
    failureRedirect: '/login',
}), (req, res) => { 
    res.redirect('/perfil');
});

router.get('/perfil', isLoggedIn, (req, res) => {
    res.render('perfil');
});

router.get('/logout', isLoggedIn, (req, res) => {
    req.logOut();
    res.redirect('/login');
});

module.exports = router;