const mongoose = require('mongoose');

const unsharedSchema = new mongoose.Schema({

    email: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    created: {
        type: Date,
        default: () => Date.now(),
    }

});
module.exports = mongoose.model('unshared', unsharedSchema);