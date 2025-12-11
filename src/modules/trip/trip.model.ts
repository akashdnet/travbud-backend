import mongoose from 'mongoose';
import User from '../user/user.model';

const tripSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        validate: {
            validator: async function (v: mongoose.Types.ObjectId) {
                const user = await User.findById(v);
                return !!user;
            },
            message: (props: any) => `User ID ${props.value} does not exist in the database.`
        }
    },


    destination: {
        type: String,
        required: [true, 'Destination is required'],
        trim: true
    },
    startDate: {
        type: Date,
        required: [true, 'Start date is required']
    },
    endDate: {
        type: Date,
        required: [true, 'End date is required']
    },


    budget: {
        type: Number,
        required: [true, 'Budget is required'],
        min: [0, 'Budget must be a positive number']
    },


    travelTypes: {
        type: [String],
        default: [],
        required: true
    }
    ,


    description: {
        type: String,
        required: [true, 'Description is required'],
        maxlength: 2000
    },

    activities: {
        type: [String],
        default: []
    },

    photos: {
        type: [String],
        default: []
    },


    maxGroupSize: {
        type: Number,
        required: true,
        min: 1,
        default: 1
    },

    participants: {
        pending: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: []
        }],
        approved: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: []
        }]
    },


    status: {
        type: String,
        enum: ['Open', 'Full', 'Completed', 'Cancelled'],
        default: 'Open'
    }
}, {
    timestamps: true
});





tripSchema.pre('validate', function (next) {
    if (this.startDate > this.endDate) {
        next(new Error('End date cannot be before start date'));
    } else {
        next();
    }
});









const Trip = mongoose.model('Trip', tripSchema);
export default Trip;