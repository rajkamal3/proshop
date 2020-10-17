import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'A user should have a name.']
        },
        email: {
            type: String,
            required: [true, 'A user should have an email.'],
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        isAdmin: {
            type: Boolean,
            required: true,
            default: false
        }
    },
    {
        timestamps: true
    }
);

const User = new mongoose.model('User', userSchema);

export default User;
