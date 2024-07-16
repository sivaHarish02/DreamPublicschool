// const express = require("express");
// const router = express.Router();
// const moment = require("moment");
// const currentDate = moment().format("YYYY-MM-DD HH:mm:ss");
// module.exports = (db) => {
//   router.post("/saveFeesAllocation", async (req, res) => {
//     try {
//       const { roll_no, academic_year, fee_category, amount } = req.body;
//       if (!roll_no) {
//         return res.status(400).json({ message: "Roll number is required." });
//       }
//       if (!academic_year) {
//         return res.status(400).json({ message: "Academic year is required." });
//       }
//       if (!fee_category) {
//         return res.status(400).json({ message: "Fee category is required." });
//       }
//       if (!amount) {
//         return res.status(400).json({ message: "Amount is required." });
//       }
//       const rollNoCheckQuery = `
//                 SELECT COUNT(*) AS count 
//                 FROM students_allocation 
//                 WHERE roll_no = ? AND academic_year = ?
//             `;
//       const [rollNoCheckResults] = await db.query(rollNoCheckQuery, [
//         roll_no,
//         academic_year,
//       ]);
//       if (rollNoCheckResults[0].count === 1) {
//         const checkFeesForRollQuery = `
//                     SELECT COUNT(*) AS count 
//                     FROM fees_allocation 
//                     WHERE roll_no = ? AND academic_year = ? AND fee_category = ?
//                 `;
//         const [checkFeesForRollResults] = await db.query(
//           checkFeesForRollQuery,
//           [roll_no, academic_year, fee_category]
//         );

//         if (checkFeesForRollResults[0].count > 0) {
//           return res.status(400).json({
//             message: `Roll number ${roll_no} is already allocated this fee category (${fee_category}) for the academic year ${academic_year}.`,
//           });
//         } else {
//           const insertQuery = `
//                         INSERT INTO fees_allocation (roll_no, academic_year, fee_category, amount,remaining_amount, created_at) 
//                         VALUES (?, ?, ?, ?, ?, ?)
//                     `;
//           await db.query(insertQuery, [
//             roll_no,
//             academic_year,
//             fee_category,
//             amount,
//             amount,
//             currentDate,
//           ]);

//           return res
//             .status(200)
//             .json({ message: "Fees allocation saved successfully." });
//         }
//       } else {
//         return res.status(404).json({
//           message: "Roll number not found for the given academic year.",
//         });
//       }
//     } catch (err) {
//       console.error("Error saving fees allocation data:", err);
//       return res.status(500).json({ message: "Internal server error." });
//     }
//   });

//   router.post("/saveFeesAllocationForClass", async (req, res) => {
//     const connection = await db.getConnection();
//     await connection.beginTransaction();
  
//     try {
//       const feesAllocations = req.body; // Assuming req.body is an array of fees allocation objects
  
//       if (!Array.isArray(feesAllocations) || feesAllocations.length === 0) {
//         return res.status(400).json({ message: "No fees allocations provided." });
//       }
  
//       for (const allocation of feesAllocations) {
//         const { roll_no, academic_year, fee_category, amount } = allocation;
  
//         if (!roll_no || !academic_year || !fee_category || !amount) {
//           await connection.rollback();
//           return res.status(400).json({ message: "All fields are required." });
//         }
  
//         const rollNoCheckQuery = `
//           SELECT COUNT(*) AS count 
//           FROM students_allocation 
//           WHERE roll_no = ? AND academic_year = ?
//         `;
//         const [rollNoCheckResults] = await connection.query(rollNoCheckQuery, [roll_no, academic_year]);
  
//         if (rollNoCheckResults[0].count !== 1) {
//           await connection.rollback();
//           return res.status(404).json({ message: `Roll number ${roll_no} not found for the given academic year.` });
//         }
  
