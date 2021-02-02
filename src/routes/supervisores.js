const express = require('express');
const router = express.Router();
const pool = require('../database');
const helpers = require('../lib/helpers');
const { isLoggedIn , isMasterAcount} = require('../lib/auth');

router.get('/agregarSupervisor', isMasterAcount, isLoggedIn, (req, res) => {
    res.render('supervisores/agregarSupervisor');
});

router.post('/agregarSupervisor',isMasterAcount,isLoggedIn, async (req, res) => {
    const {dniE, nombreE, apellidoE, 
        telefonoE, direccionE, contraseñaE} = req.body;
    const nuevoPersonal = {
        dni: dniE,
        nombres : nombreE,
        apellidos : apellidoE,
        telefono : telefonoE,
        direccion: direccionE,
        tipo: 'supervisor'
    };
    let rows = await pool.query('SELECT * FROM personal WHERE dni = ?', [nuevoPersonal.dni]);   
    if (rows.length > 0) {
        //jijijijiji
    } else {
        await pool.query('INSERT INTO personal set ?', [nuevoPersonal]);
        rows = await pool.query('SELECT * FROM personal WHERE dni = ?', [nuevoPersonal.dni]);
        const nuevoSuperV = {
            personal_id: rows[0].id,
            contraseña: contraseñaE
        };
        nuevoSuperV.contraseña = await helpers.encryptPassword(contraseñaE);
        await pool.query('INSERT INTO supervisores set ?', [nuevoSuperV]);
    }
    res.redirect('/supervisores');
});

router.get('/', isLoggedIn, isMasterAcount, async (req, res) => {
    const supervisores =  await pool.query('SELECT * FROM vistaSupervisores WHERE id <> ?', [req.user.personal_id], (err, results) => {
        if (err) throw err; 
        res.render('supervisores/supervisores', {results});
    });
});

router.get('/borrar/:id',isLoggedIn,isMasterAcount, async (req, res) => {
    const {id} = req.params;
    await pool.query(' DELETE FROM personal WHERE ID = ?',[id]);
    //req.flash('success', 'Links removed successfully');
    res.redirect('/supervisores');
});


module.exports = router;