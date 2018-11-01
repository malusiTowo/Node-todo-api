// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unable to connect to Database');
    }
    console.log('Connected to database');
    
    // db.collection('Todos').find({
    //     _id: new ObjectID('5bdb83f7b8b1a2d24e2b844f'),
    //     completed:false
    // }).toArray()
    //     .then(docs => {
    //         console.log('Todos');
    //         console.log(JSON.stringify(docs, undefined, 2));
    //     })
    //     .catch(e => {
    //         console.log('Error:', e);
    //     });
    // db.collection('Todos').find().count()
    //     .then(count => {
    //         console.log(`Todos: ${count}`);
    //     })
    //     .catch(e => {
    //         console.log('Error:', e);
    //     });
     db.collection('Todos').find({
        text: {$in: ['Test todo', 'Learn Swift and Node.js']}
    }).toArray()
        .then(docs => {
            console.log('Todos');
            console.log(JSON.stringify(docs, undefined, 2));
        })
        .catch(e => {
            console.log('Error:', e);
        });
    // db.close();
})