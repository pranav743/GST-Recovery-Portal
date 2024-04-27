const dotenv = require("dotenv");
dotenv.config();
const User = require("../models/user");
const Demand = require('../models/recovery');


const getAllEntries = async (req, res) => {
    try {
     
        const reqQuery = { ...req.query };
        const removeFields = ['select', 'sort', 'limit', 'page'];
        removeFields.forEach(param => delete reqQuery[param]);

        let queryStr = JSON.stringify(reqQuery);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
        query = Demand.find(JSON.parse(queryStr));

        if (req.query.select) {
            const fields = req.query.select.split(',').join(' ');
            query = query.select(fields);
        }

        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        }

        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 100;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const total = await Demand.countDocuments(query);

        query = query.skip(startIndex).limit(limit);
        const pagination = {};
        if (endIndex < total) {
            pagination.next = {
                page: page + 1,
                limit
            }
        }
        if (startIndex > 0) {
            pagination.prev = {
                page: page - 1,
                limit
            }
        }

        const user = await query;
        if (!user) {
            return res.status(401).json({ success: false, msg: "There are no Entries" });
        }
        return res.status(200).json({ success: true, count: total, pagination, data: user });

    } catch (error) {
        console.error("Error in fetching Entries : ", error);
        return res.status(500).json({ success: false, msg: "Something Wen't Wrong" });
    }
};


module.exports = {
    getAllEntries
}