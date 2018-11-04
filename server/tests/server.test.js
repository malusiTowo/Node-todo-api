const request = require('supertest');
const expect    = require('expect');
const { ObjectId } = require('mongodb');

var { app }  = require('../server');
var { Todo } = require('../Models/Todo');

const dummyTodos = [
    { _id: new ObjectId, text:'Dummy 1' },
    { _id: new ObjectId, text:'Dummy 2' },
    { _id: new ObjectId, text:'Dummy 3' }
];

beforeEach( (done) => {
    Todo.deleteMany({})
    .then( () => {
        return Todo.insertMany(dummyTodos);
    })
    .then( () => done());
});


describe('POST /Todos', () => {
    it('should create a new todo', (done) => {
        var text = 'new todo';

        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect( (res) => {
                expect(res.body.text).toBe(text);
            })
            .end( (err, res) => {
                if (err) {
                    return done(err);
                }
                Todo.find({text})
                    .then( todos => {
                        expect(todos.length).toBe(1);
                        expect(todos[0].text).toBe(text);
                        done();
                    })
                    .catch(e => done(e));
            });
    });

    it('should not create a todo with bad input', (done) => {

        request(app)
        .post('/todos')
        .send({})
        .expect(400)
        .end( (err, res) => {
            if (err) {
                return done(err);
            }
            Todo.find()
                .then(todos => {
                    expect(todos.length).toBe(3);
                    done();
                })
                .catch(e => done(e));
        })
    });
});

describe('GET /todos', () => {
    it('should get all todos in db', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect( (res) => {
                expect(res.body.todos.length).toBe(3);
            })
            .end(done);
    });
});

describe('GET /todos/todo/:id' , () => {
    it('should get the todo from db', (done) => {
        request(app)
            .get(`/todos/todo/${dummyTodos[0]._id.toHexString()}`)
            .expect(200)
            .expect( res => {
                expect(res.body.todo.text).toBe('Dummy 1');
            })
            .end(done);
    });

    it('should return invalid message and 404 when invalid todo id', (done) => {
        request(app)
            .get(`/todos/todo/${dummyTodos[0]._id.toHexString()} invalid`)
            .expect(404)
            .expect(res => {
                expect(res.body.Error).toBe('Invalid Todo Id');
            })
            .end(done);
    });

    it('should return 404 and  message if todo not found', (done) => {
        var inextentId = new ObjectId().toHexString();
        request(app)
        .get(`/todos/todo/${inextentId}`)
        .expect(404)
        .expect(res => {
            expect(res.body.Error).toBe('Todo Id not found');
        })
        .end(done);
    });
});