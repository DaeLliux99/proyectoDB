const bcrypt = require('bcryptjs');
const helpers = {};

helpers.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
};
/*
helpers.matchPassword = async (password, savedPassword) => {
    return await bcrypt.compare(password, savedPassword).then((res) => {
        return res;
    }).catch((err)=>console.error(err));
    return respuesta;
};
*/

helpers.matchPassword = function (password, savedPassword, callback) {
    bcrypt.compare(password, savedPassword, (err, res) => {
        if (res) {
            callback(true);
        } else {
            callback(false);
        }
    });
};
module.exports = helpers;