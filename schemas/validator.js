const Ajv = require('ajv');
const ajv = Ajv({ allErrors:true, removeAdditional:'all' });
const meetingSchema = require('./updateUser');
const loginSchema = require('./login');
const signUpSchema = require('./signup');
const create_meeting = require('./create_meeting');




ajv.addSchema(meetingSchema, 'updateUser');
ajv.addSchema(loginSchema, 'login');
ajv.addSchema(signUpSchema, 'signup');
ajv.addSchema(create_meeting, 'create_meeting');




/**
 * Format error responses
 * @param  {Object} schemaErrors - array of json-schema errors, describing each validation failure
 * @return {String} formatted api response
 */
function errorResponse(schemaErrors) {
  let errors = schemaErrors.map((error) => {
    return {
      path: error.dataPath,
      message: error.message
    }
  })
  return {
    success: 0,
    errors: errors
  }
}

/**
 * Validates incoming request bodies against the given schema,
 * providing an error response when validation fails
 * @param  {String} schemaName - name of the schema to validate
 * @return {Object} response
 */
module.exports = (schemaName) => {
  return (req, res, next) => {
    let valid = ajv.validate(schemaName, req.body)
    if (!valid) {
      return res.json(errorResponse(ajv.errors))
    }
    next()
  }
}
