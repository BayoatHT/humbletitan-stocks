const express = require('express');
const axios = require('axios');
const { response } = require('express');

const app = express()

app.get('/filtered',(req,res)=>{
    const {label,value} = req.query 
    axios.get('https://humbletitanapi.herokuapp.com/alltickersort')
    .then(response=> res.json(getDataEqualTo(response)))
    .catch(madarchod=>console.log(madarchod.message)) 
    const getDataEqualTo=(response)=>{
       const filtered= []
        response.data.map(item=>{ 
            // let valueSearched =  +value;
            // let valueOfItem = +item.Info[label]
            // valueOfItem   < valueSearched &&  filtered.push(item) 
            item.Info[label][item.Info[label].length -1] === value && filtered.push(item)
        })
        return filtered
    } 
    
    
})


app.listen(8080,()=>console.log("chuk"))


