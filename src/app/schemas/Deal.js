import mongoose from 'mongoose';

const DealSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
    },
    deals: {
        type: [Object],
        required: true,
    },
    total_value: {
        type: Number,
        required: true,
    },
});

export default mongoose.model('Deal', DealSchema);
