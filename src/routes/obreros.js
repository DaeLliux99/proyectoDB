const express = require('express');
const router = express.Router();
const { isLoggedIn , isMasterAcount } = require('../lib/auth');

const pool = require('../database');

router.get('/agregar',isLoggedIn, isMasterAcount, (req, res) => {
    res.render('obreros/agregarObrero');
});

router.post('/agregar',isLoggedIn, isMasterAcount, async (req, res) => {
    const {dniE, nombreE, apellidoE, telefonoE, direccionE, AdT} = req.body;
    const nuevoPersonal = {
        dni: dniE,
        nombres : nombreE,
        apellidos : apellidoE,
        telefono : telefonoE,
        direccion: direccionE,
        tipo: 'obrero'
    };
    let rows = await pool.query('SELECT * FROM personal WHERE dni = ?', [nuevoPersonal.dni]);   
    if (rows.length > 0) {
        //jijijijiji
    } else {
        await pool.query('INSERT INTO personal set ?', [nuevoPersonal]);
        rows = await pool.query('SELECT * FROM personal WHERE dni = ?', [nuevoPersonal.dni]);
        const nuevoObrero = {
            personal_id: rows[0].id,
            especialidad: AdT
        };
        await pool.query('INSERT INTO obreros set ?', [nuevoObrero]);
    }
    res.redirect('/obreros');
});

router.get('/', isLoggedIn,  async (req, res) => {
    const obreros =  await pool.query('SELECT * FROM vistaObreros', (err, results) => {
        if (err) throw err; 
        res.render('obreros/obreros', {
            results: results,
            isMasterAcc: function () {
                if (req.user.personal_id === 17) {
                    return true;
                } else {
                    return false;
                }
            }
        });
    });
});

router.get('/borrar/:id',isLoggedIn,isMasterAcount, async (req, res) => {
    const {id} = req.params;
    await pool.query(' DELETE FROM personal WHERE ID = ?',[id]);
    //req.flash('success', 'Links removed successfully');
    res.redirect('/obreros');
});

module.exports = router;