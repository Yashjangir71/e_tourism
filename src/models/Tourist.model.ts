import mongoose, {Schema, Document} from "mongoose";
import { Tour } from "./Tour.model";

// export interface Message extends Document {
//     content: string,
//     createdAt: Date
// }

// const MessageSchema: Schema<Message> = new Schema({
//     content: {
//         type: String,
//         required: true
//     },
//     createdAt: {
//         type: Date,
//         required: true,
//         default: Date.now
//     }
// })

// {
//     _id: ObjectId,
//     name: string,
//     email: string,
//     passwordHash: string,           // for authentication
//     phone?: string,
//     preferences: string[],          // e.g., ['adventure', 'beach']
//     bookedTours: [ObjectId],        // refs to TravelPackage
//     profilePicture?: string,
//     createdAt: Date,
//     updatedAt: Date,
//     deletedAt?: Date
//   }

export interface Tourist extends Document {
    username: string,
    name: string,
    email: string,
    password: string,
    phone?: string,
    preferences: string[],
    bookedTours: Tour[],
    verifyEmailCode: string,
    verifyEmailCodeExpiry: Date,
    isEmailVerified: boolean,
}

// const UserSchema: Schema<User> = new Schema({
const TouristSchema: Schema<Tourist> = new Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        trim: true,
        unique: true
    },
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Email required"],
        unique: true,
        match: [/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g, "please use a valid email address"]
    },
    password: {
        type: String,
        required: [true, "password is required"]
    },
    phone: {
        type: String,
        unique: true,
        maxlength: 13,
        default: null
    },
    preferences: [
        {
            type: String
        }
    ],
    bookedTours: [
        {
            type: Schema.Types.ObjectId,
            ref: "Tour",
        },
    ],
    verifyEmailCode: {
        type: String,
        required: [true, "verify code is required"]
    },
    verifyEmailCodeExpiry: {
        type: Date,
        required: [true, "verify code expiry required"]
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
}, {timestamps: true})

const TouristModel = (mongoose.models.Tourist as mongoose.Model<Tourist>) || mongoose.model<Tourist>("Tourist", TouristSchema)

export default TouristModel;