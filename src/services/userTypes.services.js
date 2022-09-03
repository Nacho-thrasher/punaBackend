const User_type = require("../models/User_type.js");

const getTypes = async()=>{
    try {
        const types = await User_type.find();
        return types;        
    } catch (error) {
        console.log(error);
        return null
    }
}
const getType = async()=>{}
const createType = async()=>{}
const updateType = async()=>{}
const deleteType = async()=>{}

module.exports = { getTypes, createType, getType, updateType, deleteType };