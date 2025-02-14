import mongoose from 'mongoose';
import chalk from 'chalk';

export const connectDB = async (mongoUri: string | undefined) => {
    if (!mongoUri) {
        console.error(chalk.red('MONGO_URI is not defined in the environment variables ❌'));
        process.exit(1);
    }

    try {
        await mongoose.connect(mongoUri);
        console.log(chalk.cyan(`Connected to MongoDB ➡  ${chalk.magenta(mongoUri)}`));
    } catch (error) {
        console.error(chalk.red('Error connecting to MongoDB:'), error);
        process.exit(1);
    }
};