const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
