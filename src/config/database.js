const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            // Options are no longer needed in Mongoose 6+, but keeping for reference if needed for older versions
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
        });

        logger.info(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        logger.error(`Error connecting to MongoDB: ${error.message}`);
        // Exit process with failure
        process.exit(1);
    }
};

module.exports = connectDB;
