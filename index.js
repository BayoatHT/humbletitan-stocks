const AWS = require('aws-sdk')
require('dotenv').config()
const express = require('express')
var path = require("path");
const cors = require('cors')
const app = express()
app.use(express.static(path.join(__dirname, './')));

app.use(cors({
  origin: '*'
}));


AWS.config.update({ region: 'us-east-1' });
 

const dynamoClient = new AWS.DynamoDB.DocumentClient();
const  allTickers = []
const  allSharesFloat = []
const  allFinancialRatios = []
const  allKeyMetrics = []
const  allRatings = []
const  allRealTimeQuotes = []
const  allFinancialGrowth = []
const allCompanyProfile =[]


const getData = async (TABLE_NAME, arrayName) => {
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
        arrayName.push(...data.Items)
        if(TABLE_NAME ==="CompanyProfile"){
          sortArray(arrayName)
        }

      }
    } 
    arrayName.push(...data.Items)
    // console.log(allTickers.length)
  }
}
 
getData('CompanyProfile',allTickers).then(aja => console.log(""))
getData('SharesFloat',allSharesFloat).then(aja => console.log(""))
getData('FinancialRatiosTTM',allFinancialRatios).then(aja => console.log(""))
getData('KeyMetricsTTM',allKeyMetrics).then(aja => console.log(""))
getData('Ratings',allRatings).then(aja => console.log(""))
getData('RealTimeQuotes',allRealTimeQuotes).then(aja => console.log(""))
getData('FinancialGrowthANN',allFinancialGrowth).then(aja => console.log("")) 
getData('CompanyProfile',allCompanyProfile).then(aja => console.log("")) 

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

app.get('/alltickersort', async (req, res) => {
  res.header('Access-Control-Allow-Origin', "*");
   res.header('Access-Control-Allow-Methods', 'GET');
  res.json(sortedData)
})

