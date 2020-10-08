import mongoose from 'mongoose';

const UserLogsSchema = mongoose.Schema({
    api_key: {
        type: 'string',
        required: true,
        unique: true,
    },
    REQUEST_COUNT: {
        type: 'number',
        required: true,
    },
    REQUEST_START_TIME: {
        type: "string",
        required: true
    }
});

module.exports = mongoose.model('user_logs', UserLogsSchema);
