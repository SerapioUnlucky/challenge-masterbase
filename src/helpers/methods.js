const bcrypt = require('bcrypt');

const findOne = async (db, collection, query) => {

    const result = await db.collection(collection).findOne(query)
    return result;

}

const find = async (db, collection) => {

    const result = await db.collection(collection).find().toArray();
    return result;

}

const insertOne = async (db, collection, query) => {

    const result = await db.collection(collection).insertOne(query);
    return result;

}

const deleteOne = async (db, collection, query) => {

    const result = await db.collection(collection).deleteOne(query);
    return result;

}

const updateOne = async (db, collection, query, update) => {

    const result = await db.collection(collection).updateOne(query, update);
    return result;

}

const bcryptHash = async (password) => {

    const hash = await bcrypt.hash(password, 10);
    return hash;

}

const bcryptCompare = async (password, hash) => {

    const result = await bcrypt.compare(password, hash);
    return result;

}

module.exports = {
    findOne,
    find,
    insertOne,
    deleteOne,
    updateOne,
    bcryptHash,
    bcryptCompare
};