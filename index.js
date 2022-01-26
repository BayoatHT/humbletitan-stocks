const AWS = require('aws-sdk')
require('dotenv').config()
const express = require('express')
var path = require("path");
const app = express()
app.use(express.static(path.join(__dirname, './')));



AWS.config.update({ region: 'us-east-1' });
 

 app.get('/',(req,res)=>{
   res.send("GUDDI CHUTIYA")
 })

 app.get('/mudassir',(req,res)=>{
   res.json({
     "Guddi":"Bhrwa"
   })
 })

app.listen(process.env.PORT || 3000, () => {
  console.log(`listening on port`)
})