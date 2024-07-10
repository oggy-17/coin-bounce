const Joi = require('joi');
const User = require('../models/user');
const bcrypt = require('bcryptjs');

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,25}$/;

const authController = {
    async register(req, res, next) {
        // validate user input
        const userRegisterSchema = Joi.object({
            username: Joi.string().min(5).max(30).required(),
            name: Joi.string().max(30).required(),
            email: Joi.string().email().required(),
            password: Joi.string().pattern(passwordPattern).required(),
            confirmPassword: Joi.ref('password')
        });

        const {error} = userRegisterSchema.validate(req.body);

        // if error in validation -> return error via middleware

        if (error){
            return next(error);
        }

        // if email or username is already registered -> return an error

        const {username, name, email, password} = req.body;

        try {
            const emailInUse = await User.exists({email});
            const usernameInUse = await User.exists({username});

            if (emailInUse){
                const error = {
                    status: 409,
                    message: 'Email already registered, please use another email!'
                }

                return next(error);
            }

            if (usernameInUse){
                const error = {
                    status: 409,
                    message: 'Username already registered, please use another username!'
                }

                return next (error);
            }
            
        } catch (error) {
            return next (error);
        }

        // password hash

        const hashedPassword = await bcrypt.hash(password, 10);

        // store user data in db

        const userToRegister = new User({
            name,
            email,
            username,
            password: hashedPassword
        });

        await userToRegister.save();

        // response end

        return res.status(201).json({user: userToRegister});

    },
    async login() {},
    
}

module.exports = authController;