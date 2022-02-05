const express = require('express');
const axios = require('axios');
const { response } = require('express');

const app = express()

app.get('/filtered',(req,res)=>{
    // const {label,value} = req.query 
    // axios.get('https://humbletitanapi.herokuapp.com/alltickersort')
    // .then(response=> res.json(getDataEqualTo(response)))
    // .catch(madarchod=>console.log(madarchod.message)) 
    // const getDataEqualTo=(response)=>{
    //    const filtered= []
    //     response.data.map(item=>{ 
    //         item.Info[label]  > value && filtered.push(item)
    //     })
    //     return filtered
    // } 
    const myArray =[]
    axios.get('https://humbletitanapi.herokuapp.com/alltickersort')
    .then(response=> res.json(getDataEqualTo(myArray)))
    .catch(madarchod=>console.log(madarchod.message)) 
    const getDataEqualTo=(arrayName)=>{
        arrayName.push("chutiya")
        return arrayName
    }
 
    
})


app.listen(8080,()=>console.log("chuk"))


