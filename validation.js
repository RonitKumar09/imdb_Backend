const joi = require("joi");

const registerValidation = (data) => {
  const registrationSchema = joi.object({
    name: joi.string().min(6).max(255).required(),
    email: joi.string().min(6).max(255).email().required(),
    password: joi.string().min(6).max(1024).required(),
  });
  return registrationSchema.validate(data);
};

const loginValidation = (data) => {
  const loginSchema = joi.object({
    email: joi.string().min(6).max(255).email().required(),
    password: joi.string().min(6).max(1024).required(),
  });
  return loginSchema.validate(data);
};

module.exports.loginValidation = loginValidation;
module.exports.registerValidation = registerValidation;
