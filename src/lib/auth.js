const pool = require('../database');

module.exports = {
    isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        return res.redirect('/login');
    },

    isNotLoggedIn(req, res, next) {
        if (!req.isAuthenticated()) {
            return next();
        }
        return res.redirect('/perfil');
    },

    isMasterAcount(req, res, next) {
        console.log(req.user.personal_id);
        if (req.user.personal_id === 17) {
            return next();
        }
        return res.redirect('/perfil');
    },
    isNotMasterAcount(req, res, next) {
        if (req.user.personal_id !== 17) {
            return next();
        }
        return res.redirect('/perfil');
    },
    isMaster (req) {
        if (req.user.personal_id === 17) {
            return true
        } else {
            return false;
        }
    }
}