//         const checkFeesForRollQuery = `
//           SELECT COUNT(*) AS count 
//           FROM fees_allocation 
//           WHERE roll_no = ? AND academic_year = ? AND fee_category = ?
//         `;
//         const [checkFeesForRollResults] = await connection.query(checkFeesForRollQuery, [roll_no, academic_year, fee_category]);
  
//         if (checkFeesForRollResults[0].count > 0) {
//           await connection.rollback();
//           return res.status(400).json({ message: `Roll number ${roll_no} is already allocated this fee category (${fee_category}) for the academic year ${academic_year}.` });
//         }
  
//         const insertQuery = `
//           INSERT INTO fees_allocation (roll_no, academic_year, fee_category, amount, remaining_amount, created_at) 
//           VALUES (?, ?, ?, ?, ?, ?)
//         `;
//         await connection.query(insertQuery, [roll_no, academic_year, fee_category, amount, amount, new Date()]);
//       }
  
//       await connection.commit();
//       return res.status(200).json({ message: "Fees allocations saved successfully." });
//     } catch (err) {
//       await connection.rollback();
//       console.error("Error saving fees allocation data:", err);
//       return res.status(500).json({ message: "Internal server error." });
//     } finally {
//       connection.release();
//     }
//   });

//   router.get("/getclassessforfess",async(req,res)=>{
//     try{
//       const getQuery = 'select * from class';
//       const [results] = await db.query(getQuery)
//       if (results.length == 0) {
//       return res
//         .status(404)
//         .json({ message: "class data from Classtable not found." });
//     } else {
      
//       return res.status(200).json(results);
//     }
//   } catch (error) {
//     console.error("Error fetching Fees Allocation data:", error);
//     return res.status(500).json({ message: "Internal server error." });
//   }
//   })



//   router.post('/feesallocationforclass', async (req, res) => {
//     try {
//       const { cls_id, tution_fees } = req.body;
  
//       // Validate incoming data if necessary
  
//       // Example query to update tuition fees based on class id
//       const updateQuery = `UPDATE class SET tution_fees = ? WHERE cls_id = ?`;
  
//       // Assuming you have a database connection and `db` object initialized
//       db.query(updateQuery, [tution_fees, cls_id], (err, result) => {
//         if (err) {
//           console.error('Error updating tuition fees:', err);
//           res.status(500).json({ message: 'Failed to update tuition fees' });
//           return;
//         }
//         console.log('Tuition fees updated successfully');
//         res.status(200).json({ message: 'Tuition fees updated successfully' });
//       });
//     } catch (error) {
//       console.error('Error in fees allocation:', error);
//       res.status(500).json({ message: 'Internal server error' });
//     }
//   });
  
//   router.get(`/tutionfeesget/:cls_id`,async(req,res)=>{

//     try{
       
//       const cls_id = req.params.cls_id

//       const getQuery = `select stu.*,cls.tution_fees from students_master as stu inner join 
// class as cls on stu.cls_id = cls.cls_id where cls.cls_id = ?`
// const [results] = await db.query(getQuery,[cls_id]);
//       if (results.length == 0) {
//         return res.status(404).json({ message: "Students data not found." });
//       } else {
//         const convertData = results.map((result) => ({
//           ...result,
//           stu_img: `http://localhost:3001/uploads/${result.stu_img}`,
//         }));
//         return res.status(200).json(convertData);
//       }
//     } catch (error) {
//       console.error("Error fetching Students data:", error);
//       return res.status(500).json({ message: "Internal server error." });
//     }
//   });

//   router.put(`/allfeesalloc/:stu_id`,async(req,res)=>{
//     try{
//       const {tution_fees,transport_fees,additional_fees,discount,total_fees}= req.body
//       console.log(tution_fees)
//       console.log(transport_fees)
//       console.log(additional_fees)
//       console.log(discount)
//       console.log(total_fees)
     
//       const stu_id = req.params.stu_id
//       const putQuery =`update students_master set tution_fees =? ,transport_fees =?, additional_fees=? ,discount=?,total_fees=? where stu_id =?`
//       const [results] = await db.query(putQuery, [tution_fees,transport_fees,additional_fees,discount,total_fees,stu_id]);

