const Extra = require('../models/Extra');

const getExtras = async (req, res) => {
    try {
        const extras = await Extra.find();
        return res.status(200).json({
            ok: true,
            data: extras,
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            message: `error: ${error}`,
        })
    }
}
const createExtra = async (req, res) => {
    try {
        const extra = new Extra(req.body);
        await extra.save();
        return res.status(200).json({
            ok: true,
            data: extra
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            message: `error: ${error}`,
        })
    }
}
const updateExtra = async (req, res) => {
    const id = req.params.id
    try {
        const extra = await Extra.findByIdAndUpdate(id, req.body, { new: true });
        return res.status(200).json({
            ok: true,
            data: extra
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            message: `error: ${error}`,
        })
    }
}
const deleteExtra = async (req, res) => {
    const id = req.params.id
    try {
        const extra = await Extra.findByIdAndDelete(id);
        return res.status(200).json({
            ok: true,
            data: extra
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            message: `error: ${error}`,
        })
    }
}

module.exports = { getExtras
    ,createExtra
    ,updateExtra
    ,deleteExtra }