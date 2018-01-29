const mongoose = require('mongoose');
const url = 'mongodb://Holykill:vPz-2u4-nNx-Bmg@ds113738.mlab.com:13738/ems'
exports.connectMongo = () => {
    return mongoose.connect(url);
};
