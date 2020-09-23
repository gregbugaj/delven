const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


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
        const data = { name: file, id: hash, children: [] };

        let isDir = fs.statSync(name).isDirectory()
        if (isDir) {
            data.children = getAllFilesJson(name);
        }

        if(isDir || file.endsWith(".js")){
            nodes.push(data);
        }
    });

    return nodes;
}


const locateFileByHash = function (dirPath, predicateHash) {
    const files = fs.readdirSync(dirPath);

    for (const key in files) {
        const name = path.join(dirPath, "/", files[key]);
        const hash = crypto.createHash('md5').update(name).digest('hex');
        if (hash == predicateHash) {
            return name;
        }

        if (fs.statSync(name).isDirectory()) {
            const target = locateFileByHash(name, predicateHash);
            if (target != null)
                return target;
        }
    }
    return null
}

app.get('/api/v1/samples', (req, res) => {
    const samples = getAllFilesJson('./sample-queries');
    res.send(JSON.stringify({ 'name': 'Root', 'id': '0000', children: samples }));
});


app.get('/api/v1/samples/:id', (req, res) => {
    const hash = req.params.id;
    const file = locateFileByHash('./sample-queries', hash);
    console.info(`File = ${file}`)
    if (file != null) {
        if (fs.statSync(file).isDirectory()) {
            res.send({ "staus": "ok", "code": "" })
        } else {
            const code = fs.readFileSync(file, "utf8")
            res.send({ "staus": "ok", "code": code })
        }
    } else {
        res.send({ "status": "errror", "msg": 'Unable to load hash : ' + hash })
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => { console.log(`Server listening on port ${PORT}!`); });



