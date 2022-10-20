//? Middleware para proteger rutas
// Pasos: 
//* 1- Revisar si existe un token
//* 2- Verificar si el token pertenece a un usuario valido
//* 3- Modificar el req y agregar req.user con la informacion desencriptada del token

//? estrategia: Diferentes maneras de hacer un login(Con facebook, google, JWT, Github...)

const JwtStrategy = require('passport-jwt').Strategy;       //? JwtStrategy: Passport maneja estrategias para las diferentes autenticaciones:
const ExtractJwt = require('passport-jwt').ExtractJwt;      //? ExtractJwt: Extrae los header de la peticion de Thunder Client Pej.

const { jwtSecret } = require('../config');
const { getUserById } = require('../users/users.controllers');

//? Exportando funcion anonima
module.exports = (passport) => {
    const options = {   //Lo siguiente trae el Authorization (TOKEN) del header de Thunder Client
        jwtFromRequest : ExtractJwt.fromAuthHeaderWithScheme('jwt'),
        secretOrKey: jwtSecret // Esta es la Variable de Entorno del .env JWT_SECRET (...y del config.js)
    }
    passport.use(
        new JwtStrategy(options, async(decoded, done) => {  // Dcouded es el TOKEN Decodificado
            //? done(error, decoded)
            try {
                const response = await getUserById(decoded.id)
                if(!response){
                    return done(null, false)
                }
                console.log('decoded JWT', decoded)
                return done(null, decoded)
            } catch (error) {
                return done(error, false)
            }
        })
    )
}