var express    = require('express');
var bodyParser = require('body-parser');
var { ObjectId } = require('mongodb');

var { mongoose } = require('./db/mongoose.js')
var { User }     = require('./Models/User');
var { Todo }     = require('./Models/Todo');

var app = express();
const port = process.env.Process || 3000;

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

app.listen(port, () => { console.log(`Starting on ${port}`); });

module.exports = { app };