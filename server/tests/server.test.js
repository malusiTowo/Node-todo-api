const request = require('supertest');
const expect    = require('expect');
const { ObjectId } = require('mongodb');

var { app }  = require('./../server');
var { Todo } = require('./../Models/Todo');
var { User } = require('./../Models/User');
var { dummyTodos, populateTodos, dummyUsers, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);


describe('POST /Todos', () => {
    it('should create a new todo', (done) => {
        var text = 'new todo';

        request(app)
            .post('/todos')
            .set('x-auth', dummyUsers[0].tokens[0].token)
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
        .set('x-auth', dummyUsers[0].tokens[0].token)
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
            .set('x-auth', dummyUsers[0].tokens[0].token)
            .expect(200)
            .expect( (res) => {
                expect(res.body.todos.length).toBe(2);
            })
            .end(done);
    });
});

describe('GET /todos/todo/:id' , () => {
    it('should get the todo from db', (done) => {
        request(app)
            .get(`/todos/todo/${dummyTodos[0]._id.toHexString()}`)
            .set('x-auth', dummyUsers[0].tokens[0].token)
            .expect(200)
            .expect( res => {
                expect(res.body.todo.text).toBe(dummyTodos[0].text);
            })
            .end(done);
    });
   
    it('should only get todo created by authenticated user ', (done) => {
        request(app)
            .get(`/todos/todo/${dummyTodos[1]._id.toHexString()}`)
            .set('x-auth', dummyUsers[0].tokens[0].token)
            .expect(404)
            .end(done);
    });

    it('should return invalid message and 404 when invalid todo id', (done) => {
        request(app)
            .get(`/todos/todo/${dummyTodos[0]._id.toHexString()} invalid`)
            .set('x-auth', dummyUsers[0].tokens[0].token)
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
        .set('x-auth', dummyUsers[0].tokens[0].token)
        .expect(404)
        .expect(res => {
            expect(res.body.Error).toBe('Todo Id not found');
        })
        .end(done);
    });
});

describe('DELETE /todos/todo/:id', () => {
    it('should remove a todo', (done) => {
        var id = dummyTodos[0]._id.toHexString();
        request(app)
            .delete(`/todos/todo/${id}`)
            .set('x-auth', dummyUsers[0].tokens[0].token)
            .expect(200)
            .expect(res => {
                expect(res.body.todo.text).toBe(dummyTodos[0].text);
            })
            .end( (err, res) => {
                if(err) {
                    return done(err);
                }
               Todo.findById(id)
                    .then(todo => {
                        expect(todo).toBeNull();
                        done();
                    })
                    .catch(e => done(e));

            });
    });
    
    it('should not remove todo by different user', (done) => {
        var id = dummyTodos[0]._id.toHexString();
        request(app)
            .delete(`/todos/todo/${id}`)
            .set('x-auth', dummyUsers[1].tokens[0].token)
            .expect(404)
            .end( (err, res) => {
                if(err) {
                    return done(err);
                }
               Todo.findById(id)
                    .then(todo => {
                        expect(todo).not.toBeNull();
                        done();
                    })
                    .catch(e => done(e));

            });
    });

    it('should return 404 and message when todo Id not found', (done) => {
        var id = new ObjectId().toHexString();
        request(app)
            .delete(`/todos/todo/${id}`)
            .set('x-auth', dummyUsers[0].tokens[0].token)
            .expect(404)
            .expect(res => {
                expect(res.body.Error).toBe('Todo Id not found');
            })
            .end(done);
    });

    it('should return 404 and message when invalid id', (done) => {
        var id = new ObjectId().toHexString() + 'invalid string';
        request(app)
            .delete(`/todos/todo/${id}`)
            .set('x-auth', dummyUsers[0].tokens[0].token)
            .expect(404)
            .expect(res => {
                expect(res.body.Error).toBe('Invalid Todo Id');
            })
            .end(done);
    });
});

