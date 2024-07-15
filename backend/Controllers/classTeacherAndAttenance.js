const express = require('express');
const router = express.Router();
const moment = require('moment');
const currentDate = moment().format('YYYY-MM-DD HH:mm:ss');

module.exports = (db) => {

   
    router.get(`/classstudents/:staff_id`,async(req,res)=>{
        try{
            const getQuery =` select stu.* from students_master as stu
             inner join class_teachers as cls
              on stu.cls_allocation_id = cls.cls_allocation_id	where cls.staff_id = ?`
              const id = req.params.staff_id;
              console.log(id)
              const [results] = await db.query(getQuery,[id]);
              if (results.length == 0) {
                return res.status(404).json({ message: "Students data not found." });
              } else {
                const convertData = results.map((result) => ({
                  ...result,
                  stu_img: `http://localhost:3001/uploads/${result.stu_img}`,
                }));
                return res.status(200).json(convertData);
              }
            } catch (error) {
              console.error("Error fetching Students data:", error);
              return res.status(500).json({ message: "Internal server error." });      
        }
    })
   

    
    
    return router;
};
