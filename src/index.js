const express = require('express');
const { MongoClient } = require('mongodb');
const logger = require('./helpers/pino');
const pino = require('./middlewares/pino');
const fs = require('fs');
const path = require('path');
const app = express();

const root = process.cwd();
const Path = path.join(root, 'src/config.json');
const config = JSON.parse(fs.readFileSync(Path, 'utf8'));
const { host, name, username, password, port } = config.database;

app.use(express.json());
app.use(pino);

const url = `mongodb://${username}:${password}@${host}/${name}?authSource=admin`;

const userRoutes = require('./routes/userRoute');

MongoClient.connect(url).then(client => {

    logger.info('Connected to MongoDB');

    const db = client.db(name);

    app.use('/api/v1/users', userRoutes(db));

    app.listen(port, () => {

        logger.info(`Server running on port ${port}`);

    });

}).catch(error => {

    logger.error(error);

});

process.on('SIGINT', () => {

    MongoClient.close();
    process.exit(0);

});

module.exports = app;
