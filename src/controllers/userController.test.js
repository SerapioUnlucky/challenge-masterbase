const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const { register, login, users, user, deleted, update } = require('./userController');
const method = require('../helpers/methods');
const jwt = require('../services/token');
const { ObjectId } = require('mongodb');

jest.mock('../helpers/methods.js');
jest.mock('../services/token.js');

const app = express();

app.use(bodyParser.json());

app.post('/register', (req, res) => register(null, req, res));
app.post('/login', (req, res) => login(null, req, res));
app.get('/users', (req, res) => users(null, req, res));
app.get('/user/:id', (req, res) => user(null, req, res));
app.delete('/delete/:id', (req, res) => deleted(null, req, res));
app.put('/update/:id', (req, res) => update(null, req, res));

describe('POST /register', () => {

    it('debería registrar al usuario con éxito', async () => {

        const newUser = {
            email: 'test@example.com',
            password: 'password123',
            role: 'user',
            name: 'Test',
            lastname: 'User'
        };

        method.findOne.mockResolvedValue(null);
        method.bcryptHash.mockResolvedValue('hashedPassword');
        method.insertOne.mockResolvedValue({});

        const response = await request(app)
            .post('/register')
            .send(newUser);

        expect(response.status).toBe(201);
        expect(response.body).toEqual({
            message: 'Usuario registrado con éxito',
            user: expect.objectContaining({
                name: newUser.name
            })
        });

    });

    it('debería devolver un error si los parámetros son inválidos', async () => {

        const newUser = {
            email: 'invalid-email',
            password: 'short',
            role: 'user',
            name: 'Test',
            lastname: 'User'
        };

        const response = await request(app)
            .post('/register')
            .send(newUser);

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            message: expect.any(String)
        });

    });

    it('debería devolver un error si el usuario ya existe', async () => {

        const newUser = {
            email: 'existing@example.com',
            password: 'password123',
            role: 'user',
            name: 'Test',
            lastname: 'User'
        };

        method.findOne.mockResolvedValue(true);

        const response = await request(app)
            .post('/register')
            .send(newUser);

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            message: 'El usuario ya existe'
        });

    });

});

describe('POST /login', () => {

    it('debería autenticar al usuario con éxito', async () => {

        const user = {
            email: 'test@example.com',
            password: 'hashedPassword',
            name: 'Test',
            lastname: 'User'
        };

        const loginParams = {
            email: 'test@example.com',
            password: 'password123'
        };

        method.findOne.mockResolvedValue(user);
        method.bcryptCompare.mockResolvedValue(true);
        jwt.createToken.mockReturnValue('fake-jwt-token');

        const response = await request(app)
            .post('/login')
            .send(loginParams);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            message: 'Usuario autenticado con éxito',
            user: expect.objectContaining({
                name: user.name,
                email: user.email
            }),
            access_token: 'fake-jwt-token'
        });

    });

    it('debería devolver un error si los parámetros son inválidos', async () => {

        const loginParams = {
            email: 'invalid-email',
            password: 'short'
        };

        const response = await request(app)
            .post('/login')
            .send(loginParams);

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            message: expect.any(String)
        });
    });

    it('debería devolver un error si el usuario no existe', async () => {
        const loginParams = {
            email: 'nonexistent@example.com',
            password: 'password123'
        };

        method.findOne.mockResolvedValue(null);

        const response = await request(app)
            .post('/login')
            .send(loginParams);

        expect(response.status).toBe(404);
        expect(response.body).toEqual({
            message: 'El usuario no fue encontrado'
        });
    });

    it('debería devolver un error si la contraseña es incorrecta', async () => {

        const user = {
            email: 'test@example.com',
            password: 'hashedPassword',
            name: 'Test',
            lastname: 'User'
        };

        const loginParams = {
            email: 'test@example.com',
            password: 'wrongpassword'
        };

        method.findOne.mockResolvedValue(user);
        method.bcryptCompare.mockResolvedValue(false);

        const response = await request(app)
            .post('/login')
            .send(loginParams);

        expect(response.status).toBe(401);
        expect(response.body).toEqual({
            message: 'Contraseña incorrecta'
        });

    });

});

