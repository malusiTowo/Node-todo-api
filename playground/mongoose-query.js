const { ObjectId } = require('mongodb');

const { mongoose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/Models/Todo');

var id = '5bde21198e74414a9c3ab62a';

if (!ObjectId.isValid(id)) {
    console.log('Invalid Id');
}

Todo.find({_id:id})
    .then(todos => console.log(todos));

Todo.findOne({_id:id})
    .then(todo => console.log(todo));

Todo.findById(id)
    .then(todo => console.log(todo));