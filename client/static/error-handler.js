module.exports = {
    logError, sendError
}

function logError (err, req, res, next) {
    console.error(err.stack);
    next(err);
}

function sendError (err, req, res, next) {
    return res.status(500).send('error', { err });
}
