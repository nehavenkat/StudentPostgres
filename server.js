const express = require("express");
const dotenv = require("dotenv");
const listEndpoints = require("express-list-endpoints");

dotenv.config();
const server = express();
const db = require('./db');
const studentRouter= require("./src/routes/students")
// TO POST DATA WE NEED TO USE MIDDLEWARE
server.use(express.json());
server.use('/students',studentRouter)
//route for server
server.get('/',async (req,res) =>
{
const response = await db.query("SELECT * FROM student")
res.send(response.rows)
}
)
console.log(listEndpoints(server));

server.listen(process.env.PORT, () =>console.log(`Server is listening on ${process.env.PORT}`))// install dotenv
