var  mongoose = require('mongoose');

var Todo = mongoose.model('Todo', {
    text: {
        type: String,
        require: true,
        minlength: 1,
        trim: true,
    },
    competed: {
        type: Boolean,
        default: false,
    },
    competedAt: {
        type: Number,
        default: null
    }
});

module.exports = { Todo };
