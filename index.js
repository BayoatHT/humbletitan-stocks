const AWS = require('aws-sdk')
require('dotenv').config()
const express = require('express')
var path = require("path");
const cors = require('cors')
const app = express()
app.use(express.static(path.join(__dirname, './')));

// app.use(cors({
//   origin: '*'
// }));

// Add headers before the routes are defined
app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'https://designinguru.com');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

AWS.config.update({ region: 'us-east-1' });
 

const dynamoClient = new AWS.DynamoDB.DocumentClient();
let allTickers = []
const getData = async (TABLE_NAME, lastKey) => {
  const params = {
    TableName: TABLE_NAME, 

  };

  dynamoClient.scan(params, onScan);
  var count = 0;

  function onScan(err, data) {
    if (err) {
      console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
    } else { 
      data.Items.forEach(function (itemdata) { 
      });
 
      if (typeof data.LastEvaluatedKey != "undefined") {
        // console.log("Scanning for more...");
        params.ExclusiveStartKey = data.LastEvaluatedKey;
        dynamoClient.scan(params, onScan);
      } else {
        allTickers.push(...data.Items)
        sortArray(allTickers)

      }
    } 
    allTickers.push(...data.Items)
    // console.log(allTickers.length)
  }
}
getData('CompanyProfile').then(aja => console.log(""))

let sortedData = []
let pagination = [] 
let sectorsFilteredData = []
let countryFilteredData = []
let industryFilteredData = []

const sortArray = (tickers) => {

  const sortedArray = tickers.sort(function (a, b) {
    return a.Info.companyname.trim().localeCompare(b.Info.companyname.trim());
  });

  sortedData.push(...sortedArray)

  // alphabetically Sorted Pagination
  let mapLength = Math.ceil(sortedArray.length / 30)
  let b = 0
  for (i = 0; mapLength > i; i++) {
    b = i !== 0 ? b + 30 : 0

    let sortedPage = {
      pageNo: i + 1,
      items: []
    }
    
    for (let x = b; b + 30 > x; x++) {
      sortedPage.items.push(sortedData[x])

    }
    pagination.push(sortedPage)
  }


  //Filters
  let allSectorNames = []
  let allCountryNames = []
  let allIndustryNames = []
  sortedArray.map((item) => {
    allSectorNames.push(item.Info.sector);
    allCountryNames.push(item.Info.country);
    allIndustryNames.push(item.Info.industry)
  })

  let uniqueSectorNames = [...new Set(allSectorNames)]
  let uniqueCountryNames = [...new Set(allCountryNames)]
  let uniqueIndustryNames = [...new Set(allIndustryNames)]

  uniqueSectorNames.map(item=>{
    sectorsFilteredData.push({name:item,items:[],pagination:[]})
  })
  uniqueCountryNames.map(item=>{
    countryFilteredData.push({name:item,items:[],pagination:[]})
  })
  uniqueIndustryNames.map(item=>{
    industryFilteredData.push({name:item,items:[],pagination:[]})
  })

  sortedArray.map(item => {
    uniqueSectorNames.map(subItem=>{
     if (subItem === item.Info.sector){
        sectorsFilteredData.map((i,index)=>{ if(i.name === subItem)  {
           
          sectorsFilteredData[index].items.push(item)} })
     }  
    })
    uniqueCountryNames.map(subItem=>{
     if (subItem === item.Info.country){
      countryFilteredData.map((i,index)=>{ if(i.name === subItem) { countryFilteredData[index].items.push(item)} })
     }  
    })
    uniqueIndustryNames.map(subItem=>{
     if (subItem === item.Info.industry){
      industryFilteredData.map((i,index)=>{ if(i.name === subItem) { industryFilteredData[index].items.push(item) }})
     }  
    })
  }
  )
  

  sectorsFilteredData.map(item=>{
    let mapLength = Math.ceil(item.items.length / 30)
    let b = 0 
    for (i = 0; mapLength > i; i++) {
      b = i !== 0 ? b + 30 : 0
  
      let sortedPage = {
        pageNo: i + 1,
        items: []
      }
      
      for (let x = b; b + 30 > x; x++) {
         sortedPage.items.push(item.items[x])
  
      }
      item.pagination.push(sortedPage)
    }
  })
  countryFilteredData.map(item=>{
    let mapLength = Math.ceil(item.items.length / 30)
    let b = 0
    for (i = 0; mapLength > i; i++) {
      b = i !== 0 ? b + 30 : 0
  
      let sortedPage = {
        pageNo: i + 1,
        items: []
      }
      
      for (let x = b; b + 30 > x; x++) {
        sortedPage.items.push(item.items[x])
  
      }
      item.pagination.push(sortedPage)
    }
  })
  industryFilteredData.map(item=>{
    let mapLength = Math.ceil(item.items.length / 30)
    let b = 0
    for (i = 0; mapLength > i; i++) {
      b = i !== 0 ? b + 30 : 0
  
      let sortedPage = {
        pageNo: i + 1,
        items: []
      }
      
      for (let x = b; b + 30 > x; x++) {
        sortedPage.items.push(item.items[x])
  
      }
      item.pagination.push(sortedPage)
    }
  })
  



}



app.get('/', (req, res) => {
  let data = []
  for (i = 0; i == 30; i++) {
    data.push(allTickers[i])
  }
  res.send(data)
})

app.get('/alltickersort', async (req, res, next) => {
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Methods', 'GET');
  res.json(sortedData)
  next();
})

app.get('/tickers_page/:id', (req, res, next) => {
  let Id = req.params.id - 1
  res.json([pagination[Id],{itemLength:sortedData.length}])
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Methods', 'GET');
  next();
})

