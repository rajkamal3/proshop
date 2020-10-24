import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });

        console.log(`DB connected: ${conn.connection.host}`);
    } catch (err) {
        console.log(`ERROR: ${err.message}`);
        process.exit(1);
    }
};

export default connectDB;
