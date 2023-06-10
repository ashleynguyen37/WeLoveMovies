function notFound(req, res, next) {
    next({ status: 404, message: `The route ${req.path} does not exist!`});
}

module.exports = notFound;