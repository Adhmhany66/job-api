const CustomAPIError = require('./customeError')
const UnauthenticatedError = require('./authenticationErroe')
const NotFoundError = require('./notFound')
const BadRequestError = require('./badRequest')

module.exports = {
    CustomAPIError,
    UnauthenticatedError,
    NotFoundError,
    BadRequestError
}