describe('PATCH /todos/todo/:id', () => {
    it('should update text and complete in todo', (done) => {
        var updates = { text:'Test update', completed:true };
        request(app)
            .patch(`/todos/todo/${dummyTodos[1]._id.toHexString()}`)
            .set('x-auth', dummyUsers[1].tokens[0].token)
            .send(updates)
            .expect(200)
            .expect(res => {
                expect(res.body.todo.completed).toBe(true);
            })
            .end( (err, res) => {
                if (err) {
                    return done(err);
                }
                Todo.findById(dummyTodos[1]._id.toHexString())
                    .then(todo => {
                        expect(todo.completed).toBe(true);
                        done();
                    })
                    .catch(e => done(e));
            });
    });
    
    it('should not update for different user', (done) => {
        var updates = { text:'Test update', completed:true };
        request(app)
            .patch(`/todos/todo/${dummyTodos[1]._id.toHexString()}`)
            .set('x-auth', dummyUsers[0].tokens[0].token)
            .send(updates)
            .expect(404)
            .end(done);
    });

    it('should make todo uncompleted and clear completed fields', (done) => {
        var updates = { complete: false };
        request(app)
            .patch(`/todos/todo/${dummyTodos[0]._id.toHexString()}`)
            .set('x-auth', dummyUsers[0].tokens[0].token)
            .send(updates)
            .expect(200)
            .expect(res => {
                expect(res.body.todo.completed).toBe(false);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Todo.findById(dummyTodos[0]._id.toHexString())
                    .then(todo => {
                        expect(todo.completed).toBe(false);
                        expect(todo.completedAt).toBeNull();
                        done();
                    })
                    .catch(e => done(e));
            });
    });


});

describe('GET users/me', () => {
    it('should return user if authenticated', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', dummyUsers[0].tokens[0].token)
            .expect(200)
            .expect(res => {
                expect(res.body._id).toBe(dummyUsers[0]._id.toHexString());
                expect(res.body.email).toBe(dummyUsers[0].email);
            })
            .end(done);
    });

    it('should return 401 if not authenticated', (done) => {
        request(app)
            .get('/users/me')
            .expect(401)
            .expect(res => {
                expect(res.body).toEqual({});
            })
            .end(done);
    });
});

describe('POST /users/user', () => {

    it('should create a user', (done) => {
        var email = 'malusio@gmail.com';
        var password = '123abc';

        request(app)
            .post('/users/user')
            .send({ email, password })
            .expect(200)
            .expect(res => {
                expect(res.headers['x-auth']).toBeDefined();
                expect(res.body.email).toBe(email);
                expect(res.body._id).toBeDefined();
            })
            .end(err => {
                if(err) {
                    done(err);
                }
                User.findOne({email})
                    .then(user => {
                        expect(user).toBeDefined();
                        expect(user.password).not.toBe(password);
                        done();
                    })
            });

    });

    it('should return validation errors if input is invalid', (done) => {
        let email = "test@gmail.com";
        request(app)
            .post('/users/user')
            .send({email})
            .expect(400)
            .end(done);
    });

    it('should not create user if emails exists', (done) => {
        request(app)
            .post('/users/user')
            .send({ email:dummyUsers[0].email, password:dummyUsers[0].password })
            .expect(400)
            .end(done);
    });
});

describe('POST /user/login', () => {
    it('should login user and return x-auth token', (done) => {
        request(app)
            .post('/user/login')
            .send({ email: dummyUsers[1].email, password: dummyUsers[1].password })
            .expect(200)
            .expect(res => {
                expect(res.body.email).toBe(dummyUsers[1].email);
                expect(res.body._id).toBeDefined();
                expect(res.headers['x-auth']).toBeDefined();
            })
            .end((err, res) => {
                if (err) {
                    done(err);
                }
                User.findById(dummyUsers[1]._id).then(user => {
                    expect(user.tokens[1]).toMatchObject({
                        access:'auth',
                        token:res.headers['x-auth'],
                    });
                    done();
                })
                .catch((e) => done(e));
            });
    });
    
    it('should reject invalid login', (done) => {
        request(app)
            .post('/user/login')
            .send({ email: dummyUsers[0].email + 'invalid', password: dummyUsers[0].password })
            .expect(400)
            .expect(res => {
                expect(res.headers['x-auth']).not.toBeDefined();
            })
            .end((err, res) => {
                if (err) {
                    done(err);
                }
                User.findById(dummyUsers[1]._id).then(user => {
                    expect(user.tokens).toHaveLength(1);
                    done();
                })
                .catch((e) => done(e));
            });
    });
})

describe('DELETE /user/me/token', () => {
    it('should remove token from authenticated user', (done) => {
        request(app)
            .delete('/user/me/token')
            .set('x-auth', dummyUsers[0].tokens[0].token)
            .expect(200)
            .expect(res => {
                expect(res.headers['x-auth']).not.toBeDefined();
            })
            .end((err, res) => {
                if(err) {
                    done(err);
                }
                    User.findById(dummyUsers[0]._id).then( user => {
                        expect(user.tokens).toHaveLength(0);
                        done();
                    })
                    .catch(e => done(e));
            });
    });
});