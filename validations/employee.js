const Joi = require('joi');


function validateEmployee(employee) {
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        // salary: Joi.number().required(),
        // currency: Joi.string().required(),
        // department: Joi.string().required(),
        // on_contract: Joi.boolean(),
        // sub_department: Joi.string().required()
    });
    
    return schema.validate(employee);
}

exports.validate = validateEmployee;