app.get('/getEqualTo/:routeName',(req,res)=>{
    let {routeName} =req.params
    const {label,value}=req.query
    const filtered= []
    switch (routeName) {
      case "allSharesFloat":
        
       allSharesFloat.map(item=>{  
        item.Info[label]  == value &&  filtered.push(item)  
    })
        break;
      case "allCompanyProfile":
        
       allCompanyProfile.map(item=>{  
        item.Info[label]  == value &&  filtered.push(item)  
    })
        break;
      case "allFinancialRatios":
        allFinancialRatios.map(item=>{  
        item.Info[label]  == value &&  filtered.push(item)  
    })
        break;
      case "allKeyMetrics":
        allKeyMetrics.map(item=>{  
        item.Info[label]  == value &&  filtered.push(item)  
    })
        break;
      case "allRatings":
        allRatings.map(item=>{  
        item.Info[label]  == value &&  filtered.push(item)  
    })
        break;
      case "allRealTimeQuotes":
        allRealTimeQuotes.map(item=>{  
        item.Info[label]  == value &&  filtered.push(item)  
    })
        break;
      case "allFinancialGrowth":
        allFinancialGrowth.map(item=>{  
        item.Info[label]  == value &&  filtered.push(item)  
    })
        break;
     
    }
       
        res.json( filtered)
   

})
app.get('/getLessThan/:routeName',(req,res)=>{
    let {routeName} =req.params
    const {label,value}=req.query
     

    const filtered= []
    switch (routeName) {
      case "allCompanyProfile":
        
        allCompanyProfile.map(item=>{ 
          let valueSearched =  +value;
          let valueOfItem = +item.Info[label]
          valueOfItem  < valueSearched &&  filtered.push(item)  
      })  
        break;
      case "allSharesFloat":
        
        allSharesFloat.map(item=>{ 
          let valueSearched =  +value;
          let valueOfItem = +item.Info[label]
          valueOfItem  < valueSearched &&  filtered.push(item)  
      })  
        break;
      case "allFinancialRatios":
        allFinancialRatios.map(item=>{ 
          let valueSearched =  +value;
          let valueOfItem = +item.Info[label]
          valueOfItem  < valueSearched &&  filtered.push(item)  
      })   
        break;
      case "allKeyMetrics":
        allKeyMetrics.map(item=>{ 
          let valueSearched =  +value;
          let valueOfItem = +item.Info[label]
          valueOfItem  < valueSearched &&  filtered.push(item)  
      })     
        break;
      case "allRatings":
        allRatings.map(item=>{ 
          let valueSearched =  +value;
          let valueOfItem = +item.Info[label]
          valueOfItem  < valueSearched &&  filtered.push(item)  
      })   
        break;
      case "allRealTimeQuotes":
        allRealTimeQuotes.map(item=>{ 
          let valueSearched =  +value;
          let valueOfItem = +item.Info[label]
          valueOfItem  < valueSearched &&  filtered.push(item)  
      })    
        break;
      case "allFinancialGrowth":
        allFinancialGrowth.map(item=>{ 
          let valueSearched =  +value;
          let valueOfItem = +item.Info[label]
          valueOfItem  < valueSearched &&  filtered.push(item)  
      })    
        break;
     
    }
       
        res.json( filtered)

})
app.get('/getGreaterThan/:routeName',(req,res)=>{
    let {routeName} =req.params
    const {label,value}=req.query
    const filtered= []
    switch (routeName) {
      case "allCompanyProfile":
        
        allCompanyProfile.map(item=>{ 
          let valueSearched =  +value;
          let valueOfItem = +item.Info[label]
          valueOfItem  > valueSearched &&  filtered.push(item)  
      })  
        break;
      case "allSharesFloat":
        
        allSharesFloat.map(item=>{ 
          let valueSearched =  +value;
          let valueOfItem = +item.Info[label]
          valueOfItem  > valueSearched &&  filtered.push(item)  
      })  
        break;
      case "allFinancialRatios":
        allFinancialRatios.map(item=>{ 
          let valueSearched =  +value;
          let valueOfItem = +item.Info[label]
          valueOfItem  > valueSearched &&  filtered.push(item)  
      })   
        break;
      case "allKeyMetrics":
        allKeyMetrics.map(item=>{ 
          let valueSearched =  +value;
          let valueOfItem = +item.Info[label]
          valueOfItem  > valueSearched &&  filtered.push(item)  
      })     
        break;
      case "allRatings":
        allRatings.map(item=>{ 
          let valueSearched =  +value;
          let valueOfItem = +item.Info[label]
          valueOfItem  > valueSearched &&  filtered.push(item)  
      })   
        break;
      case "allRealTimeQuotes":
        allRealTimeQuotes.map(item=>{ 
          let valueSearched =  +value;
          let valueOfItem = +item.Info[label]
          valueOfItem  > valueSearched &&  filtered.push(item)  
      })    
        break;
      case "allFinancialGrowth":
        allFinancialGrowth.map(item=>{ 
          let valueSearched =  +value;
          let valueOfItem = +item.Info[label]
          valueOfItem  > valueSearched &&  filtered.push(item)  
      })    
        break;
     
    }
       
        res.json( filtered)

})
app.get('/getStartingWith/:routeName',(req,res)=>{
    let {routeName} =req.params
    const {label,value}=req.query
    
    const filtered= []
    switch (routeName) {
      case "allCompanyProfile":
        
        allCompanyProfile.map(item=>{ 
         item.Info[label][0] === value && filtered.push(item) 
      })  
        break;
      case "allSharesFloat":
        
        allSharesFloat.map(item=>{ 
         item.Info[label][0] === value && filtered.push(item) 
      })  
        break;
      case "allFinancialRatios":
        allFinancialRatios.map(item=>{ 
         item.Info[label][0] === value && filtered.push(item) 
      })   
        break;
      case "allKeyMetrics":
        allKeyMetrics.map(item=>{ 
         item.Info[label][0] === value && filtered.push(item) 
      })     
        break;
      case "allRatings":
        allRatings.map(item=>{ 
         item.Info[label][0] === value && filtered.push(item) 
      })   
        break;
      case "allRealTimeQuotes":
        allRealTimeQuotes.map(item=>{ 
         item.Info[label][0] === value && filtered.push(item) 
      })    
        break;
      case "allFinancialGrowth":
        allFinancialGrowth.map(item=>{ 
         item.Info[label][0] === value && filtered.push(item) 
      })    
        break;
     
    }
       
        res.json( filtered)

}) 
app.get('/getEndingWith/:routeName',(req,res)=>{
    let {routeName} =req.params
    const {label,value}=req.query 
    const filtered= []
    switch (routeName) {
      case "allCompanyProfile":
        
        allCompanyProfile.map(item=>{ 
           item.Info[label][item.Info[label].length -1] === value && filtered.push(item)
      })  
        break;
      case "allSharesFloat":
        
        allSharesFloat.map(item=>{ 
           item.Info[label][item.Info[label].length -1] === value && filtered.push(item)
      })  
        break;
      case "allFinancialRatios":
        allFinancialRatios.map(item=>{ 
           item.Info[label][item.Info[label].length -1] === value && filtered.push(item)
      })   
        break;
      case "allKeyMetrics":
        allKeyMetrics.map(item=>{ 
           item.Info[label][item.Info[label].length -1] === value && filtered.push(item)
      })     
        break;
      case "allRatings":
        allRatings.map(item=>{ 
           item.Info[label][item.Info[label].length -1] === value && filtered.push(item)
      })   
        break;
      case "allRealTimeQuotes":
        allRealTimeQuotes.map(item=>{ 
           item.Info[label][item.Info[label].length -1] === value && filtered.push(item)
      })    
        break;
      case "allFinancialGrowth":
        allFinancialGrowth.map(item=>{ 
           item.Info[label][item.Info[label].length -1] === value && filtered.push(item)
      })    
        break;
     
    }
       
        res.json( filtered)

})
app.get('/allCompanyProfile', async (req, res) => {
  res.header('Access-Control-Allow-Origin', "*");
   res.header('Access-Control-Allow-Methods', 'GET');
  res.json(allCompanyProfile)
})
app.get('/allSharesFloat', async (req, res) => {
  res.header('Access-Control-Allow-Origin', "*");
   res.header('Access-Control-Allow-Methods', 'GET');
  res.json(allSharesFloat)
})
app.get('/allFinancialRatios', async (req, res) => {
  res.header('Access-Control-Allow-Origin', "*");
   res.header('Access-Control-Allow-Methods', 'GET');
  res.json(allFinancialRatios)
})
app.get('/allKeyMetrics', async (req, res) => {
  res.header('Access-Control-Allow-Origin', "*");
   res.header('Access-Control-Allow-Methods', 'GET');
  res.json(allKeyMetrics)
})
app.get('/allRatings', async (req, res) => {
  res.header('Access-Control-Allow-Origin', "*");
   res.header('Access-Control-Allow-Methods', 'GET');
  res.json(allRatings)
})
app.get('/allRealTimeQuotes', async (req, res) => {
  res.header('Access-Control-Allow-Origin', "*");
   res.header('Access-Control-Allow-Methods', 'GET');
  res.json(allRealTimeQuotes)
})
app.get('/allFinancialGrowth', async (req, res) => {
  res.header('Access-Control-Allow-Origin', "*");
   res.header('Access-Control-Allow-Methods', 'GET');
  res.json(allFinancialGrowth)
})

