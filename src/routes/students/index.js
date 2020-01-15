const express = require("express")
const db= require("../../../db")

const router = express.Router()

router.get('/', async (req,res)=> {
    const students = await db.query("SELECT * FROM student")
   res.send(students.rows);

})
//avoiding SQL Injection  we are using Parameters//Sanification
router.get('/:id', async (req,res)=> {
    try {
        const students = await db.query(`SELECT * FROM student WHERE _id =$1`, [req.params.id])
        if (students.rowCount === 0)
               return res.status(404).send("Not Found");
        else
               return res.send(students.rows[0])
    } catch (error) {
        res.status(500).send(error)    
    }
})

router.post('/', async (req,res) => {
try {
    const result = await db.query(`INSERT INTO student (_id,name,surname,email,dob)
                                   VALUES($1,$2,$3,$4,$5)
                                   RETURNING *`,
                                   [req.body._id, req.body.name,req.body.surname,req.body.email,req.body.dob])
    res.send(result.rows[0])                               
} catch (error) {
    res.status(500).send(error)
}
})
router.put("/:id", async (req, res) => {
    try {
        const result = await db.query(`UPDATE student SET 
                                       name= $1,
                                       surname = $2,
                                       email= $3,
                                       dob= $4 
                                       WHERE _id= $5`,
            [req.body.name, req.body.surname, req.body.email, req.body.dob, req.params.id]);

        if (result.rowCount === 0)
            res.status(404).send("not found")
        else
            res.send("OK")
    }
    catch (ex) {
        res.status(500).send(ex)
    }
})


router.delete("/:id", async (req, res) => {
    try {
        const result = await db.query(`DELETE FROM student WHERE _id = $1`, [req.params.id])

        if (result.rowCount === 0)
            res.status(404).send("not found")
        else
            res.send("OK")
    }
    catch (ex) {
        res.status(500).send(ex)
    }
})


module.exports = router;