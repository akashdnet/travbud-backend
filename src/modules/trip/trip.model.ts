
import mongoose from 'mongoose';
import User from '../user/user.model';

const tripSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Tour name is required'],
            trim: true,
            maxlength: 100,
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
            maxlength: 2000,
        },
        price: {
            type: Number,
            required: [true, 'Price is required'],
            min: [0, 'Price cannot be negative'],
        },
        days: {
            type: Number,
            required: [true, 'Number of days is required'],
            min: [1, 'Tour must be at least 1 day'],
        },
        image: {
            type: String,
            required: [true, 'Main image URL is required'],
        },
        location: {
            type: String,
            required: [true, 'Location is required'],
            trim: true,
        },
        startDate: {
            type: Date,
            required: [true, 'Start date is required'],
        },
        endDate: {
            type: Date,
            required: [true, 'End date is required'],
        },
        guide: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Guide (User ID) is required'],
            validate: {
                validator: async function (v: mongoose.Types.ObjectId) {
                    const user = await User.findById(v);
                    return !!user;
                },
                message: 'Guide ID does not exist in the database.',
            },
        },
        participants: {
            type: {
                pending: [mongoose.Schema.Types.ObjectId],
                approved: [mongoose.Schema.Types.ObjectId],
            },
            default: {
                pending: [],
                approved: [],
            },
        },
        itinerary: {
            type: [String],
            required: [true, 'Itinerary is required'],
            validate: {
                validator: (v: string[]) => Array.isArray(v) && v.length > 0,
                message: 'Itinerary must contain at least one day',
            },
        },
        highlights: {
            type: [String],
            required: [true, 'Highlights are required'],
        },
        inclusions: {
            type: [String],
            required: [true, 'Inclusions are required'],
        },
        exclusions: {
            type: [String],
            required: [true, 'Exclusions are required'],
        },
        difficulty: {
            type: String,
            required: [true, 'Difficulty level is required'],
            enum: ['Easy', 'Moderate', 'Challenging', 'Moderate to Challenging'],
        },
        groupSize: {
            type: Number,
            required: [true, 'Maximum group size is required'],
            min: [1, 'Group size must be at least 1'],
        },

        faq: {
            type: [
                {
                    q: { type: String, required: true, maxlength: 300 },
                    a: { type: String, required: true, maxlength: 1000 },
                },
            ],
            default: [],
        },
        status: {
            type: String,
            enum: ['Open', 'Full', 'Completed'],
            default: 'Open',
        },
    },
    {
        timestamps: true,
    }
);




tripSchema.pre('validate', function (next) {
    if (this.startDate && this.endDate && this.startDate > this.endDate) {
        next(new Error('End date cannot be before start date'));
    } else {
        next();
    }
});




tripSchema.pre('save', function (next) {
    const now = new Date();
    if (this.startDate > now && this.participants.approved.length < this.groupSize) {
        this.status = 'Open';
    } else if (this.endDate < now) {
        this.status = 'Completed';
    } else if (this.participants.approved.length >= this.groupSize) {
        this.status = 'Full';
    }


    next();
});

const Trip = mongoose.model('Trip', tripSchema);
export default Trip;