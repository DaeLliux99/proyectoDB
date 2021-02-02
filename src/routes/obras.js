const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn , isMasterAcount, isMaster } = require('../lib/auth');

router.get('/agregar', isMasterAcount, isLoggedIn, (req, res) => {
    res.render('obras/agregar');
});

router.post('/agregar', isMasterAcount, isLoggedIn, async (req, res) => {
    console.log(req.body);
    const {nombreObra, direccionObra, tipoObra, 
        dniCliente, nombreCliente, apellidoCliente, telefonoCliente, direccionCliente,
        tipoContrato, fechaInicio, fechaFin, descripcion} = req.body;
    const nuevaObra = {
        nombre : nombreObra,
        direccion: direccionObra,
        tipo: tipoObra
    };

    const nuevoCliente = {
        DNI : dniCliente,
        nombres: nombreCliente,
        apellidos: apellidoCliente,
        telefono: telefonoCliente,
        direccion: direccionCliente
    };
    
    let rows = await pool.query('SELECT * FROM clientes WHERE dni = ?', [nuevoCliente.DNI]);
    let idObra = await pool.query('SELECT * FROM obras WHERE nombre = ?', [nuevaObra.nombre]);
    if (idObra.length > 0) {
        //jijijijiji
    } else {
        await pool.query('INSERT INTO obras set ?', [nuevaObra]);
        idObra = await pool.query('SELECT * FROM obras WHERE nombre = ?', [nuevaObra.nombre]);
    }
    if (rows.length > 0) {
        //jijijijiji
    } else {
        await pool.query('INSERT INTO clientes set ?', [nuevoCliente]);
        rows = await pool.query('SELECT * FROM clientes WHERE dni = ?', [nuevoCliente.DNI]);
    }

    const nuevoContrato = {
        cliente_id: rows[0].id,
        tipo : tipoContrato,
        obra_id: idObra[0].id
    };

    const nuevoPlanEj = {
        fechaInicio : fechaInicio,
        fechaFin: fechaFin,
        descripcion: descripcion,
        obra_id: idObra[0].id
    };
    await pool.query('INSERT INTO contratos set ?', [nuevoContrato]);
    await pool.query('INSERT INTO planesEjecucion set ?', [nuevoPlanEj]);
    res.redirect('/obras');
});

router.get('/', isLoggedIn, async (req, res) => {
    const booleano = isMaster(req);
    if (isMaster(req)) {
        const obras =  await pool.query('SELECT * FROM vistaobrasupervisor', (err, results) => {
            console.log(booleano);
            if (err) throw err; 
            res.render('obras/lista', {
                results: results,
                isMasterAcc: booleano
            });
        });
    } else {
        const obras =  await pool.query('SELECT * FROM obras_supervisor WHERE idSuper = ?', [req.user.personal_id], (err, results) => {
            if (err) throw err; 
            res.render('obras/lista', {
                results: results
            });
        });
    }
});

router.get('/borrar/:id', isLoggedIn, isMasterAcount, async (req, res) => {
    const {id} = req.params;
    await pool.query(' DELETE FROM obras WHERE ID = ?',[id]);
    //req.flash('success', 'Links removed successfully');
    res.redirect('/obras');
});

router.get('/pde/:id', isLoggedIn, async (req, res) => {
    const {id} = req.params;
    await pool.query('SELECT * FROM planesEjecucion WHERE obra_id = ?',[id], (err, results) => {
        if (err) throw err; 
        res.render('obras/pde', {results});
})});

router.get('/pde/actividades/:id/:obra_id',isLoggedIn, async (req, res) => {
    const id = req.params.id;
    const obra_id = req.params.obra_id;
    //const results = await pool.query('SELECT * FROM vistaActividades WHERE id_planE = ? and id_obra = ?',[id, obra_id]);
    await pool.query('SELECT * FROM vistaActividades WHERE id_obra = ? AND id_planE = ?', [obra_id,id], (err, results) => {
        if (err) throw err; 
            res.render('obras/actividades', {
                results: results,
                id_planEX: id,
                id_ObraX: obra_id,
                isMasterAcc: isMaster(req)
            });
        });
    });

router.get('/pde/actividades/agregarAct/:id/:obra_id',isLoggedIn, isMasterAcount, async (req, res) => {
    const id_planE = req.params.id;
    const id_obra = req.params.obra_id; await pool.query('SELECT * FROM vistasupervisores', 
    (err, results) => {
        if (err) throw err; 
        res.render('obras/agregarAct', {
            results: results,
            id_planE: id_planE,
            id_obra: id_obra
        });
})});

