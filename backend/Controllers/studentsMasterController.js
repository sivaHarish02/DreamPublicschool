const express = require("express");
const router = express.Router();
const moment = require("moment");
const multer = require("multer");
const currentDate = moment().format("YYYY-MM-DD HH:mm:ss");
module.exports = (db, upload) => {

  router.post("/saveStudents", upload.single("stu_img"), async (req, res) => {
    try {
      const {
        staff_id,
        cls_id,
        scheme,
        stu_name,
        stu_aadhar,
        gender,
        dob,
        van,
        community,
        cast_name,
        religion,
        father_name,
        father_mobile,
        father_occupation,
        father_annual_income,
        mother_name,
        mother_mobile,
        mother_occupation,
        mother_annual_income,
        address,
      } = req.body;

      const stu_img = req.file ? req.file.filename : null;

      if (
        !staff_id ||
        !cls_id ||
        
        !stu_name ||
        !stu_aadhar ||
        !gender ||
        !dob ||
        !van ||
        !community ||
        !cast_name ||
        !religion ||
        !father_name ||
        !father_mobile ||
        !father_occupation ||
        !father_annual_income ||
        !mother_name ||
        !mother_mobile ||
        !mother_occupation ||
        !mother_annual_income ||
        !address ||
        !stu_img
      ) {
        return res.status(400).json({ message: "All fields are required." });
      }

      const existingStudentQuery = `SELECT * FROM students_master WHERE stu_aadhar = ?`;
      const [existingStudentResult] = await db.query(existingStudentQuery, [
        stu_aadhar,
      ]);

      if (existingStudentResult.length > 0) {
        return res
          .status(400)
          .json({
            message: "Student already exists with the same Aadhar number.",
          });
      }

      const apply_date = moment().format("YYYY-MM-DD");

      const saveQuery = `
              INSERT INTO students_master 
              (staff_id, cls_id, scheme, stu_name, stu_aadhar, stu_img, gender, dob,van, community, cast_name, religion, 
              father_name, father_mobile, father_occupation, father_annual_income, mother_name, mother_mobile, 
              mother_occupation, mother_annual_income, address, apply_date, created_at) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `;

      const saveParams = [
        staff_id,
        cls_id,
        scheme,
        stu_name,
        stu_aadhar,
        stu_img,
        gender,
        dob,
        van,
        community,
        cast_name,
        religion,
        father_name,
        father_mobile,
        father_occupation,
        father_annual_income,
        mother_name,
        mother_mobile,
        mother_occupation,
        mother_annual_income,
        address,
        apply_date,
        currentDate,
      ];

      const [results] = await db.query(saveQuery, saveParams);

      if (results.affectedRows === 1) {
        return res
          .status(200)
          .json({ message: "Student data saved successfully." });
      } else {
        return res
          .status(500)
          .json({ message: "Failed to save student data." });
      }
    } catch (err) {
      console.log("Error saving student data:", err);
      return res.status(500).json({ message: "Internal server error." });
    }
  });

  router.get("/getStudentsReg", async (req, res) => {
    try {
      const getQuery = `select students_master.*,staff.staff_name,cls.cls_name, from students_master inner join staffs_master staff on staff.staff_id = students_master.staff_id inner join class cls on students_master.cls_id = cls.cls_id 
          inner join sections sec on students_master.sec_id = sec.sec_id where students_master.isAllocated = 0 `;
      const [results] = await db.query(getQuery);
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
  });

  router.get("/getStudents", async (req, res) => {
    try {
      const getQuery = `select * from students_master`;
      const [results] = await db.query(getQuery);
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
  });
  router.get("/getStudentsCount", async (req, res) => {
    try {
      // Query to fetch count of students
      const countQuery = `SELECT COUNT(*) AS total_count FROM students_master`;
      
      // Execute the query
      const [results] = await db.query(countQuery);
  
      // Extract total_count from results
      const total_count = results[0].total_count;
  
      // Return response with count
      return res.status(200).json({ total_count });
    } catch (error) {
      console.error("Error fetching Students count:", error);
      return res.status(500).json({ message: "Internal server error." });
    }
  });
  

  router.put(
    "/updateStudent/:stu_id",
    upload.single("stu_img"),
    async (req, res) => {
      try {
        const stuId = req.params.stu_id;
        const {
          staff_id,
          cls_id,
          scheme,
          stu_name,
          stu_aadhar,
          gender,
          dob,
          van,
          community,
          cast_name,
          religion,
          father_name,
          father_mobile,
          father_occupation,
          father_annual_income,
          mother_name,
          mother_mobile,
          mother_occupation,
          mother_annual_income,
          address,
        } = req.body;
        const stu_img = req.file ? req.file.filename : null;

        if (
          !staff_id ||
          !cls_id ||
          
          !stu_name ||
          !stu_aadhar ||
          !gender ||
          !dob ||
          !van ||
          !community ||
          !cast_name ||
          !religion ||
          !father_name ||
          !father_mobile ||
          !father_occupation ||
          !father_annual_income ||
          !mother_name ||
          !mother_mobile ||
          !mother_occupation ||
          !mother_annual_income ||
          !address
        ) {
          return res.status(400).json({ message: "All fields are required." });
        }

        const existingStudentQuery = `SELECT * FROM students_master WHERE stu_aadhar = ? AND stu_id != ?`;
        const [existingStudentResult] = await db.query(existingStudentQuery, [
          stu_aadhar,
          stuId,
        ]);

        if (existingStudentResult.length > 0) {
          return res
            .status(400)
            .json({
              message: "Student already exists with the same Aadhar number.",
            });
        }

        const currentDate = moment().format("YYYY-MM-DD HH:mm:ss");

        let updateQuery = ``;
        let updateParams = [];

        if (stu_img) {
          updateQuery = `
                    UPDATE students_master 
                    SET staff_id = ?, cls_id = ?, scheme = ?, stu_name = ?, stu_aadhar = ?, stu_img = ?, gender = ?, dob = ?, van=?
                        community = ?, cast_name = ?, religion = ?, father_name = ?, father_mobile = ?, father_occupation = ?, 
                        father_annual_income = ?, mother_name = ?, mother_mobile = ?, mother_occupation = ?, 
                        mother_annual_income = ?, address = ?, updated_at = ? 
                    WHERE stu_id = ?
                `;
          updateParams = [
            staff_id,
            cls_id,
            scheme,
            stu_name,
            stu_aadhar,
            stu_img,
            gender,
            dob,
            van,
            community,
            cast_name,
            religion,
            father_name,
            father_mobile,
            father_occupation,
            father_annual_income,
            mother_name,
            mother_mobile,
            mother_occupation,
            mother_annual_income,
            address,
            currentDate,
            stuId,
          ];
        } else {
          updateQuery = `
                    UPDATE students_master 
                    SET staff_id = ?, cls_id = ?, scheme = ?, stu_name = ?, stu_aadhar = ?, gender = ?, dob = ?, van=?
                        community = ?, cast_name = ?, religion = ?, father_name = ?, father_mobile = ?, father_occupation = ?, 
                        father_annual_income = ?, mother_name = ?, mother_mobile = ?, mother_occupation = ?, 
                        mother_annual_income = ?, address = ?, updated_at = ? 
                    WHERE stu_id = ?
                `;
          updateParams = [
            staff_id,
            cls_id,
            scheme,
            stu_name,
            stu_aadhar,
            gender,
            dob,
            van,
            community,
            cast_name,
            religion,
            father_name,
            father_mobile,
            father_occupation,
            father_annual_income,
            mother_name,
            mother_mobile,
            mother_occupation,
            mother_annual_income,
            address,
            currentDate,
            stuId,
          ];
        }

        const [results] = await db.query(updateQuery, updateParams);

        if (results.affectedRows === 0) {
          return res
            .status(404)
            .json({ message: "Student data not found or no changes made." });
        } else {
          return res
            .status(200)
            .json({ message: "Student data updated successfully." });
        }
      } catch (err) {
        console.log("Error updating student data:", err);
        return res.status(500).json({ message: "Internal server error." });
      }
    }
  );

  router.delete("/deleteStudent/:stuId", async (req, res) => {
    try {
      const stuId = req.params.stuId;
      if (!stuId) {
        return res.status(400).json({ message: "Student ID is required." });
      }
      const deleteQuery = `delete from students_master where stu_id = ?`;
      const [results] = await db.query(deleteQuery, [stuId]);
      if (results.affectedRows === 0) {
        return res
          .status(404)
          .json({ message: "Student data not found or no data deleted" });
      } else {
        return res
          .status(200)
          .json({ message: "Student data deleted successfully." });
      }
    } catch (err) {
      console.log("Error deleting staff data :", err);
      return res.status(500).json({ message: "Internal server error." });
    }
  });

  router.get("/getSiblings", async (req, res) => {
    try {
        const getQuery = `SELECT 
    sm1.*
FROM 
    students_master sm1
JOIN 
    students_master sm2 ON sm1.mother_mobile = sm2.mother_mobile 
                        AND sm1.mother_name = sm2.mother_name 
                        AND sm1.father_name = sm2.father_name 
                        AND sm1.father_mobile = sm2.father_mobile 
                        AND sm1.stu_id != sm2.stu_id
ORDER BY 
    sm1.stu_id ASC`;

                
        const [getResult] = await db.query(getQuery);
        
        const siblingsCount = getResult.length;
        
        if (siblingsCount > 0) {
            const convertData = getResult.map((result)=>({
                ...result,
                stu_img :`http://localhost:3001/uploads/${result.stu_img}`,
            }))
            res.status(200).json({ siblingsCount, siblingsData: convertData });
        } else {
            // No siblings found
            res.status(200).json({ siblingsCount: 0, siblingsData: [] });
        }
    } catch (err) {
        console.log("Error fetching siblings data:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post('/studentsattenance', async (req, res) => {
  try {
      const { stu_id, status, cls_id, date,staff_id } = req.body;

      // Format date as YYYY-MM-DD for MySQL DATE format
      // const date = new Date(dates).toISOString().slice(0, 10);

      console.log(stu_id)
      console.log(status)
      console.log(cls_id)
      console.log(date)
      console.log(staff_id)


      const params = [stu_id, status, cls_id, date,staff_id];
      const postQuery = `INSERT INTO students_attendance (stu_id, status, cls_id,  date,staff_id) VALUES (?, ?, ?, ?,?)`;

      const [results] = await db.query(postQuery, params);

      if (results.affectedRows === 1) {
          return res.status(200).json({ message: "Student data saved successfully." });
      } else {
          return res.status(500).json({ message: "Failed to save student data." });
      }
  } catch (err) {
      console.log("Error saving student data:", err);
      return res.status(500).json({ message: "Internal server error." });
  }
});

router.get(`/detailattenance/:staff_id`,async(req,res)=>{
try{
  const staff_id= req.params.staff_id
  const getQuery = 'select stu.stu_id,stu.date,stu.status,stum.stu_name from students_attendance as stu right join students_master as stum on stu.stu_id = stum.stu_id where stu.staff_id =? '
  const [results] = await db.query(getQuery,staff_id);
  if (results.length == 0) {
    return res.status(404).json({ message: "Students data not found." });
  } else {
   
    
    return res.status(200).json(results);
  }
} catch (error) {
  console.error("Error fetching Students data:", error);
  return res.status(500).json({ message: "Internal server error." });
}

})
router.post('/saveStudentMarks', (req, res) => {
  const { body } = req;

  if (!Array.isArray(body) || body.length === 0) {
    return res.status(400).json({ error: 'Invalid request body' });
  }

  const values = body.map(student => [
    student.stu_id,
    student.stu_name,
    student.examname,
   
    student.tamil !== undefined ? student.tamil : null,
    student.english !== undefined ? student.english : null,
    student.maths !== undefined ? student.maths : null,
    student.science !== undefined ? student.science : null,
    student.social !== undefined ? student.social : null,
    student.total !== undefined ? student.total : 0,
    student.exam_id, // Default to 0 if not provided
  ]);

  const sql = 'INSERT INTO examsandmarks (stu_id, stu_name, examname, tamil, english, maths, science, social, total,exam_id) VALUES ?';

  db.query(sql, [values], (err, result) => {
    if (err) {
      console.error('Error saving marks:', err);
      return res.status(500).json({ error: 'Failed to save marks' });
    }
    console.log('Number of records inserted: ' + result.affectedRows);
    res.status(200).json({ message: 'Marks saved successfully' });
  });
});


router.get(`/examname`,async(req,res)=>{
  try{
    const getQuery=`select  from examsandmarks `
   
    const [results] = await db.query(getQuery);
    if (results.length == 0) {
      return res.status(404).json({ message: "Students data not found." });
    } else {
     
      
      return res.status(200).json(results);
    }
  } catch (error) {
    console.error("Error fetching Students data:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
  
  })


  router.get('/getexamsalloc', async(req, res) => {
    
    try{
     
      const getQuery = 'select * from exam_s '
      const [results] = await db.query(getQuery);
      if (results.length == 0) {
        return res.status(404).json({ message: "Students data not found." });
      } else {
       
        
        return res.status(200).json(results);
      }
    } catch (error) {
      console.error("Error fetching Students data:", error);
      return res.status(500).json({ message: "Internal server error." });
    }
    
    })
    router.get('/examdata/:exam_id', async (req, res) => {
      try {
          const exam_id = req.params.exam_id;
          const getQuery = 'SELECT * FROM examsandmarks WHERE exam_id = ?';
          const [results] = await db.query(getQuery, [exam_id]); // Pass exam_id as an array
          if (results.length === 0) {
              return res.status(404).json({ message: "Exam data not found." });
          } else {
              return res.status(200).json(results);
          }
      } catch (error) {
          console.error("Error fetching back exam data:", error);
          return res.status(500).json({ message: "Internal server error." });
      }
  });

router.get(`/vanattenance/:staff_id`,async(req,res)=>{
  try{
    const staff_id = req.params.staff_id
    const getQuery=`select stu.stu_id,stu.stu_name,stu.van,stu.cls_id,cls.cls_id,cls.staff_id from students_master as stu inner join class_teachers as cls on stu.cls_id = cls.cls_id where cls.staff_id = ? and van = 1`
    const [results]= await db.query(getQuery,staff_id)
    if (results.length == 0) {
      return res.status(404).json({ message: "Students data not found." });
    } else {
     
      
      return res.status(200).json(results);
    }
  } catch (error) {
    console.error("Error fetching van Students  data:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
  
  })
  router.post('/vanattenancepost', async (req, res) => {
    const {staff_id, stu_name, stu_id, cls_id, thatdate, statusn } = req.body;
  
    try {
     
      const query = `
        INSERT INTO van_attenance ( stu_id, cls_id, thatdate, statusn,staff_id,stu_name)
        VALUES ( ?, ?, ?, ?,?,?)
      `;
   const [results]=   await db.query(query, [ stu_id, cls_id, thatdate, statusn,staff_id,stu_name]);
      if (results.affectedRows === 1) {
        return res.status(200).json({ message: "Student data saved successfully." });
    } else {
        return res.status(500).json({ message: "Failed to save student data." });
    }
} catch (err) {
    console.log("Error saving student data:", err);
    return res.status(500).json({ message: "Internal server error." });
}
});


router.get(`/vanattenancedetails/:staff_id`,async(req,res)=>{
  try{
    const staff_id =req.params.staff_id
    const getQuery= `select * from van_attenance where staff_id =?`
    const [results]= await db.query(getQuery,staff_id)
    if (results.length == 0) {
      return res.status(404).json({ message: "vanStudents data not found." });
    } else {
     
      
      return res.status(200).json(results);
    }
  } catch (error) {
    console.error("Error fetching van Students  data:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
  
  })


  router.get('/studentscount', async (req, res) => {
    try {
      const sql = `
        SELECT YEAR(apply_date) AS year, COUNT(*) AS student_count
        FROM students_master
        GROUP BY YEAR(apply_date)
        ORDER BY YEAR(apply_date)
      `;
  
      const [results]= await db.query(sql)
      if (results.length == 0) {
        return res.status(404).json({ message: "vanStudents data not found." });
      } else {
       
        
        return res.status(200).json(results);
      }
    } catch (error) {
      console.error("Error fetching van Students  data:", error);
      return res.status(500).json({ message: "Internal server error." });
    }
    
    })
  
  
return router;

};
