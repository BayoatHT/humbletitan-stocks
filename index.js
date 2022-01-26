const express = require('express')
const res = require('express/lib/response')

const app = express()

app.get('/', (req, res) => {

    res.send("Hello")
}
)

app.listen(5000,()=> console.log("Hello"))