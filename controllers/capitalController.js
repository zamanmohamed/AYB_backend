const Capital = require('../models/capital');

exports.addCapital = async (req, res) => {
    try {
        const { amount, type } = req.body;
        const capital = new Capital({ amount, type });
        await capital.save();
        res.status(201).json({ message: 'Capital added successfully', capital });
    } catch (error) {
        res.status(500).json({ message: 'Error adding capital', error });
    }
};

exports.getAllCapitals = async (req, res) => {
    try {
        const capitals = await Capital.find();
        res.status(200).json(capitals);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching capitals', error });
    }
};

exports.updateCapital = async (req, res) => {
    try {
        const { id } = req.params;
        const { amount, type } = req.body;

        const updatedCapital = await Capital.findByIdAndUpdate(id, { amount, type }, { new: true });

        if (!updatedCapital) {
            return res.status(404).json({ message: 'Capital not found' });
        }

        res.status(200).json({ message: 'Capital updated successfully', updatedCapital });
    } catch (error) {
        res.status(500).json({ message: 'Error updating capital', error });
    }
};

exports.deleteCapital = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCapital = await Capital.findByIdAndDelete(id);

        if (!deletedCapital) {
            return res.status(404).json({ message: 'Capital not found' });
        }

        res.status(200).json({ message: 'Capital deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting capital', error });
    }
};

exports.paginateSearch = async (req, res) => {
    try {
        const { page = 1, limit = 10, searchText = '' } = req.query;

        const capitals = await Capital.find({ type: { $regex: searchText, $options: 'i' } })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const totalCount = await Capital.countDocuments({ type: { $regex: searchText, $options: 'i' } });

        res.status(200).json({
            data: capitals,
            pagination: {
                totalCount,
                totalPages: Math.ceil(totalCount / limit),
                currentPage: parseInt(page),
                limit: parseInt(limit)
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error paginating search', error });
    }
};
