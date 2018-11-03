var express    = require('express');
var bodyParser = require('body-parser');

var { mongoose } = require('./db/mongoose.js')
var { User }     = require('./Models/User');
var { Todo }     = require('./Models/Todo');

var app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    var todo = new Todo({
        text:req.body.text
    });

    todo.save()
        .then(doc => {
            res.send(doc)
        })
        .catch(e  => {
            res.status(400).send(e)
        });
})
app.listen(3000, () => { console.log('Starting on 3000'); });