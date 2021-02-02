const express = require('express');
const morgan = require('morgan');
const exhbs = require('express-handlebars');
const path = require('path');

const session = require('express-session');
const MySQLStore = require('express-mysql-session');
const passport = require('passport');
const { database } = require ('./keys');

// Inicializaciones
const app = express();
require('./lib/passport');

//Configuraciones
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname,'views'));
app.engine('.hbs', exhbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}));
app.set('view engine', '.hbs');

//Middlewares
app.use(session({
    secret: 'uwu',
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database)
}));

app.use(morgan('dev'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());
//Variables Goblales
app.use((req, res , next) => {
    app.locals.user = req.user;
    next();
});

//Rutas
app.use(require('./routes/index'));
app.use(require('./routes/autenticacion'));
app.use('/obras',require('./routes/obras'));
app.use('/supervisores',require('./routes/supervisores'));
app.use('/obreros',require('./routes/obreros'));

//Archivos Publicos
app.use(express.static(path.join(__dirname, 'public')));

//Empezando en servidor
app.listen(app.get('port'), () => {
    console.log('Servidor en el puerto', app.get('port'));
});