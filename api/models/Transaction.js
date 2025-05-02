// Use import instead of require
import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const TransactionSchema = new Schema({
    name: { type: String, required: true },
    amount: {type: Number, required: true},
    description: { type: String, required: false },
    date: { type: Date, required: true },
    category: { type: String, required: true },
    method: { type: String, required: false },
});

// Export the model as default and named export
const TransactionModel = model('Transaction', TransactionSchema);

export default TransactionModel; // Default export
export { TransactionModel }; // Named export (if needed)