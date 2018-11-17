const { ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const { Todo } = require('./../../Models/Todo');
const { User } = require('./../../Models/User');

let userOneId = new ObjectId();
let userTwoId = new ObjectId();

const dummyTodos = [
    { _id: new ObjectId(), text: 'Dummy 1', completed: true, completedAt: 333, _owner: userOneId },
    { _id: new ObjectId(), text: 'Dummy 2', _owner: userTwoId },
    { _id: new ObjectId(), text: 'Dummy 3', _owner: userOneId }
];

const dummyUsers = [
    {_id: userOneId, email:'malusitowo@gmail.com', password:'userOnePass', tokens:[{
      'access':'auth',
      'token': jwt.sign({_id:userOneId, access: 'auth'}, process.env.JWT_SECRET).toString(),
    }]},
    {_id: userTwoId, email:'aventitowo@gmail.com', password:'userTwoPass',tokens:[{
      'access':'auth',
        'token': jwt.sign({ _id: userTwoId, access: 'auth' }, process.env.JWT_SECRET).toString(),
    }]},
];

const populateTodos = (done) => {
    Todo.deleteMany({})
        .then(() => {
            return Todo.insertMany(dummyTodos);
        })
        .then(() => done());
};

const populateUsers = (done) => {
    User.deleteMany({})
        .then(() => {
            var user1 = new User(dummyUsers[0]).save();
            var user2 = new User(dummyUsers[1]).save();

            return Promise.all([user1, user2]);
        })
        .then(() => done());
};

module.exports = { dummyTodos, populateTodos, dummyUsers, populateUsers};