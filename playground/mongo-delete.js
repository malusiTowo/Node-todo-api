// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unable to connect to Database');
    }
    console.log('Connected to database');
    
    // Delete Many
    // db.collection('Todos').deleteMany({
    //     text:'To be deleted'
    // })
    // .then(res => {
    //     console.log('Success:', res);
    // })
    // .catch(e => {
    //     console.log('Error:',e);
    // });
    // Delete One
    // db.collection('Todos').deleteOne({text:'Learn to walk'})
    // .then(res => {
    //     console.log('Success:', res);
    // })
    // .catch(e => {
    //     console.log('Error:', e);
    // });
    // FindOneAndDelete
    db.collection('Todos').findOneAndDelete({text:'Learn to walk'})
    .then(res => {
        console.log('Success:', res);
    })
    .catch(e => {
        console.log('Error:', e);
    });
    
   //db.close();
})