app.get('/tickers_page/:id', (req, res) => {
  let Id = req.params.id - 1
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Methods', 'GET');
  res.json([pagination[Id],{itemLength:sortedData.length}])
})

app.get('/sectors/:name',(req,res)=>{
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Methods', 'GET');
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
})
app.get('/countries/:name',(req,res)=>{
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Methods', 'GET');
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
  }  
})
app.get('/industries/:name',(req,res)=>{
  res.header('Access-Control-Allow-Origin', "*");
   res.header('Access-Control-Allow-Methods', 'GET');
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

app.get('/companydetails/:symbol',async(req,res)=>{
  res.header('Access-Control-Allow-Origin', "*");
   res.header('Access-Control-Allow-Methods', 'GET');
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
  
}) 

app.get('/competitors/:symbol', async (req, res) => {
  res.header('Access-Control-Allow-Origin', "*");
   res.header('Access-Control-Allow-Methods', 'GET');
  const Peers_Table = "Peers"
  const id = req.params.symbol
  // try {
  //   const profile = await getDataById(id, Peers_Table)
  //   const competitorsSymbols = profile?.Item?.Info?.Peers
  //   let c = []
  //   const competitorsNames = async () => Promise.all(competitorsSymbols.map((competitor) => getDataById(competitor, 'CompanyProfile')))
  //   competitorsNames()
  //     .then(data => {
  //       data.map(({ Item: { Info: { companyname } } }) => c.push(companyname))
  //     })
  //     .then(() => {
  //       let b = []
  //       c.map((i, index) => {
  //         b.push([competitorsSymbols[index], i])
  //       })
  //       res.json(b)

  //     })
  // } catch (error) {
  //   console.error(error)
  //   res.status(500).json({ err: 'Something went wrong' })
  // }
  
})
 
const port = process.env.PORT || 3000


app.listen(port, () => {
  console.log(`listening on port ${port}`)
})