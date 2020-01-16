const express = require("express")
const db = require("../../../db")

const router = express.Router()

router.get("/", async (req, res) => {
    let query = "SELECT * FROM student";
    const limit = req.query.limit; 
    const offset = req.query.offset;
    const sort = req.query.sort;
    
    delete req.query.limit
    delete req.query.offset
    delete req.query.sort

    const params = [ limit, offset ]  

    let i = 0;
    for (var propName in req.query) { 
        query += i === 0 ?  " WHERE " : " AND " 
        query += propName + " = $" + (i + 3) 
        params.push(req.query[propName]) 
        i++;
    }

    if (sort)
        query += ' ORDER BY name ' + ((sort === "desc") ? "DESC" : "ASC");
        query += ' LIMIT $1 OFFSET $2' 

    try {
        const  = await db.query(query, params)
        res.send(students.rows)
    }
    catch (ex) {
        res.status(500).send(ex)
    }
})

//avoiding SQL Injection  we are using Parameters//Sanification
router.get('/:id', async (req, res) => {
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

//  GET students/:id/projects => returns a list of projects in which also the info from the students appears (use JOIN to retrieve those info)
router.get('/:id/projects', async (req, res) => {
    try {
        const students = await db.query(`SELECT * FROM project JOIN student ON student_id=student._id WHERE student._id =$1`, [req.params.id])
        if (students.rowCount === 0)
            return res.status(404).send("NOT FOUND");
        else
            return res.send(students.rows[0])
    } catch (error) {
        res.status(500).send(error)
    }
})


router.post('/', async (req, res) => {
    try {
        const result = await db.query(`INSERT INTO student (_id,name,surname,email,dob)
                                   VALUES($1,$2,$3,$4,$5)
                                   RETURNING *`,
            [req.body._id, req.body.name, req.body.surname, req.body.email, req.body.dob])
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