//       if (results.affectedRows === 0) {
//         return res
//           .status(404)
//           .json({ message: "Student data not found or no changes made." });
//       } else {
//         return res
//           .status(200)
//           .json({ message: "Student data updated successfully." });
//       }
//     } catch (err) {
//       console.log("Error updating student data:", err);
//       return res.status(500).json({ message: "Internal server error." });
//     }

    
//   })
//   router.get(`/getpayfess/:stu_id`,async (req,res)=>{
//     try {
//       const stu_id = req.params.stu_id
//       console.log(stu_id)
//       const getQuery = `select * from students_master where stu_id =?`
//       const [results] = await db.query(getQuery,[stu_id]);
//       if (results.length == 0) {
//         return res.status(404).json({ message: "Students data not found." });
//       } else {
//         const convertData = results.map((result) => ({
//           ...result,
//           stu_img: `http://localhost:3001/uploads/${result.stu_img}`,
//         }));
//         return res.status(200).json(convertData);
//       }
//     } catch (error) {
//       console.error("Error fetching Students data:", error);
//       return res.status(500).json({ message: "Internal server error." });
//     }
//   });

//   router.get("/getFeesAllocation", async (req, res) => {
//     try {
//       const getQuery = `
//     SELECT 
//     fee_all.fees_id,
//     fee_all.roll_no,
//     fee_all.academic_year,
//     fee_all.fee_category,
//     fee_all.amount,
//     fee_all.remaining_amount,
//     stu.stu_name,
//     stu.stu_img,
//     cls.cls_name,
//     sec.sec_name
// FROM 
//     fees_allocation fee_all
// INNER JOIN 
//     students_allocation stu_all ON stu_all.roll_no = fee_all.roll_no
// INNER JOIN 
//     students_master stu ON stu.stu_id = stu_all.stu_id
// INNER JOIN 
//     class_allocation cls_all ON cls_all.cls_allocation_id = stu_all.cls_allocation_id
// INNER JOIN 
//     class cls ON cls.cls_id = cls_all.cls_id
// INNER JOIN 
//     sections sec ON sec.sec_id = cls_all.sec_id`;
//       const [results] = await db.query(getQuery);
//       if (results.length == 0) {
//         return res
//           .status(404)
//           .json({ message: "Fees Allocation data not found." });
//       } else {
//         const convertData = results.map((result) => ({
//           ...result,
//           stu_img: `http://localhost:3001/uploads/${result.stu_img}`,
//         }));
//         return res.status(200).json(convertData);
//       }
//     } catch (error) {
//       console.error("Error fetching Fees Allocation data:", error);
//       return res.status(500).json({ message: "Internal server error." });
//     }
//   });

//   router.put("/updateFeesAllocation/:fees_id", async (req, res) => {
//     try {
//       const feeId = req.params.fees_id;
//       const { roll_no, academic_year, fee_category, amount } = req.body;
//       if (!roll_no) {
//         return res.status(400).json({ message: "Roll number is required." });
//       }
//       if (!academic_year) {
//         return res.status(400).json({ message: "Academic year is required." });
//       }
//       if (!fee_category) {
//         return res.status(400).json({ message: "Fee category is required." });
//       }
//       if (!amount) {
//         return res.status(400).json({ message: "Amount is required." });
//       }
//       const rollNoCheckQuery = `
//                 SELECT COUNT(*) AS count 
//                 FROM students_allocation 
//                 WHERE roll_no = ? AND academic_year = ?
//             `;
//       const [rollNoCheckResults] = await db.query(rollNoCheckQuery, [
//         roll_no,
//         academic_year,
//       ]);
//       if (rollNoCheckResults[0].count === 1) {
//         const checkFeesForRollQuery = `
//                     SELECT COUNT(*) AS count 
//                     FROM fees_allocation 
//                     WHERE roll_no = ? AND academic_year = ? AND fee_category = ? and fees_id !=?
//                 `;
//         const [checkFeesForRollResults] = await db.query(
//           checkFeesForRollQuery,
//           [roll_no, academic_year, fee_category, feeId]
//         );

