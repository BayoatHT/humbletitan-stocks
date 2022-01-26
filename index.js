const express = require('express') 

const app = express()

app.get('/', (req, res) => {

    res.send("Hello")
}
)

app.listen(process.env.PORT || 5000,()=> console.log("Hello"))