import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required:true,
        unique: true,
    },
    contact: {
        type: Number,
        required:true,
        unique: true,
    },
    gender: {
        type: String,
        required:true,
    },    
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required:true,
    }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;