//         if (checkFeesForRollResults[0].count > 0) {
//           return res.status(400).json({
//             message: `Roll number ${roll_no} is already allocated this fee category (${fee_category}) for the academic year ${academic_year}.`,
//           });
//         } else {
//           const insertQuery = `
//                         update fees_allocation set roll_no = ?,academic_year = ?, fee_category = ?, amount = ? ,updated_at =? where fees_id = ?
//                     `;
//           await db.query(insertQuery, [
//             roll_no,
//             academic_year,
//             fee_category,
//             amount,
//             currentDate,
//             feeId,
//           ]);

//           return res
//             .status(200)
//             .json({ message: "Fees allocation Updated successfully." });
//         }
//       } else {
//         return res.status(404).json({
//           message: "Roll number not found for the given academic year.",
//         });
//       }
//     } catch (err) {
//       console.log("Error update fees allocation data :", err);
//       return res.status(500).json({ message: "Internal server error." });
//     }
//   });

//   router.delete("/deleteFeesAllocation/:fees_id", async (req, res) => {
//     try {
//       const feeId = req.params.fees_id;
//       if (!feeId) {
//         return res.status(400).json({ message: "Fees ID is required." });
//       }
//       const deleteQuery = `delete from fees_allocation where fees_id = ?`;
//       const [results] = await db.query(deleteQuery, [feeId]);
//       if (results.affectedRows === 0) {
//         return res.status(404).json({
//           message: "Fees Allocation data not found or no data deleted",
//         });
//       } else {
//         return res
//           .status(200)
//           .json({ message: "Fees Allocation deleted successfully." });
//       }
//     } catch (err) {
//       console.log("Error delete fees allocation data :", err);
//       return res.status(500).json({ message: "Internal server error." });
//     }
//   });
// router.get(`/payfeestud/:stu_id`,async(req,res)=>{
//   try{
//     const stu_id = req.params.stu_id
//     const getQuery= `SELECT stu.*, col.remainingfee,cls.cls_name
// FROM students_master AS stu
// INNER JOIN (
//     SELECT stu_id, MAX(feeslogid) AS max_feeslogid
//     FROM collect_fee
//     GROUP BY stu_id
// ) AS latest_fee
// ON stu.stu_id = latest_fee.stu_id
// INNER JOIN collect_fee AS col
// ON col.stu_id = latest_fee.stu_id AND col.feeslogid = latest_fee.max_feeslogid
// inner join class as cls on stu.cls_id = cls.cls_id
// WHERE stu.stu_id = ?
// `
//     const [results] = await db.query(getQuery,[stu_id]);
//     if (results.length == 0) {
//       return res
//         .status(404)
//         .json({ message: "Fees Allocation data not found." });
//     } else {
//       const convertData = results.map((result) => ({
//         ...result,
//         stu_img: `http://localhost:3001/uploads/${result.stu_img}`,
//       }));
//       return res.status(200).json(convertData);
//     }
//   } catch (error) {
//     console.error("Error fetching Fees Allocation data:", error);
//     return res.status(500).json({ message: "Internal server error." });
//   }
// });

// router.post(`/feeslogdata`,async(req,res)=>{
//   try{
//     const {stu_id,stu_name,payingfee,remainingfee,feedate} =req.body
//     const insertQuery = `insert into collect_fee (stu_id,stu_name,payingfee,remainingfee,feedate) values (?,?,?,?,?)`
//     db.query(insertQuery, [stu_id,stu_name,payingfee,remainingfee,feedate], (err, result) => {
//       if (err) {
//         console.error('Error updating  fees log:', err);
//         res.status(500).json({ message: 'Failed to update tuition fees' });
//         return;
//       }
//       console.log(' fees log updated successfully');
//       res.status(200).json({ message: 'Tuition fees updated successfully' });
//     });
//   } catch (error) {
//     console.error('Error in feeslog:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });

