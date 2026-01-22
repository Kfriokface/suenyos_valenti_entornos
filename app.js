const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const fs = require('fs');

const expressLayouts = require('express-ejs-layouts');
const app = express();

// ======================
// CONFIGURACIÓN
// ======================

app.set('view engine', 'ejs');
app.set('layout', 'layout');

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser());

app.use(session({
  secret: 'suenyosvalenti',
  resave: false,
  saveUninitialized: false,
  rolling: true
}));

app.use((req, res, next) => {
  res.locals.usuario = req.session.usuario || null;
  res.locals.tema = req.cookies.tema || 'claro';
  next();
});

app.use(expressLayouts);

// ======================
// RUTAS PÚBLICAS
// ======================

// INICIO
app.get('/', (req, res) => {
  res.render('index');
});

// REGISTRO (GET)
app.get('/registro', (req, res) => {
  res.render('registro', {
    errores: [],
    datos: {}
  });
});

// REGISTRO (POST)
app.post('/registro', (req, res) => {
  const { nombre, email, edad, ciudad, intereses } = req.body;
  let errores = [];

  if (!nombre || nombre.trim().length < 2) {
    errores.push('Tu nombre debe tener al menos dos caracteres.');
  }
  if (!email || !email.includes('@')) {
    errores.push('Email no válido');
  }
  if (!edad || edad < 18) {
    errores.push('Edad incorrecta, para soñar debes ser mayor de edad.');
  }

  if (errores.length > 0) {
    // console.log('OJITO!... REGISTRO CON ERRORES');
    return res.render('registro', {
      errores,
      datos: {
        nombre,
        email,
        edad,
        ciudad,
        intereses
      }
    });
  }

  const usuariosPath = './data/usuarios.json';
  let usuarios = [];

  if (fs.existsSync(usuariosPath)) {
    const contenido = fs.readFileSync(usuariosPath, 'utf-8');
    if (contenido) {
      usuarios = JSON.parse(contenido);
    }
  }

  // Chequeo email duplicado
  const emailExiste = usuarios.find(u => u.email === email);
  if (emailExiste) {
    errores.push('¡OPS!... Ya existe un usuario registrado con ese email.');
    // console.log('OJITO!... REGISTRO CON ERRORES');
    return res.render('registro', {
      errores,
      datos: {
        nombre,
        email,
        edad,
        ciudad,
        intereses
      }
    });
  }

  // Normalizamos intereses a array
  let interesesNormalizados = [];
  if (intereses) {
    interesesNormalizados = Array.isArray(intereses)
      ? intereses
      : [intereses];
  }

  const nuevoUsuario = {
    nombre,
    email,
    edad,
    ciudad,
    intereses: interesesNormalizados
  };

  usuarios.push(nuevoUsuario);
  fs.writeFileSync(usuariosPath, JSON.stringify(usuarios, null, 2));

  // Login automático tras registro
  req.session.usuario = nuevoUsuario;
  
  //console.log('REGISTRO CORRECTO, INICIO SESIÓN:', nuevoUsuario.email);
  
  req.session.save(() => {
    res.redirect('/perfil');
  });

});

// LOGIN (GET)
app.get('/login', (req, res) => {
  res.render('login', { error: '' });
});

// LOGIN (POST)
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const usuariosPath = './data/usuarios.json';
  let usuarios = [];

  if (password !== '1234') {
    return res.render('login', {
      error: 'Contraseña incorrecta'
    });
  }

  if (fs.existsSync(usuariosPath)) {
    const contenido = fs.readFileSync(usuariosPath, 'utf-8');
    if (contenido) {
      usuarios = JSON.parse(contenido);
    }
  }

  const usuario = usuarios.find(u => u.email === email);

  if (!usuario) {
    return res.render('login', {
      error: 'Usuario no encontrado'
    });
  }

  req.session.usuario = usuario;
  fs.appendFileSync('log.txt', `Login: ${email}\n`);

  res.redirect('/perfil');
});

// ======================
// ZONA PRIVADA
// ======================

// PERFIL
app.get('/perfil', (req, res) => {
  if (!req.session.usuario) {
    return res.redirect('/login');
  }

  res.render('perfil');
});

// SESIONES
app.get('/sesiones', (req, res) => {
  if (!req.session.usuario) {
    return res.redirect('/login');
  }

  const sesionesPath = './data/sesiones.json';
  let sesiones = [];

  if (fs.existsSync(sesionesPath)) {
    const contenido = fs.readFileSync(sesionesPath, 'utf-8');
    if (contenido) {
      sesiones = JSON.parse(contenido);
    }
  }

  if (!req.session.carrito) {
    req.session.carrito = [];
  }

  res.render('sesiones', {
    sesiones,
    carrito: req.session.carrito
  });
});

// ======================
// CARRITO
// ======================

// AGREGAR
app.post('/carrito/agregar', (req, res) => {
  const { sesion } = req.body;

  if (!req.session.carrito) {
    req.session.carrito = [];
  }

  req.session.carrito.push(sesion);
  fs.appendFileSync('log.txt', `Añadida sesión: ${sesion}\n`);

  res.redirect('/sesiones');
});

// VACIAR
app.post('/carrito/vaciar', (req, res) => {
  req.session.carrito = [];
  res.redirect('/sesiones');
});

// ======================
// UTILIDADES
// ======================

// LOGOUT
app.post('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

// TOGGLE TEMA
app.post('/toggle-tema', (req, res) => {
  const temaActual = req.cookies.tema || 'claro';
  const nuevoTema = temaActual === 'claro' ? 'oscuro' : 'claro';

  res.cookie('tema', nuevoTema);
  res.redirect(req.get('referer') || '/');
});

// ======================
// ARRANQUE
// ======================

app.listen(3000, () => {
  console.log('Servidor en http://localhost:3000');
});
