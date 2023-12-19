import mongoose from 'mongoose';

const uriMap = {
    local: process.env.LOCAL_DB_CONNECTION_STRING,
    development: process.env.DEV_DB_CONNECTION_STRING,
};

console.log("CURRENT_ENV", process.env.CURRENT_ENV);
const selectedEnv = process.env.CURRENT_ENV || 'development';
let uri = uriMap[selectedEnv];
console.log(uri);

export const connection = async () => {
    return mongoose.connect(uri)
        .then(() => {
            console.log(`Connected to MongoDB database successfully on ${selectedEnv} environment!`);
        }).catch((err) => {
            console.log("MongoDB Error: ", err);
        })
}