// router.get(`/feesslipprint/:feeslogid`, async (req, res) => {
//   try {
//     const feeslogid = req.params.feeslogid;
//     const getQuery = `select col.*,stu.cls_id,cls.cls_id,cls.cls_name from collect_fee as col inner join 
// students_master as stu on col.stu_id = stu.stu_id inner join class as cls on stu.cls_id = cls.cls_id where col.stu_id =?`;

//     const [results] = await db.query(getQuery, [feeslogid]);

//     if (results.length === 0) {
//       return res.status(404).json({ message: "Fees log data not found." });
//     } else {
//       return res.status(200).json(results); // Return only the first (and only) result
//     }
//   } catch (error) {
//     console.error("Error fetching Fees log data:", error);
//     return res.status(500).json({ message: "Internal server error." });
//   }
// });
// router.get(`/feesslip/:stu_id`, async (req, res) => {
//   try {
//     const stu_id = req.params.stu_id;
//     const getQuery = `SELECT col.* ,cls.cls_id,FROM collect_fee WHERE stu_id = ?`;

//     const [results] = await db.query(getQuery, [stu_id]);

//     if (results.length === 0) {
//       return res.status(404).json({ message: "Fees log data not found." });
//     } else {
//       return res.status(200).json(results); // Return only the first (and only) result
//     }
//   } catch (error) {
//     console.error("Error fetching Fees log data:", error);
//     return res.status(500).json({ message: "Internal server error." });
//   }
// });


//   return router;
// };







