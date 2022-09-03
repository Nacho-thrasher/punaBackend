const UserCompany = require('../models/UserCompany');

const getByUserCompany = async (user, company) => {
    try {
        const userCompany = await UserCompany.findOne({ user, company });
        if (!userCompany) {
            return null;
        }
        return userCompany;

    } catch (error) {
        console.log(error);
        return null
    }
}
const postUserCompany = async (user, company) => {
    try {
        const userCompany = new UserCompany({ user, company });
        await userCompany.save();
        return userCompany;

    } catch (error) {
        console.log(error);
        return null
    }
}

module.exports = { getByUserCompany, postUserCompany };