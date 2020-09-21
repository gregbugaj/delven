const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const app = express();
app.use(bodyParser.json());

// `next` is needed here to mark this as an error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    console.error((new Date()).toLocaleString(), err);
    if (err.response) {
        res.status(err.response.status).send(err.response.statusText);
        return;
    }
    // eslint-disable-next-line no-console
    res.status(500).send('Something went wrong');
});

// Use middleware to set the default Content-Type
app.use(function (req, res, next) {
    res.header('Content-Type', 'application/json');
    next();
});

const getAllFilesJson = function (dirPath) {
    const files = fs.readdirSync(dirPath);
    const nodes = [];

    files.forEach(function (file) {
        const name = path.join(dirPath, "/", file);
        const hash = crypto.createHash('md5').update(name).digest('hex');
        const data = {
            name: file,
            id: hash,
            children: []
        };

        if (fs.statSync(name).isDirectory()) {
            data.children = getAllFilesJson(name);
        }
        nodes.push(data);
    });

    return nodes;
}

app.get('/api/v1/samples', (req, res) => {
    const samples = getAllFilesJson('sample-queries')
    console.info(samples)
    res.send(JSON.stringify({ samples }));
});

app.get('/api/v1/samples/:id', (req, res) => {
    const id = req.params.id;
    res.send('Hash :' + id)
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => { console.log(`Server listening on port ${PORT}!`); });



