// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unable to connect to Database');
    }
    console.log('Connected to database');
    // db.collection('Todos').insertOne({
    //     text:'Learn Swift and Node.js',
    //     completed:false,
    // }, (err, res) => {
    //     if (err) {
    //         return console.log('Unable to insert todo', err);
    //     }
    //     console.log(JSON.stringify(res.ops, undefined, 2));
    // });
    
    // db.collection('Users').insertOne({
    //     name:'Malusi',
    //     age:20,
    //     location:'South Africa'
    // }, (err, res) => {
    //     if (err) {
    //         return console.log('Unable to insert user', err);
    //     }
    //     console.log(res.ops[0]._id.getTimestamp());
    // });
    db.close();
})