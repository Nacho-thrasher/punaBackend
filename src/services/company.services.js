const Company = require('../models/Company');


const getById = async (id) => {
    try {
        const company = await Company.findById(id);
        return company;
    } catch (error) {
        console.log(error);
        return null
    }
}
const getAll = async () => {
    try {
        const companies = await Company.find();
        return companies;
    } catch (error) {
        console.log(error);
        return null
    }
}
const create = async (body) => {
    try {
        const company = new Company(body);
        await company.save();
        return company;
    } catch (error) {
        console.log(error);
        return null
    }
}
const getByName = async (name) => {
    try {
        const empresaName = name.split('-').join(' ');
        const company = await Company.findOne({ name: empresaName });
        if (company.length === 0) {
            return null;
        }
        return company;
        
    } catch (error) {
        console.log(error);
        return null
    }
}

module.exports = { getById, getAll, create, getByName };