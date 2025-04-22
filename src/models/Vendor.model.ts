import mongoose, {Schema, Document} from "mongoose";
import { Tour } from "./Tour.model";

// {
//     _id: ObjectId,
//     name: string,
//     email: string,
//     passwordHash: string,           // for authentication
//     phone: string,
//     companyName: string,
//     description: string,
//     tours: [ObjectId],              // refs to TravelPackage
//     profilePicture?: string,
//     website?: string,
//     verified: boolean,              // default: false
//     createdAt: Date,
//     updatedAt: Date
//   }

export interface Vendor extends Document {
    username: string,
    name: string,
    email: string,
    password: string,
    phone: string,
    companyName?: string,
    description: string,
    tours: Tour[],
    website?: string,
    verifiedVendor: boolean,
    verifyEmailCode: string,
    verifyEmailCodeExpiry: Date,
    isEmailVerified: boolean,
}

// const UserSchema: Schema<User> = new Schema({
const VendorSchema: Schema<Vendor> = new Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: [true, "Email required"],
        unique: true,
        match: [/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g, "please use a valid email address"]
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        maxlength: 13,
        required: true
    },
    companyName: {
        type: String,
        default: null
    },
    description: {
        type: String,
        required: true,
        maxlength: 500,
        default: null
        // give me maxLength for this
    },
    tours: [
        {
            type: Schema.Types.ObjectId,
            ref: "Tour"
        }
    ],
    website: {
        type: String,
        default: null
    },
    verifiedVendor: {
        type: Boolean,
        default: false
    },
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

const VendorModel = (mongoose.models.Vendor as mongoose.Model<Vendor>) || mongoose.model<Vendor>("Vendor", VendorSchema)

export default VendorModel;