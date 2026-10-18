import mongoose from 'mongoose';

const paperSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  code: { type: String, required: true, uppercase: true, trim: true },
  teacher: { type: String, trim: true, default: '' },
  year: { type: Number, required: true, min: 2000 },
  semester: { type: String, enum: ['Spring', 'Fall', 'Summer'], default: 'Fall' },
  fileUrl: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  downloads: { type: Number, default: 0 },
}, { timestamps: true });

paperSchema.index({ title: 'text', code: 'text', teacher: 'text' });
export default mongoose.model('Paper', paperSchema);
