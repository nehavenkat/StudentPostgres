const express = require("express")
const db= require("../../../db")

const router = express.Router()

router.get('/', async (req,res)=> {
    const students = await db.query("SELECT * FROM student")
   res.send(students.rows);

})
//avoiding SQL Injection  we are using Parameters//Sanification
//
router.get('/:id', async (req,res)=> {
    try {
        const students = await db.query(`SELECT * FROM student WHERE _id =$1`, [req.params.id])
        if (students.rowCount === 0)
               return res.status(404).send("Not Found");
        else
               return res.send(students.rows[0])
    } catch (error) {
        res.status(500).send(ex)
        
    }
   
})


module.exports = router;