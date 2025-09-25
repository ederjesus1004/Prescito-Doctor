import mongoose from "mongoose";

const connectDB = async () => {
    mongoose.connection.on("connected", () =>
        console.log("Base de datos conectada")
    );
    await mongoose.connect(`${process.env.MONGODB_URI}/prescripto`);
};

export default connectDB;
