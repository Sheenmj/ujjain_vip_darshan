import mongoose, { Schema, Document } from 'mongoose';

export interface IBooking extends Document {
  userId?: mongoose.Types.ObjectId; // Optional if guest checkout is allowed
  templeId: string; // References the hardcoded temple ID or future Temple model
  date: Date;
  timeSlot: string;
  numberOfPersons: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  totalAmount: number;
  paymentStatus: 'PENDING' | 'PAID' | 'REFUNDED';
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    templeId: {
      type: String,
      required: [true, 'Temple ID is required'],
    },
    date: {
      type: Date,
      required: [true, 'Booking date is required'],
    },
    timeSlot: {
      type: String,
      required: [true, 'Time slot is required'],
    },
    numberOfPersons: {
      type: Number,
      required: [true, 'Number of persons is required'],
      min: [1, 'At least 1 person is required'],
    },
    status: {
      type: String,
      enum: ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'],
      default: 'PENDING',
    },
    contactName: {
      type: String,
      required: [true, 'Contact name is required'],
    },
    contactEmail: {
      type: String,
      required: [true, 'Contact email is required'],
    },
    contactPhone: {
      type: String,
      required: [true, 'Contact phone is required'],
    },
    totalAmount: {
      type: Number,
      required: true,
      default: 0,
    },
    paymentStatus: {
      type: String,
      enum: ['PENDING', 'PAID', 'REFUNDED'],
      default: 'PENDING',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);
