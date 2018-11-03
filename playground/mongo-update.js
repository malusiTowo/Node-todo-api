// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unable to connect to Database');
    }
    console.log('Connected to database');
    
    db.collection('Users').findOneAndUpdate({
        _id: new ObjectID('5bda3a7bbd303c81c5db6cbb'),
    }, {
        $set: { name: 'Great Startup founder'},
        $inc: { age: -5 }
    }, {
        returnOriginal:false
    })
    .then(res => console.log(res))
    .catch(e => console.log(e));
    
   //db.close();
})