import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoute from './routes/user.route.js';
import authRoute from './routes/auth.route.js';
dotenv.config();

const app = express();

app.use(express.json());

mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log('Connected to MongoDB!');
    }
).catch(err => {
    console.error('Error connecting to mongoDB', err);
    }
);



app.listen(3000, () => {
    console.log('Server is running on port 3000!');
    }
);

app.use('/api/user', userRoute);
app.use('/api/auth', authRoute);
