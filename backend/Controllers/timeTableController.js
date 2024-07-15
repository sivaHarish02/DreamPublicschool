const express = require('express');
const router = express.Router();
const moment = require('moment');
const multer = require('multer');
const currentDate = moment().format("YYYY-MM-DD HH:mm:ss");

module.exports = (db, upload) => {

    router.post('/saveTimeTable', upload.single('timetable'), async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ message: "No file uploaded." });
            }

            const table = req.file.filename;
            const {cls_allocation_id, academic_year } = req.body;

            // Check if given academic year and cls_allocation_id exist in class_allocation table
            const checkClassAllocationQuery = `
                SELECT * 
                FROM class_allocation 
                WHERE cls_allocation_id = ? AND academic_year = ?`;
            const [classAllocationResult] = await db.query(checkClassAllocationQuery, [cls_allocation_id, academic_year]);

            if (classAllocationResult.length === 0) {
                return res.status(404).json({ message: "Class allocation not found for the given academic year and cls_allocation_id." });
            }

            // Check if timetable already exists for the given cls_allocation_id
            const checkTimeTableQuery = `
                SELECT * 
                FROM time_table 
                WHERE cls_allocation_id = ? AND academic_year = ?`;
            const [timeTableResult] = await db.query(checkTimeTableQuery, [cls_allocation_id, academic_year]);

            if (timeTableResult.length > 0) {
                return res.status(409).json({ message: "Time table already exists for the given class allocation and academic year." });
            }

            // Insert new timetable record
            const insertQuery = `
                INSERT INTO time_table (t_table,cls_allocation_id, academic_year, created_at) 
                VALUES (?, ?, ?, ?)`;
            await db.query(insertQuery, [table,  cls_allocation_id, academic_year, currentDate]);

            return res.status(200).json({ message: "Time table saved successfully." });
        } catch (err) {
            console.log("Error saving time table:", err);
            return res.status(500).json({ message: "Internal server error." });
        }
    });

    router.get('/getTimeTable', async (req, res) => {
        try {
            const { cls_allocation_id, academic_year } = req.query;
            console.log("Data :",cls_allocation_id)
            console.log("Data :",academic_year)

            // Validate input parameters
            if (!cls_allocation_id || !academic_year) {
                return res.status(400).json({ message: "Missing required query parameters" });
            }

            // Construct the SQL query
            const query = `
            select * from time_table where cls_allocation_id =? and academic_year =?;
            `;

            // Execute the query with the provided parameters
            const [rows] = await db.query(query, [cls_allocation_id, academic_year]);

            // Check if any data is found
            if (rows.length === 0) {
                return res.status(404).json({ message: "No timetable data found" });
            }

            // Convert data to include full URL for timetable file
            const convertData = rows.map((data) => ({
                ...data,
                t_table: `http://localhost:3001/uploads/${data.t_table}`
            }));
            

            // Return the filtered timetable data
            res.status(200).json(convertData);
            console.log("Data ", convertData);

        } catch (err) {
            console.log("Error fetching timetable data:", err);
            return res.status(500).json({ message: "Internal server error" });
        }
    });

    return router;
};
