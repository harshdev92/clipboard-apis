const Joi = require('joi');


function validateEmployee(employee) {
    console.log(employee, 'employee')
    const schema = {
        name: Joi.string().min(3).required()
    };
    return Joi.validate(employee, schema);
}

exports.validate = validateEmployee;
