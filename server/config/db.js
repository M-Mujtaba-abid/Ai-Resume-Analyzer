// import mongoose from 'mongoose';

// const connectDB = async () => {
//     try {
//         const conn = await mongoose.connect(process.env.MONGO_URI);
//         console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
//     } catch (error) {
//         console.error(`❌ Error: ${error.message}`);
//         process.exit(1); // Agar DB connect na ho to app stop kar dein
//     }
// };

// export default connectDB;


import mongoose from 'mongoose';

const connectDB = async () => {
    // Agar pehle se connected hai to wapsi kar jao (Performance boost)
    if (mongoose.connection.readyState >= 1) {
        return;
    }

    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        // Deployed environment mein exit na karein, bas error throw karein
        if (process.env.NODE_ENV !== 'production') {
            process.exit(1);
        }
    }
};

export default connectDB;