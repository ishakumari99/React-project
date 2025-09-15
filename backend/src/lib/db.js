const mongoose = require('mongoose');
<<<<<<< HEAD

async function connectDB(uri) {
  if (!uri) throw new Error('Missing MONGODB_URI');
  await mongoose.connect(uri);
  console.log('MongoDB connected');
}

module.exports = connectDB;


=======
async function connectDB(uri){
    if (!uri) throw new Error('Missing MONGODB_URI');
    await mongoose.connect(uri);
    console.log('MongoDB Connected');
}
module.exports = connectDB;
>>>>>>> 544d47a4b4540a8a508aa8e7a7279a6d0c46be10
