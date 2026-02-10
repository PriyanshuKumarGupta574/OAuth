import mongoose from 'mongoose';
console.log('Mongoose version:', mongoose.version);
console.log('Keys in mongoose:', Object.keys(mongoose));
try {
    // @ts-ignore
    const FilterQuery = mongoose.FilterQuery;
    console.log('mongoose.FilterQuery:', FilterQuery);
} catch (e) {
    console.log('Error accessing FilterQuery:', e);
}
