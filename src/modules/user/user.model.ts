import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { IUser, IUserMethods, UserModel } from './user.interface';

const userSchema = new mongoose.Schema<IUser, UserModel, IUserMethods>({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/\S+@\S+\.\S+/, 'Please use a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 6,
        select: 0
    },

    bio: {
        type: String,
        maxlength: [100, 'Bio cannot exceed 100 characters'],
        default: ''
    },
    about: {
        type: String,
        default: ''
    },
    photo: {
        type: String,
        default: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
    },
    age: {
        type: Number,
        required: [true, 'Age is required'],
        min: [18, 'Age must be at least 18'],
    },
    gender: {
        type: String,
        enum: ['Male', 'Female'],
        required: [true, 'Gender is required']
    },

    travelInterests: {
        type: [String],
        default: []
    },
    visitedCountries: {
        type: [String],
        default: []
    },
    currentLocation: {
        type: String
    },

    contactNumber: {
        type: String,
        required: [true, 'Contact number is required'],
        unique: true,
        trim: true,
        match: [/^01[3-9]\d{8}$/, 'Please enter a valid phone number']

    },

    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    status: {
        type: String,
        enum: ['active', 'blocked'],
        default: 'active'
    },
    isVerified: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.comparePassword = async function (candidatePassword: any) {
    return await bcrypt.compare(candidatePassword, this.password);
};
const User = mongoose.model<IUser, UserModel>('User', userSchema);
export default User;