const express = require("express");
const router = express.Router();
const moment = require("moment");
const currentDate = moment().format("YYYY-MM-DD HH:mm:ss");
module.exports = (db) => {
  router.post("/saveFeesAllocation", async (req, res) => {
    try {
      const { roll_no, academic_year, fee_category, amount } = req.body;
      if (!roll_no) {
        return res.status(400).json({ message: "Roll number is required." });
      }
      if (!academic_year) {
        return res.status(400).json({ message: "Academic year is required." });
      }
      if (!fee_category) {
        return res.status(400).json({ message: "Fee category is required." });
      }
      if (!amount) {
        return res.status(400).json({ message: "Amount is required." });
      }
      const rollNoCheckQuery = `
                SELECT COUNT(*) AS count 
                FROM students_allocation 
                WHERE roll_no = ? AND academic_year = ?
            `;
      const [rollNoCheckResults] = await db.query(rollNoCheckQuery, [
        roll_no,
        academic_year,
      ]);
      if (rollNoCheckResults[0].count === 1) {
        const checkFeesForRollQuery = `
                    SELECT COUNT(*) AS count 
                    FROM fees_allocation 
                    WHERE roll_no = ? AND academic_year = ? AND fee_category = ?
                `;
        const [checkFeesForRollResults] = await db.query(
          checkFeesForRollQuery,
          [roll_no, academic_year, fee_category]
        );

        if (checkFeesForRollResults[0].count > 0) {
          return res.status(400).json({
            message: `Roll number ${roll_no} is already allocated this fee category (${fee_category}) for the academic year ${academic_year}.`,
          });
        } else {
          const insertQuery = `
                        INSERT INTO fees_allocation (roll_no, academic_year, fee_category, amount,remaining_amount, created_at) 
                        VALUES (?, ?, ?, ?, ?, ?)
                    `;
          await db.query(insertQuery, [
            roll_no,
            academic_year,
            fee_category,
            amount,
            amount,
            currentDate,
          ]);

          return res
            .status(200)
            .json({ message: "Fees allocation saved successfully." });
        }
      } else {
        return res.status(404).json({
          message: "Roll number not found for the given academic year.",
        });
      }
    } catch (err) {
      console.error("Error saving fees allocation data:", err);
      return res.status(500).json({ message: "Internal server error." });
    }
  });

  router.post("/saveFeesAllocationForClass", async (req, res) => {
    const connection = await db.getConnection();
    await connection.beginTransaction();
  
    try {
      const feesAllocations = req.body; // Assuming req.body is an array of fees allocation objects
  
      if (!Array.isArray(feesAllocations) || feesAllocations.length === 0) {
        return res.status(400).json({ message: "No fees allocations provided." });
      }
  
      for (const allocation of feesAllocations) {
        const { roll_no, academic_year, fee_category, amount } = allocation;
  
        if (!roll_no || !academic_year || !fee_category || !amount) {
          await connection.rollback();
          return res.status(400).json({ message: "All fields are required." });
        }
  
        const rollNoCheckQuery = `
          SELECT COUNT(*) AS count 
          FROM students_allocation 
          WHERE roll_no = ? AND academic_year = ?
        `;
        const [rollNoCheckResults] = await connection.query(rollNoCheckQuery, [roll_no, academic_year]);
  
        if (rollNoCheckResults[0].count !== 1) {
          await connection.rollback();
          return res.status(404).json({ message: `Roll number ${roll_no} not found for the given academic year.` });
        }
  
        const checkFeesForRollQuery = `
          SELECT COUNT(*) AS count 
          FROM fees_allocation 
          WHERE roll_no = ? AND academic_year = ? AND fee_category = ?
        `;
        const [checkFeesForRollResults] = await connection.query(checkFeesForRollQuery, [roll_no, academic_year, fee_category]);
  
        if (checkFeesForRollResults[0].count > 0) {
          await connection.rollback();
          return res.status(400).json({ message: `Roll number ${roll_no} is already allocated this fee category (${fee_category}) for the academic year ${academic_year}.` });
        }
  
        const insertQuery = `
          INSERT INTO fees_allocation (roll_no, academic_year, fee_category, amount, remaining_amount, created_at) 
          VALUES (?, ?, ?, ?, ?, ?)
        `;
        await connection.query(insertQuery, [roll_no, academic_year, fee_category, amount, amount, new Date()]);
      }
  
      await connection.commit();
      return res.status(200).json({ message: "Fees allocations saved successfully." });
    } catch (err) {
      await connection.rollback();
      console.error("Error saving fees allocation data:", err);
      return res.status(500).json({ message: "Internal server error." });
    } finally {
      connection.release();
    }
  });

  router.get("/getclassessforfess",async(req,res)=>{
    try{
      const getQuery = 'select * from class';
      const [results] = await db.query(getQuery)
      if (results.length == 0) {
      return res
        .status(404)
        .json({ message: "class data from Classtable not found." });
    } else {
      
      return res.status(200).json(results);
    }
  } catch (error) {
    console.error("Error fetching Fees Allocation data:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
  })



  router.post('/feesallocationforclass', async (req, res) => {
    try {
      const { cls_id, tution_fees } = req.body;
  
      // Validate incoming data if necessary
  
      // Example query to update tuition fees based on class id
      const updateQuery = `UPDATE class SET tution_fees = ? WHERE cls_id = ?`;
  
      // Assuming you have a database connection and db object initialized
      db.query(updateQuery, [tution_fees, cls_id], (err, result) => {
        if (err) {
          console.error('Error updating tuition fees:', err);
          res.status(500).json({ message: 'Failed to update tuition fees' });
          return;
        }
        console.log('Tuition fees updated successfully');
        res.status(200).json({ message: 'Tuition fees updated successfully' });
      });
    } catch (error) {
      console.error('Error in fees allocation:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  router.get(`/tutionfeesget/:cls_id`,async(req,res)=>{

    try{
       
      const cls_id = req.params.cls_id

      const getQuery = `select stu.*,cls.tution_fees from students_master as stu inner join 
class as cls on stu.cls_id = cls.cls_id where cls.cls_id = ?`
const [results] = await db.query(getQuery,[cls_id]);
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

  router.put(`/allfeesalloc/:stu_id`,async(req,res)=>{
    try{
      const {tution_fees,transport_fees,additional_fees,discount,total_fees}= req.body
      console.log(tution_fees)
      console.log(transport_fees)
      console.log(additional_fees)
      console.log(discount)
      console.log(total_fees)
     
      const stu_id = req.params.stu_id
      const putQuery =`update students_master set tution_fees =? ,transport_fees =?, additional_fees=? ,discount=?,total_fees=? where stu_id =?`
      const [results] = await db.query(putQuery, [tution_fees,transport_fees,additional_fees,discount,total_fees,stu_id]);

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

    
  })
  router.get(`/getpayfess/:stu_id`,async (req,res)=>{
    try {
      const stu_id = req.params.stu_id
      console.log(stu_id)
      const getQuery = `select * from students_master where stu_id =?`
      const [results] = await db.query(getQuery,[stu_id]);
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

  router.get("/getFeesAllocation", async (req, res) => {
    try {
      const getQuery = `
    SELECT 
    fee_all.fees_id,
    fee_all.roll_no,
    fee_all.academic_year,
    fee_all.fee_category,
    fee_all.amount,
    fee_all.remaining_amount,
    stu.stu_name,
    stu.stu_img,
    cls.cls_name,
    sec.sec_name
FROM 
    fees_allocation fee_all
INNER JOIN 
    students_allocation stu_all ON stu_all.roll_no = fee_all.roll_no
INNER JOIN 
    students_master stu ON stu.stu_id = stu_all.stu_id
INNER JOIN 
    class_allocation cls_all ON cls_all.cls_allocation_id = stu_all.cls_allocation_id
INNER JOIN 
    class cls ON cls.cls_id = cls_all.cls_id
INNER JOIN 
    sections sec ON sec.sec_id = cls_all.sec_id`;
      const [results] = await db.query(getQuery);
      if (results.length == 0) {
        return res
          .status(404)
          .json({ message: "Fees Allocation data not found." });
      } else {
        const convertData = results.map((result) => ({
          ...result,
          stu_img: `http://localhost:3001/uploads/${result.stu_img}`,
        }));
        return res.status(200).json(convertData);
      }
    } catch (error) {
      console.error("Error fetching Fees Allocation data:", error);
      return res.status(500).json({ message: "Internal server error." });
    }
  });

  router.put("/updateFeesAllocation/:fees_id", async (req, res) => {
    try {
      const feeId = req.params.fees_id;
      const { roll_no, academic_year, fee_category, amount } = req.body;
      if (!roll_no) {
        return res.status(400).json({ message: "Roll number is required." });
      }
      if (!academic_year) {
        return res.status(400).json({ message: "Academic year is required." });
      }
      if (!fee_category) {
        return res.status(400).json({ message: "Fee category is required." });
      }
      if (!amount) {
        return res.status(400).json({ message: "Amount is required." });
      }
      const rollNoCheckQuery = `
                SELECT COUNT(*) AS count 
                FROM students_allocation 
                WHERE roll_no = ? AND academic_year = ?
            `;
      const [rollNoCheckResults] = await db.query(rollNoCheckQuery, [
        roll_no,
        academic_year,
      ]);
      if (rollNoCheckResults[0].count === 1) {
        const checkFeesForRollQuery = `
                    SELECT COUNT(*) AS count 
                    FROM fees_allocation 
                    WHERE roll_no = ? AND academic_year = ? AND fee_category = ? and fees_id !=?
                `;
        const [checkFeesForRollResults] = await db.query(
          checkFeesForRollQuery,
          [roll_no, academic_year, fee_category, feeId]
        );

        if (checkFeesForRollResults[0].count > 0) {
          return res.status(400).json({
            message: `Roll number ${roll_no} is already allocated this fee category (${fee_category}) for the academic year ${academic_year}.`,
          });
        } else {
          const insertQuery = `
                        update fees_allocation set roll_no = ?,academic_year = ?, fee_category = ?, amount = ? ,updated_at =? where fees_id = ?
                    `;
          await db.query(insertQuery, [
            roll_no,
            academic_year,
            fee_category,
            amount,
            currentDate,
            feeId,
          ]);

          return res
            .status(200)
            .json({ message: "Fees allocation Updated successfully." });
        }
      } else {
        return res.status(404).json({
          message: "Roll number not found for the given academic year.",
        });
      }
    } catch (err) {
      console.log("Error update fees allocation data :", err);
      return res.status(500).json({ message: "Internal server error." });
    }
  });

  router.delete("/deleteFeesAllocation/:fees_id", async (req, res) => {
    try {
      const feeId = req.params.fees_id;
      if (!feeId) {
        return res.status(400).json({ message: "Fees ID is required." });
      }
      const deleteQuery = `delete from fees_allocation where fees_id = ?`;
      const [results] = await db.query(deleteQuery, [feeId]);
      if (results.affectedRows === 0) {
        return res.status(404).json({
          message: "Fees Allocation data not found or no data deleted",
        });
      } else {
        return res
          .status(200)
          .json({ message: "Fees Allocation deleted successfully." });
      }
    } catch (err) {
      console.log("Error delete fees allocation data :", err);
      return res.status(500).json({ message: "Internal server error." });
    }
  });
router.get(`/payfeestud/:stu_id`,async(req,res)=>{
  try{
    const stu_id = req.params.stu_id
   const getQuery= `SELECT stu.*, cls.cls_name
FROM students_master AS stu

inner join class as cls on stu.cls_id = cls.cls_id
WHERE stu.stu_id = ?`
    const [results] = await db.query(getQuery,[stu_id]);
    console.log({results})
    if (results.length == 0) {
      return res
        .status(404)
        .json({ message: "Fees Allocation data not found." });
    } else {
      const convertData = results.map((result) => ({
        ...result,
        stu_img: `http://localhost:3001/uploads/${result.stu_img}`,
      }));
      return res.status(200).json(convertData);
    }
  } catch (error) {
    console.error("Error fetching Fees Allocation data:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
});

router.post(`/feeslogdata`,async(req,res)=>{
  try{
    const {stu_id,stu_name,payingfee,remainingfee,feedate} =req.body
    const insertQuery = `insert into collect_fee (stu_id,stu_name,payingfee,remainingfee,feedate) values (?,?,?,?,?)`
    db.query(insertQuery, [stu_id,stu_name,payingfee,remainingfee,feedate], (err, result) => {
      if (err) {
        console.error('Error updating  fees log:', err);
        res.status(500).json({ message: 'Failed to update tuition fees' });
        return;
      }
      console.log(' fees log updated successfully');
      res.status(200).json({ message: 'Tuition fees updated successfully' });
    });
  } catch (error) {
    console.error('Error in feeslog:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get(`/feesslipprint/:feeslogid`, async (req, res) => {
  try {
    const feeslogid = req.params.feeslogid;
    const getQuery = `select col.*,stu.cls_id,cls.cls_id,cls.cls_name from collect_fee as col inner join 
students_master as stu on col.stu_id = stu.stu_id inner join class as cls on stu.cls_id = cls.cls_id where col.stu_id =?`;

    const [results] = await db.query(getQuery, [feeslogid]);

    if (results.length === 0) {
      return res.status(404).json({ message: "Fees log data not found." });
    } else {
      return res.status(200).json(results); // Return only the first (and only) result
    }
  } catch (error) {
    console.error("Error fetching Fees log data:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
});
router.get(`/feesslip/:stu_id`, async (req, res) => {
  try {
    const stu_id = req.params.stu_id;
    const getQuery = `SELECT col.* ,cls.cls_id,FROM collect_fee WHERE stu_id = ?`;

    const [results] = await db.query(getQuery, [stu_id]);

    if (results.length === 0) {
      return res.status(404).json({ message: "Fees log data not found." });
    } else {
      return res.status(200).json(results); // Return only the first (and only) result
    }
  } catch (error) {
    console.error("Error fetching Fees log data:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
});


  return router;
};