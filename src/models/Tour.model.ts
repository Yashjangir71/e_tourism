import mongoose, {Schema, Document} from "mongoose";
import { Vendor } from "./Vendor.model";

// {
//     _id: ObjectId,
//     vendorId: ObjectId,                 // ref to Vendor
//     title: string,
//     description: string,
//     price: number,
//     category: string,                  // e.g., 'adventure', 'culture'
//     location: string,
//     imageUrls: string[],               // allow multiple images
//     itinerary: [
//       {
//         place: string,
//         plan: string,                  // description or activities planned
//         time: string                   // e.g., 'Day 1 - Morning' or a timestamp
//       }
//     ],
//     availableDates: Date[],            // Optional — for booking availability
//     ratings: number[],                 // ratings from tourists (1–5)
//     createdAt: Date,
//     updatedAt: Date
// }

export interface Itinerary extends Document {
    place: String,
    plan: String,
    time: String
}

const ItinerarySchema: Schema<Itinerary> = new Schema({
    place: {
        type: String,
        required: true
    },
    plan: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
})


export interface Tour extends Document {
    vendorId: Vendor,
    title: string,
    description: string,
    price: number,
    category: string,
    location: string,
    imageUrls: string[],
    itinerary: Itinerary[],
    startDate: Date,
    endDate: Date,
    rating: number[],
    slotsLeft: number,
}

// const UserSchema: Schema<User> = new Schema({
const TourSchema: Schema<Tour> = new Schema({
    vendorId: {
        type: Schema.Types.ObjectId,
        ref: "Vendor"
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        enum: ['adventure', 'culture', 'relaxation', 'wildlife', 'historical']
    },
    location: {
        type: String,
        required: true
    },
    imageUrls: [
        {
            type: String
        }
    ],
    itinerary: [
        ItinerarySchema
    ],
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    rating: [
        {
            type: Number,
            required: true,
            min: 0,
            max: 5
        }
    ],
    slotsLeft: {
        type: Number,
        default: 0,
        required: true
    }
}, {timestamps: true})

const TourModel = (mongoose.models.Tour as mongoose.Model<Tour>) || mongoose.model<Tour>("Tour", TourSchema)

export default TourModel;