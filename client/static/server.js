const express = require('express');
const http = require('http');
const path = require('path');

const errorHandler = require('./error-handler');

let app = express();

app.server = http.createServer(app);

app.use(errorHandler.logError);
app.use(errorHandler.sendError);

app.use(express.static(path.join(__dirname, '/../dist')));
app.get('*', (req, res, next) => {
    res.sendFile(path.join(__dirname, '/../dist/index.html'));
});

app.server.listen(process.env.PORT || 3002);
console.log(`Express server listening on port ${app.server.address().port}`);

module.exports = app;
