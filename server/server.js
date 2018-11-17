require('./config/config');

var express      = require('express');
var bodyParser   = require('body-parser');
var { ObjectId } = require('mongodb');
var _            = require('lodash');

var { mongoose } = require('./db/mongoose.js')
var { User }     = require('./Models/User');
var { Todo }     = require('./Models/Todo');
var {authenticate} = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.post('/todos', authenticate, (req, res) => {
    var todo = new Todo({
        text:req.body.text,
        _owner:req.user._id,
    });

    todo.save()
        .then(doc => res.send(doc))
        .catch(e  => res.status(400).send(e));
});

app.get('/todos', authenticate ,(req, res) => {
    Todo.find({ _owner:req.user._id })
        .then(todos => res.send({todos}))
        .catch(e => res.status(400).send(e));
});

app.get('/todos/todo/:id', authenticate,  (req, res) => {
    var id = req.params.id;

    if (!ObjectId.isValid(id)) {
        return res.status(404).send({Error:'Invalid Todo Id'});
    }
    Todo.findOne({
        _id:id,
        _owner:req.user._id,
    })
    .then(todo => {
        if (!todo) {
            return res.status(404).send({Error:'Todo Id not found'});
        }
        res.send({todo})
    })
    .catch(e => res.status(400).send({ Error: 'Invalid Todo Id' }));
});

app.delete('/todos/todo/:id', authenticate, (req, res) => {
    var id = req.params.id;

    if (!ObjectId.isValid(id)) {
        return res.status(404).send({ Error: 'Invalid Todo Id' });
    }
    Todo.findOneAndRemove({_id:id, _owner:req.user._id })
        .then( todo => {
            if (!todo) {
                return res.status(404).send({ Error: 'Todo Id not found' });
            }
            res.send({todo});
        })
        .catch(e => res.status(400).send({ Error: 'Invalid Todo Id' }));
});

app.patch('/todos/todo/:id', authenticate,  (req, res) => {
    var id   = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);

    if (!ObjectId.isValid(id)) {
        return res.status(404).send({ Error: 'Invalid Todo Id' });
    }

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completedAt = null;
        body.completed   = false;
    }

    Todo.findOneAndUpdate({_id:id, _owner:req.user._id}, { $set: body }, { new:true })
        .then(todo => {
            if (!todo) {
                return res.status(404).send({ Error: 'Todo Id not found' });
            }
            res.send({todo});
        })
        .catch(e => res.status(400).send({ Error: 'Invalid Todo Id' }));
});

app.post('/users/user', (req, res) => {
    var userInfo = _.pick(req.body, ['email', 'password']);
    var user     = new User(userInfo);

    user.save()
        .then(user => {
            return user.generateAuthToken();
        })
        .then((token) => {
            res.header('x-auth', token).send(user); 
        })
        .catch(e => res.status(400).send(e));
});


app.get('/users/me', authenticate,  (req, res) => {
   res.send(req.user);
});

app.post('/user/login', (req, res) => {
    let loginDetails = _.pick(req.body, ['email', 'password']);
    User.findByCredentials(loginDetails.email, loginDetails.password)
        .then( user => {
           return user.generateAuthToken().then(token => {
               res.header('x-auth', token).send(user); 
           })
        })
        .catch(e => res.status(400).send());
});

app.delete('/user/me/token', authenticate,  (req, res) => {
    req.user.removeToken(req.token)
    .then(() => res.status(200).send())
    .catch(e => res.staus(400).send(e)); 

});

app.listen(port, () => { console.log(`Starting on ${port}`); });

module.exports = { app };