const AWS = require('aws-sdk')
require('dotenv').config()
const express = require('express')
var path = require("path");
const app = express()
app.use(express.static(path.join(__dirname, './')));



AWS.config.update({ accessKeyId: process.env.AWS_SECRET_KEY_ID ,secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY,region: 'us-east-1' });
const dynamoClient = new AWS.DynamoDB.DocumentClient();
app.get('/',(req,res)=>{
  res.send("Guddi MC")
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
    res.status(500).json({ err: error })
    return;
  }
})


app.listen(process.env.PORT || 3000, () => {
  console.log(`listening on port`)
})