describe('GET /users', () => {

    it('debería obtener todos los usuarios con éxito', async () => {

        const usersArray = [
            { _id: '1', name: 'Test User 1' },
            { _id: '2', name: 'Test User 2' }
        ];

        method.find.mockResolvedValue(usersArray);

        const response = await request(app)
            .get('/users');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            message: 'Usuarios obtenidos con éxito',
            users: usersArray.map(user => ({ _id: user._id, name: user.name }))
        });

    });

    it('debería devolver un error si no se encuentran usuarios', async () => {

        method.find.mockResolvedValue(null);

        const response = await request(app)
            .get('/users');

        expect(response.status).toBe(404);
        expect(response.body).toEqual({
            message: 'No se encontraron usuarios'
        });

    });

});

describe('GET /user/:id', () => {

    it('debería obtener un usuario con éxito', async () => {

        const userId = new ObjectId();
        const userData = {
            _id: userId,
            name: 'Test User',
            lastname: 'User'
        };

        method.findOne.mockResolvedValue(userData);

        const response = await request(app)
            .get(`/user/${userId}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            message: 'Usuario obtenido con éxito',
            user: {
                _id: userId.toString(),
                name: userData.name
            }
        });

    });

    it('debería devolver un error si el usuario no existe', async () => {

        const userId = new ObjectId();

        method.findOne.mockResolvedValue(null);

        const response = await request(app)
            .get(`/user/${userId}`);

        expect(response.status).toBe(404);
        expect(response.body).toEqual({
            message: 'Usuario no encontrado'
        });

    });

});

describe('DELETE /delete/:id', () => {

    it('debería eliminar un usuario con éxito', async () => {

        const userId = new ObjectId();
        const userData = {
            _id: userId,
            name: 'Test User',
            lastname: 'User'
        };

        method.findOne.mockResolvedValue(userData);
        method.deleteOne.mockResolvedValue({ deletedCount: 1 });

        const response = await request(app)
            .delete(`/delete/${userId}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            message: 'Usuario eliminado con éxito',
            user: {
                _id: userId.toString(),
                name: userData.name
            }
        });

    });

    it('debería devolver un error si el usuario no existe', async () => {

        const userId = new ObjectId();

        method.findOne.mockResolvedValue(null);

        const response = await request(app)
            .delete(`/delete/${userId}`);

        expect(response.status).toBe(404);
        expect(response.body).toEqual({
            message: 'Usuario no encontrado'
        });

    });

});

describe('PUT /update/:id', () => {

    it('debería actualizar un usuario con éxito', async () => {

        const userId = new ObjectId();
        const userData = {
            _id: userId,
            name: 'Test User',
            lastname: 'User'
        };

        const updatedUserData = {
            name: 'Updated User',
            lastname: 'User'
        };

        method.findOne.mockResolvedValue(userData);
        method.updateOne.mockResolvedValue({ modifiedCount: 1 });

        const response = await request(app)
            .put(`/update/${userId}`)
            .send(updatedUserData);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            message: 'Usuario actualizado con éxito',
            user: {
                _id: userId.toString(),
                name: userData.name
            }
        });

    });

    it('debería devolver un error si el usuario no existe', async () => {

        const userId = new ObjectId();

        method.findOne.mockResolvedValue(null);

        const response = await request(app)
            .put(`/update/${userId}`)
            .send({ name: 'Updated User' });

        expect(response.status).toBe(404);
        expect(response.body).toEqual({
            message: 'Usuario no encontrado'
        });

    });

    it('debería devolver un error si los parámetros son inválidos', async () => {

        const userId = new ObjectId();

        const updatedUserData = {
            name: 'Up'
        };

        const response = await request(app)
            .put(`/update/${userId}`)
            .send(updatedUserData);

        expect(response.status).toBe(404);
        expect(response.body).toEqual({
            message: expect.any(String)
        });

    });

});
