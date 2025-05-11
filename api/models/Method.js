import mongoose from 'mongoose';

const methodSchema = new mongoose.Schema({
  method: { type: String, required: true, unique: true }
});

export default mongoose.model('Method', methodSchema);