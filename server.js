const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const server = express();
const db = require('./db');


//route for server
server.get('/',async (req,res) =>
{
  const response = await db.query("SELECT * FROM student")
  res.send(response.rows)
}
 )



server.listen(process.env.PORT, () =>console.log(`Server is listening on ${process.env.PORT}`))// install dotenv
