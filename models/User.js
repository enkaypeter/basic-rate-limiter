const mongoose =  require('mongoose');

const UserSchema = mongoose.Schema({
    api_key: {
        type: 'string',
        required: true,
        unique: true,
    },
    MAX_REQUEST_COUNT: {
        type: "number",
        required: true
    }
})

module.exports = mongoose.model('users', UserSchema);
