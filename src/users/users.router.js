const router = require('express').Router()
const adminValidate = require('../middlewares/role.middleware')
const userServices = require('./users.services')


// Pasos para proteger las rutas con passport:
// 1. Con estas 2 lineas: Importar passport
// 2. Importar el middleware directamente con el require() y ejecutarlo () pasandole (passport) 
// 3. Protejo la ruta con el middleware que es el que pasa EN MEDIO de la  RUTA y el SERVICIO
//      Por Ejemplo:  router.get(     Ruta  ,  Middleware  ,  Service     )
//      router.get(  '/' , passport.authenticate('jwt', {session: false}, userServices.getAllUsers)
const passport = require('passport')
require('../middlewares/auth.middleware')(passport)


//? rutas raiz

router.get('/', userServices.getAllUsers)

//TODO el registerUser ira en la ruta /auth/register

//! router.route('/').get( userServices.getAllUsers)

//? rutas dinamicas por ID /users/:id

//! router.get('/:id')
//! router.patch('/:id')
//! router.put('/:id')
//! router.delete('/:id')

//? Ruta de informacion propia del usuario loggeado
router.route('/me')
    .get(
        passport.authenticate('jwt', {session: false}),
        userServices.getMyUser)
    .patch(
        passport.authenticate('jwt', {session: false}),
        userServices.patchMyUser
    )
    .delete(
        passport.authenticate('jwt', {session: false}),
        userServices.deleteMyUser
    )

//? /api/v1/users/:id
router.route('/:id')
    .get(userServices.getUserById)
    .patch(
        passport.authenticate('jwt', {session: false}),
        adminValidate,
        userServices.patchUser
    )
    .delete(
        passport.authenticate('jwt', {session: false}),
        adminValidate,
        userServices.deleteUser
    )
    

module.exports = router