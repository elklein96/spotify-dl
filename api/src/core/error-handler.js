module.exports = {
    logErrors,
    sendError
};

function logErrors(err, req, res, next) {
    console.error(err.stack);
    next(err);
}

function sendError(err, req, res, next) {
    return res.status(500).send('error', { err });
}
