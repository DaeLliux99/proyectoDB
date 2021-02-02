const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const pool = require('../database');
const helpers = require('../lib/helpers');

passport.use('local.login', new LocalStrategy(
    async (username, password, done) => {
    const rows = await pool.query('SELECT * FROM vistaCuentas WHERE DNI = ?', [username]);
    if (rows.length > 0) {
        const user = rows[0];
        console.log(user.contraseña);
        helpers.matchPassword(password, user.contraseña, (res)=> { 
            if (res) {
                done(null, user);
            } else {
                done(null, false);
            }
        });
    } else {
        return done(null, false);
    }
}));

passport.serializeUser((user, done) => {
    //console.log('Entra a esta funcion serialize');
    //console.log(user.id);
    done(null, user.personal_id);
});

passport.deserializeUser(async (id, done)=>{
    //console.log('Entra a esta funcion DESERIALIZE');
    const rows = await pool.query('SELECT * FROM vistaCuentas WHERE personal_id = ?', [id]);
    //console.log(rows[0]);
    done(null, rows[0]);
});