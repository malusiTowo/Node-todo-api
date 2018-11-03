const request = require('supertest');
const expect    = require('expect');

var { app }  = require('../server');
var { Todo } = require('../Models/Todo');

const dummyTodos = [
    { text:'Dummy 1' },
    { text:'Dummy 2' },
    { text:'Dummy 3' }
];

beforeEach( (done) => {
    Todo.deleteMany({}).then( () => {
        return Todo.insertMany(dummyTodos);
    }).then( () => done());
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