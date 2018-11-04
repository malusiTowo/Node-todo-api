require('./config/config');

var express      = require('express');
var bodyParser   = require('body-parser');
var { ObjectId } = require('mongodb');
var _            = require('lodash');

var { mongoose } = require('./db/mongoose.js')
var { User }     = require('./Models/User');
var { Todo }     = require('./Models/Todo');

var app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    var todo = new Todo({
        text:req.body.text
    });

    todo.save()
        .then(doc => res.send(doc))
        .catch(e  => res.status(400).send(e));
});

app.get('/todos', (req, res) => {
    Todo.find()
        .then(todos => res.send({todos}))
        .catch(e => res.status(400).send(e));
});

app.get('/todos/todo/:id', (req, res) => {
    var id = req.params.id;

    if (!ObjectId.isValid(id)) {
        return res.status(404).send({Error:'Invalid Todo Id'});
    }
    Todo.findById(id)
    .then(todo => {
        if (!todo) {
            return res.status(404).send({Error:'Todo Id not found'});
        }
        res.send({todo})
    })
    .catch(e => res.status(400).send({ Error: 'Invalid Todo Id' }));
});

app.delete('/todos/todo/:id', (req, res) => {
    var id = req.params.id;

    if (!ObjectId.isValid(id)) {
        return res.status(404).send({ Error: 'Invalid Todo Id' });
    }
    Todo.findByIdAndRemove(id)
        .then( todo => {
            if (!todo) {
                return res.status(404).send({ Error: 'Todo Id not found' });
            }
            res.send({todo});
        })
        .catch(e => res.status(400).send({ Error: 'Invalid Todo Id' }));
});

app.patch('/todos/todo/:id', (req, res) => {
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

    Todo.findByIdAndUpdate(id, { $set: body }, { new:true })
        .then(todo => {
            if (!todo) {
                return res.status(404).send({ Error: 'Todo Id not found' });
            }
            res.send({todo});
        })
        .catch(e => res.status(400).send({ Error: 'Invalid Todo Id' }));
});

app.listen(port, () => { console.log(`Starting on ${port}`); });

module.exports = { app };