router.post('/pde/actividades/agregarAct',isLoggedIn, isMasterAcount, async (req, res) => {
    console.log(req.body);
    const {id_planE, id_obra, estadoA, fechaInicio, fechaFin, 
        id_super, descripcion, observaciones} = req.body;
    const nuevaActividad = {
        id_planE: id_planE,
        id_obra: id_obra,
        estado : estadoA,
        fechaInicio: fechaInicio,
        fechaFin: fechaFin,
        descripcion: descripcion,
        observaciones: observaciones,
        id_supervisor: id_super
    };
    await pool.query('INSERT INTO actividades set ?', [nuevaActividad]);
    res.redirect('/obras/pde/actividades/'+id_planE+'/'+id_obra);
});

router.get('/pde/actividades/borrar/:id/:id_planE/:id_obra',isLoggedIn,isMasterAcount, async (req, res) => {
    const id = req.params.id;
    const id_planE = req.params.id_planE;
    const id_obra = req.params.id_obra;
    await pool.query(' DELETE FROM actividades WHERE id = ? and id_planE = ? and id_obra = ?',[id, id_planE, id_obra]);
    //req.flash('success', 'Links removed successfully');
    res.redirect('/obras/pde/actividades/'+id_planE+'/'+id_obra);
});

router.get('/pde/actividades/agregarObreros/:id/:id_planE/:id_obra',isLoggedIn,isMasterAcount, async (req, res) => {
    await pool.query('SELECT * FROM vistaObrerosExclusiva', (err, results) => {
        if (err) throw err; 
        res.render('obras/agregarObreros', {
            results: results,
            id: req.params.id,
            id_planE: req.params.id_planE,
            id_obra: req.params.id_obra
        });
})});

router.post('/pde/actividades/agregarObreros',isLoggedIn, isMasterAcount, async (req, res) => {
    const {id, id_planE, id_obra, id_obrero, puesto} = req.body;
    const nuevoObreroEnAct = {
        id_actividad: id,
        id_planEX: id_planE,
        id_obraX: id_obra,
        id_obrero : id_obrero,
        puesto: puesto
    };
    await pool.query('INSERT INTO desempeñoobrero set ?', [nuevoObreroEnAct]);
    res.redirect('/obras/pde/actividades/agregarObreros/'+id+'/'+id_planE+'/'+id_obra);
});

router.get('/pde/actividades/obreros/:id/:id_planE/:id_obra',isLoggedIn, async (req, res) => {
    const booleano = isMaster(req);
    const id = req.params.id;
    const id_planE = req.params.id_planE;
    const id_obra = req.params.id_obra;
    await pool.query('SELECT * FROM vista_obreros_2 WHERE id_actividad = ? AND id_planEX = ? AND id_obraX = ?', [id, id_planE, id_obra], 
    (err, results) => {
        if (err) throw err; 
        res.render('obras/obrerosAct', {
            results: results,
            id: id,
            id_planE:id_planE,
            id_obra: id_obra,
            isMasterAcc: booleano
        });
})});

router.get('/pde/actividades/obreros/evaluacion/:personal_id/:id/:id_planE/:id_obra',isLoggedIn, async (req, res) => {
    const personal_id = req.params.personal_id;
    const id = req.params.id;
    const id_planE = req.params.id_planE;
    const id_obra = req.params.id_obra;
    obrero = await pool.query('SELECT * FROM vista_obreros_2 WHERE id_actividad = ? AND id_planEX = ? AND id_obraX = ? AND personal_id = ?', 
    [id, id_planE, id_obra, personal_id]);
    res.render('obras/evaluacion', {
        personal_id: personal_id,
        id_actividad: id,
        id_planE:id_planE,
        id_obra: id_obra,
        puesto: obrero[0].puesto
    });
});

router.post('/pde/actividades/obreros/evaluacion',isLoggedIn, async (req, res) => {
    const {id,id_actividad, id_planE, id_obra,descripcion, desempeño, puesto} = req.body;
    const nuevoObreroEnAct = {
        id_actividad: id_actividad,
        id_planEX: id_planE,
        id_obraX: id_obra,
        id_obrero : id,
        descripcion: descripcion,
        desempeño: desempeño,
        puesto: puesto
    };
    console.log(nuevoObreroEnAct.descripcion);
    await pool.query('UPDATE desempeñoobrero SET ? WHERE id_actividad = ? and id_planEX = ? and id_obraX = ? and id_obrero = ?', 
    [nuevoObreroEnAct, id_actividad,id_planE,id_obra,id]);
    res.redirect('/obras/pde/actividades/obreros/'+id_actividad+'/'+id_planE+'/'+id_obra);
});

module.exports = router;