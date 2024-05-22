const User = require('../models/userModel');
const logger = require('../helpers/pino');
const method = require('../helpers/methods');
const jwt = require('../services/token');
const { registerSchema, loginSchema } = require('../helpers/validation');
const collection = 'users';
const { ObjectId } = require('mongodb');

const register = async (db, req, res) => {

    try {

        const params = req.body;

        logger.trace('Ingresando a la funcion de registro con los siguientes parametros: ');
        logger.trace({ params });

        logger.trace('Validando los parametros ingresados con el esquema de validacion');
        const { error } = registerSchema.validate(params);

        if (error) {

            logger.error('Error en la validacion de los parametros ingresados');
            return res.status(400).json({ message: error.message });

        }

        logger.trace(`Validacion exitosa, buscando el usuario con email ${params.email} en la base de datos`);
        const userExists = await method.findOne(db, collection, { email: params.email });

        if (userExists) {

            logger.error('El usuario ya existe en la base de datos');
            return res.status(400).json({ message: 'El usuario ya existe' });

        }

        let user = new User(params.email, params.password, params.role, params.name, params.lastname);

        logger.trace('Encriptando la contraseña del usuario y registrandolo en la base de datos');
        const pwd = await method.bcryptHash(user.password);
        user.password = pwd;

        await method.insertOne(db, collection, user);

        logger.info('El usuario se ha registrado con éxito');
        return res.status(201).json({
            message: 'Usuario registrado con éxito',
            user: {
                _id: user._id,
                name: user.name
            }
        });

    } catch (error) {

        logger.error(error.message);
        return res.status(500).json({
            message: error.message
        });

    }

}

const login = async (db, req, res) => {

    try {

        const params = req.body;

        logger.trace('Ingresando a la funcion login con los siguientes parametros: ');
        logger.trace({ params })

        logger.trace('Validando los parametros ingresados con el esquema de validacion');
        const { error } = loginSchema.validate(params);

        if (error) {

            logger.error('Error en la validacion de los parametros ingresados');
            return res.status(400).json({ message: error.message });

        }

        logger.trace(`Buscando al usuario ${params.email} en la base de datos`);
        const user = await method.findOne(db, collection, { email: params.email });

        if (!user) {

            logger.error(`El usuario con email ${params.email} no esta registrado en la base de datos`);
            return res.status(404).json({ message: 'El usuario no fue encontrado' });

        }

        logger.trace(`Usuario ${user.name} ${user.lastname} encontrado en la base de datos, comparando contrasenias`);
        const match = await method.bcryptCompare(params.password, user.password);

        if (!match) {

            logger.error('La contrasenia ingresada es incorrecta');
            return res.status(401).json({ message: 'Contraseña incorrecta' });

        }

        logger.trace('Contrasenia correcta, generando token de autenticacion');
        const token = jwt.createToken(user);

        logger.trace(`Autenticacion exitosa, retornando token de autenticacion para el usuario ${user.name} ${user.lastname}`);
        return res.status(200).json({
            message: 'Usuario autenticado con éxito',
            user: {
                name: user.name,
                ...user
            },
            access_token: token
        });

    } catch (error) {

        logger.error(error.message);
        return res.status(500).json({
            message: error.message
        });

    }

}

const users = async (db, _req, res) => {

    try {

        logger.trace('Ingresando a la funcion de obtener todos los usuarios');

        logger.trace('Buscando todos los usuarios en la base de datos');
        const users = await method.find(db, collection);

        if (!users) {

            logger.error('No se encontraron usuarios en la base de datos');
            return res.status(404).json({ message: 'No se encontraron usuarios' });

        }

        const usersData = users.map(user => ({ _id: user._id, name: user.name }));

        logger.trace('Usuarios obtenidos con exito');
        return res.status(200).json({
            message: 'Usuarios obtenidos con éxito',
            users: usersData
        });

    } catch (error) {

        logger.error(error.message);
        return res.status(500).json({
            message: error.message
        });

    }

}

const user = async (db, req, res) => {

    try {

        const id = new ObjectId(req.params.id);

        logger.trace(`Buscando al usuario de id ${id} en la base de datos`);
        const user = await method.findOne(db, collection, { _id: id });

        if (!user) {

            logger.error('El usuario no se encuentra registrado en la base de datos');
            return res.status(404).json({
                message: 'Usuario no encontrado'
            });

        }

        logger.trace(`Usuario obtenido con exito: ${user.name} ${user.lastname}`);
        return res.status(200).json({
            message: 'Usuario obtenido con éxito',
            user: {
                _id: user._id,
                name: user.name,
            }
        });

    } catch (error) {

        logger.error(error.message);
        return res.status(500).json({
            message: error.message
        });

    }

}

const deleted = async (db, req, res) => {

    try {

        const id = new ObjectId(req.params.id);

        logger.trace(`Buscando al usuario de id ${id} en la base de datos`);
        const user = await method.findOne(db, collection, { _id: id });

        if (!user) {

            logger.error('El usuario no se encuentra registrado en la base de datos');
            return res.status(404).json({
                message: 'Usuario no encontrado'
            });

        }

        logger.trace(`Eliminando al usuario ${user.name} ${user.lastname} de la base de datos`);
        await method.deleteOne(db, collection, { _id: id });

        logger.info(`Usuario ${user.name} ${user.lastname} eliminado con exito`);
        return res.status(200).json({
            message: 'Usuario eliminado con éxito',
            user: {
                _id: user._id,
                name: user.name
            }
        });

    } catch (error) {

        logger.error(error.message);
        return res.status(500).json({
            message: error.message
        });

    }

}

const update = async (db, req, res) => {

    try {

        const id = new ObjectId(req.params.id);
        const params = req.body;
        const keys = Object.keys(params);

        if (keys.length === 0) {

            logger.error('No hay campos para actualizar');
            return res.status(400).json({
                message: 'No hay campos para actualizar'
            });

        }

        logger.trace(`Buscando al usuario de id ${id} en la base de datos`);
        const user = await method.findOne(db, collection, { _id: id });

        if (!user) {

            logger.error('El usuario no se encuentra registrado en la base de datos');
            return res.status(404).json({
                message: 'Usuario no encontrado'
            });

        }

        logger.trace('Validando el email ingresado para verificar si ya esta registrado en la base de datos');
        if (params.email) {

            const userExists = await method.findOne(db, collection, { email: params.email });
            
            if (userExists) {

                logger.error('El email ya esta registrado en la base de datos');
                return res.status(400).json({ message: 'El email ya esta registrado' });

            }

        }

        params.updatedAt = new Date();

        logger.trace(`Actualizando los datos del usuario ${user.name} ${user.lastname}`);
        await method.updateOne(db, collection, { _id: id }, { $set: params });

        logger.info(`Usuario ${user.name} ${user.lastname} actualizado con exito`);
        return res.status(200).json({
            message: 'Usuario actualizado con éxito',
            user: {
                _id: user._id,
                name: user.name
            }
        });

    } catch (error) {

        logger.error(error.message);
        return res.status(500).json({
            message: error.message
        });

    }

}

module.exports = {
    register,
    login,
    users,
    user,
    deleted,
    update
};
