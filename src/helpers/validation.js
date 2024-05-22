const Joi = require('joi');

const registerSchema = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .trim()
        .messages({
            'string.base': 'El email debe ser de tipo texto',
            'string.empty': 'El email no puede estar vacio',
            'string.email': 'El email debe ser un email valido',
            'any.required': 'El email es requerido',
            'string.trim': 'El email no puede contener espacios'
        }),
    password: Joi.string()
        .required()
        .trim()
        .messages({
            'string.base': 'La contraseña debe ser de tipo texto',
            'string.empty': 'La contraseña no puede estar vacia',
            'any.required': 'La contraseña es requerida',
            'string.trim': 'La contraseña no puede contener espacios'
        }),
    role: Joi.string()
        .required()
        .valid('admin', 'user')
        .messages({
            'string.base': 'El rol debe ser de tipo texto',
            'string.empty': 'El rol no puede estar vacio',
            'any.required': 'El rol es requerido',
            'any.only': 'El rol debe ser admin o user'
        }),
    name: Joi.string()
        .required()
        .trim()
        .messages({
            'string.base': 'El nombre debe ser de tipo texto',
            'string.empty': 'El nombre no puede estar vacio',
            'any.required': 'El nombre es requerido',
            'string.trim': 'El nombre no puede contener espacios'
        }),
    lastname: Joi.string()
        .required()
        .trim()
        .messages({
            'string.base': 'El apellido debe ser de tipo texto',
            'string.empty': 'El apellido no puede estar vacio',
            'any.required': 'El apellido es requerido',
            'string.trim': 'El apellido no puede contener espacios'
        })
});

const loginSchema = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .trim()
        .messages({
            'string.base': 'El email debe ser de tipo texto',
            'string.empty': 'El email no puede estar vacio',
            'string.email': 'El email debe ser un email valido',
            'any.required': 'El email es requerido',
            'string.trim': 'El email no puede contener espacios'
        }),
    password: Joi.string()
        .required()
        .trim()
        .messages({
            'string.base': 'La contraseña debe ser de tipo texto',
            'string.empty': 'La contraseña no puede estar vacia',
            'any.required': 'La contraseña es requerida',
            'string.trim': 'La contraseña no puede contener espacios'
        })
});

module.exports = {

    registerSchema,
    loginSchema

}