app.get('/sectors/:name',(req,res, next)=>{
   let name = req.params.name
   let pageNo = req.query.pageNo - 1
   let data= sectorsFilteredData.filter(item=> {
     let a = item.name.replace(" ","")
     return a === name
   })
   let response =[{pagination:data[0].pagination.length > 0 ? data[0].pagination:false,itemsLength:[data[0].items.length],items:data[0].pagination.length === 0? data[0].items:false}]
   if(response[0].pagination){
     let resp= response[0].pagination[pageNo]
     let length= response[0].itemsLength
     res.json([resp,{itemLength:length}])
 
   }else{
     let resp= response[0].items
     let length= response[0].itemsLength
     res.json([resp,{itemLength:length}])
   }  
   res.header('Access-Control-Allow-Origin', "*");
   res.header('Access-Control-Allow-Methods', 'GET');
   next();
})
app.get('/countries/:name',(req,res, next)=>{
   let name = req.params.name
  let pageNo = req.query.pageNo - 1
  let data= countryFilteredData.filter(item=> {
    let a = item.name.replace(" ","")
    return a === name
  })
  let response =[{pagination:data[0].pagination.length > 0 ? data[0].pagination:false,itemsLength:[data[0].items.length],items:data[0].pagination.length === 0? data[0].items:false}]
  if(response[0].pagination){
    let resp= response[0].pagination[pageNo]
    let length= response[0].itemsLength
    res.json([resp,{itemLength:length}])

  }else{
    let resp= response[0].items
    let length= response[0].itemsLength
    res.json([resp,{itemLength:length}])
  }  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Methods', 'GET');
  next();
})
app.get('/industries/:name',(req,res, next)=>{
  let name = req.params.name
   let pageNo = req.query.pageNo - 1
  let data= industryFilteredData.filter(item=> {
    let a = item.name.replace(" ","")
    return a === name
  })
  let response =[{pagination:data[0].pagination.length > 0 ? data[0].pagination:false,itemsLength:[data[0].items.length],items:data[0].pagination.length === 0? data[0].items:false}]
  if(response[0].pagination){
    let resp= response[0].pagination[pageNo]
    let length= response[0].itemsLength
    res.json([resp,{itemLength:length}])

  }else{
    let resp= response[0].items
    let length= response[0].itemsLength
    res.json([resp,{itemLength:length}])
  }  
  res.header('Access-Control-Allow-Origin', "*");
   res.header('Access-Control-Allow-Methods', 'GET');
   next();
})
 

const getDataById = async(id, TABLE_NAME)=>{
    const params ={
        TableName:TABLE_NAME,
        Key:{
            Symbol:  id
        }
    }
    const data = await dynamoClient.get(params).promise()
    // console.log(data)
    return data
}

app.get('/companydetails/:symbol',async(req,res, next)=>{
  const PROFILE_TABLENAME = "CompanyProfile"
  const SHARES_TABLENAME = "SharesFloat"
  const FINANCIALRATIO_TABLENAME = "FinancialRatiosTTM"
  const KEYMETRICS_TABLENAME = "KeyMetricsTTM"
  const RATING_TABLENAME = "Ratings"
  const REALTIMEQUOTES_TABLENAME = "RealTimeQuotes"
  const FINANCIALGROWTH_TABLENAME = "FinancialGrowthANN"
  const PEERS_TABLENAME = "Peers"
  const id = req.params.symbol

  try {
    const companyProfile = await getDataById(id, PROFILE_TABLENAME)
    const companyShares = await getDataById(id, SHARES_TABLENAME)
    const comapnyFinancialRatio = await getDataById(id, FINANCIALRATIO_TABLENAME)
    const comapnyKeymetrics = await getDataById(id, KEYMETRICS_TABLENAME)
    const comapnyRating = await getDataById(id, RATING_TABLENAME)
    const comapnyRealTimeQuote = await getDataById(id, REALTIMEQUOTES_TABLENAME)
    const comapnyFinancialGrowth = await getDataById(id, FINANCIALGROWTH_TABLENAME) 

    res.json({companyProfile, companyShares, comapnyFinancialRatio, comapnyKeymetrics, comapnyRating, comapnyRealTimeQuote, comapnyFinancialGrowth})
  } catch (error) {
    console.error(error)
    res.status(500).json({ err: 'Something went wrong' })
    return;
  }
  res.header('Access-Control-Allow-Origin', "*");
   res.header('Access-Control-Allow-Methods', 'GET');
   next();
}) 

app.get('/competitors/:symbol', async (req, res, next) => {
  const TABLE_NAME = "Peers"
  const id = req.params.symbol
  try {
    const profile = await getDataById(id, TABLE_NAME)
    const competitorsSymbols = profile?.Item?.Info?.Peers
    let c = []
    const competitorsNames = async () => Promise.all(competitorsSymbols.map((competitor) => getDataById(competitor, 'CompanyProfile')))
    competitorsNames()
      .then(data => {
        data.map(({ Item: { Info: { companyname } } }) => c.push(companyname))
      })
      .then(() => {
        let b = []
        c.map((i, index) => {
          b.push([competitorsSymbols[index], i])
        })
        res.json(b)

      })
  } catch (error) {
    console.error(error)
    res.status(500).json({ err: 'Something went wrong' })
  }
  res.header('Access-Control-Allow-Origin', "*");
   res.header('Access-Control-Allow-Methods', 'GET');
   next();
})
 
const port = process.env.PORT || 3000


app.listen(port, () => {
  console.log(`listening on port ${port}`)
})