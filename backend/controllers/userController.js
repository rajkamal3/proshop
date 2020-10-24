import catchAsync from 'express-async-handler';
import User from './../models/userModel.js';
import generateToken from './../utils/generateToken.js';

const authUser = catchAsync(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id)
        });
    } else {
        res.status(401);
        throw new Error(`Invalid email or password.`);
    }
});

const registerUser = catchAsync(async (req, res) => {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error(`User already exists.`);
    }

    const user = await User.create({
        name,
        email,
        password
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id)
        });
    } else {
        res.status(400);
        throw new Error(`Invalid user data.`);
    }
});

const getUserProfile = catchAsync(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id)
        });
    } else {
        res.status(404);
        throw new Error(`User not found.`);
    }
});

const updateUserProfile = catchAsync(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        res.status(201).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            token: generateToken(updatedUser._id)
        });
    } else {
        res.status(404);
        throw new Error(`User not found.`);
    }
});

const getUsers = catchAsync(async (req, res) => {
    const users = await User.find({});
    res.json(users);
});

const deleteUser = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (user) {
        await user.remove();
        res.json({
            message: 'User removed'
        });
    } else {
        res.status(404);
        throw new Error('User not found.');
    }
});

const getUserById = catchAsync(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password');
    if (user) {
        res.json(user);
    } else {
        throw new Error('User not found.');
    }
});

const updateUser = catchAsync(async (req, res) => {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: false });

    if (updateUser) {
        res.status(201).json({
            status: 'success',
            user: updatedUser
        });
    } else {
        res.status(404).json({
            status: 'fail',
            message: 'User not found.'
        });
    }
});

export { authUser, registerUser, getUserProfile, updateUserProfile, getUsers, deleteUser, getUserById, updateUser };
