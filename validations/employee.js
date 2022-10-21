const Joi = require('joi');


function validateEmployee(employee) {
    const schema = Joi.object({
        name: Joi.string().min(3).max(50).required(),
        salary: Joi.number().required(),
        currency: Joi.string().required(),
        department: Joi.string().required(),
        on_contract: Joi.boolean().default(false),
        sub_department: Joi.string().required()
    });
    
    return schema.validate(employee);
}

function validateEmployeeId(id) {
    //validate params id
    const schema = Joi.number().required()
    return schema.validate(id);
}

exports.validate = validateEmployee;
exports.validateId = validateEmployeeId;
