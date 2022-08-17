const AWS = require('aws-sdk')
require('dotenv').config()
const express = require('express')
var path = require('path')
const cors = require('cors')
const { searchingFilter } = require('./filtersData')
const bodyParser = require('body-parser')
const { google } = require('googleapis')
const fs = require('fs')

const app = express()
app.use(express.static(path.join(__dirname, './')))

app.use(
  cors({
    origin: '*',
  }),
)

const jsonParser = bodyParser.json()

// AWS.config.update({ region: 'us-east-1' });

// const dynamoClient = new AWS.DynamoDB.DocumentClient();
const allTickers = []
const allSharesFloat = []
const allFinancialRatios = []
const allKeyMetrics = []
const allRatings = []
const allRealTimeQuotes = []
const allFinancialGrowth = []
const allCompanyProfile = []
const topActive = []
const topGainers = []
const topLosers = []
const StockColsingPrice = []
const Peers = []
const customRoutes = []


// Dynamo Database Confiqurations
// 
// const getData = async (TABLE_NAME, arrayName) => {
//   const params = {
//     TableName: TABLE_NAME,

//   };

//   dynamoClient.scan(params, onScan);
//   var count = 0;

//   function onScan(err, data) {
//     if (err) {
//       console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
//     } else {
//       data.Items.forEach(function (itemdata) {
//       });

//       if (typeof data.LastEvaluatedKey != "undefined") {
//         // console.log("Scanning for more...");
//         params.ExclusiveStartKey = data.LastEvaluatedKey;
//         dynamoClient.scan(params, onScan);
//       } else {
//         arrayName.push(...data.Items)
//         if(TABLE_NAME ==="CompanyProfile"){
//           sortArray(arrayName)
//         }

//       }
//     }
//     arrayName.push(...data.Items)
//     // console.log(allTickers.length)
//   }
// }

const getData = async (sheetId, sheetRange, dataArr) => {
  const auth = new google.auth.GoogleAuth({
    keyFile: path.resolve('./credintials.json'),
    scopes: 'https://www.googleapis.com/auth/spreadsheets',
  })

  const client = await auth.getClient()

  const googleSheets = google.sheets({ version: 'v4', auth: client })

  const spreadsheetId = sheetId
  const range = sheetRange
  const metaData = await googleSheets.spreadsheets.get({
    auth,
    spreadsheetId,
  })

  const getRows = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId,
    range,
  })

  let headings = getRows.data.values[0]
  let rows = getRows.data.values
  if (sheetRange === 'Peers!D3:N6660') {
    rows.forEach((item, index) => {
      let symbol = item[0]
      let peers = []
      item.map((item, i) => {
        i > 0 && peers.push(item)
      })
      let obj = { Symbol: symbol, Peers: peers }
      index > 0 && dataArr.push(obj)
    })
  } else {
    rows.forEach((rows, i) => {
      var symbol = rows[0]
      var info = {}
      headings.forEach((title, j) => {
        if (sheetRange === '90 Stock Closing Price!E3:DU7555') {
          Object.assign(info, {
            [title.toLowerCase().replace('date', 'day')]: rows[j],
          })
        } else {
          Object.assign(info, { [title.toLowerCase()]: rows[j] })
        }
      })
      var obj = { Symbol: symbol, Info: info }
      i > 0 && dataArr.push(obj)
    })
  }

  if (sheetRange === 'All Tickers - Company Profile!D3:AM7047') {
    sortArray(dataArr)
  }

  return dataArr
}

const getAllCustomUrls = async () => {
  const auth = new google.auth.GoogleAuth({
    keyFile: path.resolve('./credintials.json'),
    scopes: 'https://www.googleapis.com/auth/spreadsheets',
  })

  const client = await auth.getClient()

  const googleSheets = google.sheets({ version: 'v4', auth: client })

  const spreadsheetId = '16erRk6sE2t2HEiBeRzifr9plFQPBaVnR_5tnQtmQVLM'
  const range = 'HT-custom-pages!A:G'

  const getRows = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId,
    range,
  })
  let rows = getRows.data.values.slice(1)
  let headings = getRows.data.values[0]
  rows.forEach((rows, i) => {
    var value = {}
    headings.forEach((title, j) => {
      Object.assign(value, { [title.toLowerCase()]: rows[j] })
    })
    customRoutes.push(value)
  })
}

getAllCustomUrls()

//////////////// async function getData(arg1, arg2, arg3)
getData(
  '1ciKRDKoyL_d3GCMzh23-my5mtizITmNtBxqmvY7-VfY',
  'All Tickers - Company Profile!D3:AM7047',
  allCompanyProfile,
)
  .then((aja) => console.log('Company Profile'))
  .catch((error) => console.log('Company Profile', error.message))

getData(
  '1ciKRDKoyL_d3GCMzh23-my5mtizITmNtBxqmvY7-VfY',
  'All Tickers - Shares Float!D3:J5658',
  allSharesFloat,
)
  .then((aja) => console.log('Shares Float'))
  .catch((error) => console.log('Shares Float', error.message))

getData(
  '1ciKRDKoyL_d3GCMzh23-my5mtizITmNtBxqmvY7-VfY',
  'All Tickers - Financial Ratios TTM!D3:BJ7874',
  allFinancialRatios,
)
  .then((aja) => console.log('Financial Ratios TTM'))
  .catch((error) => console.log('Financial Ratios TTM', error.message))

getData(
  '1ciKRDKoyL_d3GCMzh23-my5mtizITmNtBxqmvY7-VfY',
  'All Tickers - Key Metrics TTM!D3:BL7874',
  allKeyMetrics,
)
  .then((aja) => console.log('Key Metrics TTM'))
  .catch((error) => console.log('Key Metrics TTM', error.message))

getData(
  '1ciKRDKoyL_d3GCMzh23-my5mtizITmNtBxqmvY7-VfY',
  'All Tickers - Real Time Quote!D3:Y7416',
  allRealTimeQuotes,
)
  .then((aja) => console.log('Real Time Quote'))
  .catch((error) => console.log('Real Time Quote', error.message))

getData(
  '1ciKRDKoyL_d3GCMzh23-my5mtizITmNtBxqmvY7-VfY',
  'All Tickers - Financial Growth ANN!D3:AN7053',
  allFinancialGrowth,
)
  .then((aja) => console.log('Financial Growth ANN'))
  .catch((error) => console.log('Financial Growth ANN', error.message))

getData(
  '1ciKRDKoyL_d3GCMzh23-my5mtizITmNtBxqmvY7-VfY',
  'Ratings!D3:T6025',
  allRatings,
)
  .then((aja) => console.log('Ratings'))
  .catch((error) => console.log('Ratings', error.message))

getData(
  '1ciKRDKoyL_d3GCMzh23-my5mtizITmNtBxqmvY7-VfY',
  'Stock Market Top Active!D3:I33',
  topActive,
)
  .then((aja) => console.log('Top Active'))
  .catch((error) => console.log('Top Active', error.message))

getData(
  '1ciKRDKoyL_d3GCMzh23-my5mtizITmNtBxqmvY7-VfY',
  'Stock Market Top Gainers!D3:I33',
  topGainers,
)
  .then((aja) => console.log('Top Gainers'))
  .catch((error) => console.log('Top Gainers', error.message))
getData(
  '1ciKRDKoyL_d3GCMzh23-my5mtizITmNtBxqmvY7-VfY',
  'Stock Market Top Losers!D3:I33',
  topLosers,
)
  .then((aja) => console.log('Top Losers'))
  .catch((error) => console.log('Top Losers', error.message))
getData('1ciKRDKoyL_d3GCMzh23-my5mtizITmNtBxqmvY7-VfY', 'Peers!D3:N6660', Peers)
  .then((aja) => console.log('Peers'))
  .catch((error) => console.log('Peers', error.message))
getData(
  '1sS5DQH7bcQpKz--Nu4oK1pdRaaIQVqvINjCxYRdgQS8',
  '90 Stock Closing Price!E3:DU7555',
  StockColsingPrice,
)
  .then((aja) => console.log('Stock Colsing Price'))
  .catch((error) => console.log('Stock Colsing Price', error.message))

// getData('FinancialRatiosTTM',allFinancialRatios).then(aja => console.log(""))
// getData('KeyMetricsTTM',allKeyMetrics).then(aja => console.log(""))
// getData('Ratings',allRatings).then(aja => console.log(""))
// getData('RealTimeQuotes',allRealTimeQuotes).then(aja => console.log(""))
// getData('FinancialGrowthANN',allFinancialGrowth).then(aja => console.log(""))
// getData('CompanyProfile',allCompanyProfile).then(aja => console.log(""))
// getData('TopActive',topActive).then(aja => console.log(""))
// getData('TopGainers',topGainers).then(aja => console.log(""))
// getData('TopLosers',topLosers).then(aja => console.log(""))

const addCustomRouteToSheet = async ({
  url,
  tableName,
  filterValue,
  filterCondition,
  filterlabel,
  headerText,
}) => {
  const auth = new google.auth.GoogleAuth({
    keyFile: path.resolve('./credintials.json'),
    scopes: 'https://www.googleapis.com/auth/spreadsheets',
  })

  const client = await auth.getClient()

  const googleSheets = google.sheets({ version: 'v4', auth: client })

  const spreadsheetId = '16erRk6sE2t2HEiBeRzifr9plFQPBaVnR_5tnQtmQVLM'

  await googleSheets.spreadsheets.values.append({
    auth,
    spreadsheetId,
    range: 'HT-custom-pages!A:G',
    valueInputOption: 'USER_ENTERED',
    resource: {
      values: [
        [
          url,
          tableName,
          filterValue,
          filterCondition,
          filterlabel,
          headerText.heading,
          headerText.description,
        ],
      ],
    },
  })
}

let sortedData = []
let pagination = []
let sectorsFilteredData = []
let countryFilteredData = []
let industryFilteredData = []
let marketCapsFilteredData = []
const listOfCompanies = []

const sortArray = (tickers) => {
  const sortedArray = tickers.sort(function (a, b) {
    return a.Info.companyname.trim().localeCompare(b.Info.companyname.trim())
  })

  sortedData.push(...sortedArray)

  listingCompanies()

  // alphabetically Sorted Pagination
  let mapLength = Math.ceil(sortedArray.length / 30)
  let b = 0
  for (i = 0; mapLength > i; i++) {
    b = i !== 0 ? b + 30 : 0

    let sortedPage = {
      pageNo: i + 1,
      items: [],
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
  let allMarketCaps = []
  sortedArray.map((item) => {
    allSectorNames.push(item.Info.sector)
    allCountryNames.push(item.Info.country)
    allIndustryNames.push(item.Info.industry)
    allMarketCaps.push(item.Info.mktcap)
  })

  let uniqueSectorNames = [...new Set(allSectorNames)]
  let uniqueCountryNames = [...new Set(allCountryNames)]
  let uniqueIndustryNames = [...new Set(allIndustryNames)]
  let uniqueMarketCaps = [...new Set(allMarketCaps)]

  uniqueSectorNames.map((item) => {
    sectorsFilteredData.push({ name: item, items: [], pagination: [] })
  })
  uniqueCountryNames.map((item) => {
    countryFilteredData.push({ name: item, items: [], pagination: [] })
  })
  uniqueIndustryNames.map((item) => {
    industryFilteredData.push({ name: item, items: [], pagination: [] })
  })
  uniqueMarketCaps.map((item) => {
    marketCapsFilteredData.push({ name: item, items: [], pagination: [] })
  })

  sortedArray.map((item) => {
    uniqueSectorNames.map((subItem) => {
      if (subItem === item.Info.sector) {
        sectorsFilteredData.map((i, index) => {
          if (i.name === subItem) {
            sectorsFilteredData[index].items.push(item)
          }
        })
      }
    })
    uniqueCountryNames.map((subItem) => {
      if (subItem === item.Info.country) {
        countryFilteredData.map((i, index) => {
          if (i.name === subItem) {
            countryFilteredData[index].items.push(item)
          }
        })
      }
    })
    uniqueIndustryNames.map((subItem) => {
      if (subItem === item.Info.industry) {
        industryFilteredData.map((i, index) => {
          if (i.name === subItem) {
            industryFilteredData[index].items.push(item)
          }
        })
      }
    })
    uniqueMarketCaps.map((subItem) => {
      if (subItem === item.Info.mktcap) {
        marketCapsFilteredData.map((i, index) => {
          if (i.name === subItem) {
            marketCapsFilteredData[index].items.push(item)
          }
        })
      }
    })
  })

  sectorsFilteredData.map((item) => {
    let mapLength = Math.ceil(item.items.length / 30)
    let b = 0
    for (let i = 0; mapLength > i; i++) {
      b = i !== 0 ? b + 30 : 0

      let sortedPage = {
        pageNo: i + 1,
        items: [],
      }

      for (let x = b; b + 30 > x; x++) {
        sortedPage.items.push(item.items[x])
      }
      item.pagination.push(sortedPage)
    }
  })
  countryFilteredData.map((item) => {
    let mapLength = Math.ceil(item.items.length / 30)
    let b = 0
    for (let i = 0; mapLength > i; i++) {
      b = i !== 0 ? b + 30 : 0

      let sortedPage = {
        pageNo: i + 1,
        items: [],
      }

      for (let x = b; b + 30 > x; x++) {
        sortedPage.items.push(item.items[x])
      }
      item.pagination.push(sortedPage)
    }
  })
  industryFilteredData.map((item) => {
    let mapLength = Math.ceil(item.items.length / 30)
    let b = 0
    for (let i = 0; mapLength > i; i++) {
      b = i !== 0 ? b + 30 : 0

      let sortedPage = {
        pageNo: i + 1,
        items: [],
      }

      for (let x = b; b + 30 > x; x++) {
        sortedPage.items.push(item.items[x])
      }
      item.pagination.push(sortedPage)
    }
  })
  marketCapsFilteredData.map((item) => {
    let mapLength = Math.ceil(item.items.length / 30)
    let b = 0
    for (let i = 0; mapLength > i; i++) {
      b = i !== 0 ? b + 30 : 0

      let sortedPage = {
        pageNo: i + 1,
        items: [],
      }

      for (let x = b; b + 30 > x; x++) {
        sortedPage.items.push(item.items[x])
      }
      item.pagination.push(sortedPage)
    }
  })
}

const listingCompanies = () => {
  sortedData.map((item) =>
    listOfCompanies.push({
      symbol: item.Symbol,
      companyname: item.Info.companyname,
    }),
  )
}

app.get('/', (req, res) => {
  let data = []
  for (i = 0; i == 30; i++) {
    data.push(sortedData[i])
  }
  res.send(data)
  console.log('data Sent', data)
})

app.get('/list-of-companies', (req, res) => {
  res.json(listOfCompanies)
})

app.get('/alltickersort', async (req, res) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET')
  res.json(sortedData)
})

app.get('/getAllCustomUrls', async (req, res) => {
  const auth = new google.auth.GoogleAuth({
    keyFile: path.resolve('./credintials.json'),
    scopes: 'https://www.googleapis.com/auth/spreadsheets',
  })

  const client = await auth.getClient()

  const googleSheets = google.sheets({ version: 'v4', auth: client })

  const spreadsheetId = '16erRk6sE2t2HEiBeRzifr9plFQPBaVnR_5tnQtmQVLM'
  const range = 'HT-custom-pages!A:G'

  const getRows = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId,
    range,
  })

  let dataArr = []
  let rows = getRows.data.values.slice(1)
  let headings = getRows.data.values[0]
  rows.forEach((rows, i) => {
    var value = {}
    headings.forEach((title, j) => {
      Object.assign(value, { [title.toLowerCase()]: rows[j] })
    })
    dataArr.push(value)
  })

  res.send(dataArr)
})

app.get('/getEqualTo/:routeName', (req, res) => {
  let { routeName } = req.params
  const { label, value } = req.query
  const filtered = []
  switch (routeName) {
    case 'allSharesFloat':
      allSharesFloat.map((item) => {
        item.Info[label] == value && filtered.push(item)
      })
      break
    case 'allCompanyProfile':
      allCompanyProfile.map((item) => {
        item.Info[label] == value && filtered.push(item)
      })
      break
    case 'allFinancialRatios':
      allFinancialRatios.map((item) => {
        item.Info[label] == value && filtered.push(item)
      })
      break
    case 'allKeyMetrics':
      allKeyMetrics.map((item) => {
        item.Info[label] == value && filtered.push(item)
      })
      break
    case 'allRatings':
      allRatings.map((item) => {
        item.Info[label] == value && filtered.push(item)
      })
      break
    case 'allRealTimeQuotes':
      allRealTimeQuotes.map((item) => {
        item.Info[label] == value && filtered.push(item)
      })
      break
    case 'allFinancialGrowth':
      allFinancialGrowth.map((item) => {
        item.Info[label] == value && filtered.push(item)
      })
      break
  }

  res.json(filtered)
})
app.get('/getLessThan/:routeName', (req, res) => {
  let { routeName } = req.params
  const { label, value } = req.query
  let valueSearched = +value
  let valueOfItem

  const filtered = []
  switch (routeName) {
    case 'allCompanyProfile':
      allCompanyProfile.map((item) => {
        valueOfItem = +item.Info[label]
        valueOfItem < valueSearched && valueOfItem != '' && filtered.push(item)
      })
      break
    case 'allSharesFloat':
      allSharesFloat.map((item) => {
        valueOfItem = +item.Info[label]
        valueOfItem < valueSearched && valueOfItem != '' && filtered.push(item)
      })
      break
    case 'allFinancialRatios':
      allFinancialRatios.map((item) => {
        valueOfItem = +item.Info[label]
        valueOfItem < valueSearched && valueOfItem != '' && filtered.push(item)
      })
      break
    case 'allKeyMetrics':
      allKeyMetrics.map((item) => {
        valueOfItem = +item.Info[label]
        valueOfItem < valueSearched && valueOfItem != '' && filtered.push(item)
      })
      break
    case 'allRatings':
      allRatings.map((item) => {
        valueOfItem = +item.Info[label]
        valueOfItem < valueSearched && valueOfItem != '' && filtered.push(item)
      })
      break
    case 'allRealTimeQuotes':
      allRealTimeQuotes.map((item) => {
        valueOfItem = +item.Info[label]
        valueOfItem < valueSearched && valueOfItem != '' && filtered.push(item)
      })
      break
    case 'allFinancialGrowth':
      allFinancialGrowth.map((item) => {
        valueOfItem = +item.Info[label]
        valueOfItem < valueSearched && valueOfItem != '' && filtered.push(item)
      })
      break
  }
  filtered.sort((a, b) => b?.Info[label] - a?.Info[label])
  res.json(filtered)
})
app.get('/getGreaterThan/:routeName', (req, res) => {
  let { routeName } = req.params
  const { label, value } = req.query
  const filtered = []
  let valueSearched = +value
  let valueOfItem

  switch (routeName) {
    case 'allCompanyProfile':
      allCompanyProfile.map((item) => {
        valueOfItem = +item.Info[label]
        valueOfItem > valueSearched && valueOfItem != '' && filtered.push(item)
      })
      break
    case 'allSharesFloat':
      allSharesFloat.map((item) => {
        valueOfItem = +item.Info[label]
        valueOfItem > valueSearched && valueOfItem != '' && filtered.push(item)
      })
      break
    case 'allFinancialRatios':
      allFinancialRatios.map((item) => {
        valueOfItem = +item.Info[label]
        valueOfItem > valueSearched && valueOfItem != '' && filtered.push(item)
      })
      break
    case 'allKeyMetrics':
      allKeyMetrics.map((item) => {
        valueOfItem = +item.Info[label]
        valueOfItem > valueSearched && valueOfItem != '' && filtered.push(item)
      })
      break
    case 'allRatings':
      allRatings.map((item) => {
        valueOfItem = +item.Info[label]
        valueOfItem > valueSearched && valueOfItem != '' && filtered.push(item)
      })
      break
    case 'allRealTimeQuotes':
      allRealTimeQuotes.map((item) => {
        valueOfItem = +item.Info[label]
        valueOfItem > valueSearched && valueOfItem != '' && filtered.push(item)
      })
      break
    case 'allFinancialGrowth':
      allFinancialGrowth.map((item) => {
        valueOfItem = +item.Info[label]
        valueOfItem > valueSearched && valueOfItem != '' && filtered.push(item)
      })
      break
  }
  filtered.sort((a, b) => a?.Info[label] - b?.Info[label])
  res.json(filtered)
})
app.get('/getStartingWith/:routeName', (req, res) => {
  let { routeName } = req.params
  const { label, value } = req.query

  const filtered = []
  switch (routeName) {
    case 'allCompanyProfile':
      allCompanyProfile.map((item) => {
        item.Info[label][0] === value && filtered.push(item)
      })
      break
    case 'allSharesFloat':
      allSharesFloat.map((item) => {
        item.Info[label][0] === value && filtered.push(item)
      })
      break
    case 'allFinancialRatios':
      allFinancialRatios.map((item) => {
        item.Info[label][0] === value && filtered.push(item)
      })
      break
    case 'allKeyMetrics':
      allKeyMetrics.map((item) => {
        item.Info[label][0] === value && filtered.push(item)
      })
      break
    case 'allRatings':
      allRatings.map((item) => {
        item.Info[label][0] === value && filtered.push(item)
      })
      break
    case 'allRealTimeQuotes':
      allRealTimeQuotes.map((item) => {
        item.Info[label][0] === value && filtered.push(item)
      })
      break
    case 'allFinancialGrowth':
      allFinancialGrowth.map((item) => {
        item.Info[label][0] === value && filtered.push(item)
      })
      break
  }
  res.json(filtered)
})
app.get('/getEndingWith/:routeName', (req, res) => {
  let { routeName } = req.params
  const { label, value } = req.query
  const filtered = []
  switch (routeName) {
    case 'allCompanyProfile':
      allCompanyProfile.map((item) => {
        item.Info[label][item.Info[label].length - 1] === value &&
          filtered.push(item)
      })
      break
    case 'allSharesFloat':
      allSharesFloat.map((item) => {
        item.Info[label][item.Info[label].length - 1] === value &&
          filtered.push(item)
      })
      break
    case 'allFinancialRatios':
      allFinancialRatios.map((item) => {
        item.Info[label][item.Info[label].length - 1] === value &&
          filtered.push(item)
      })
      break
    case 'allKeyMetrics':
      allKeyMetrics.map((item) => {
        item.Info[label][item.Info[label].length - 1] === value &&
          filtered.push(item)
      })
      break
    case 'allRatings':
      allRatings.map((item) => {
        item.Info[label][item.Info[label].length - 1] === value &&
          filtered.push(item)
      })
      break
    case 'allRealTimeQuotes':
      allRealTimeQuotes.map((item) => {
        item.Info[label][item.Info[label].length - 1] === value &&
          filtered.push(item)
      })
      break
    case 'allFinancialGrowth':
      allFinancialGrowth.map((item) => {
        item.Info[label][item.Info[label].length - 1] === value &&
          filtered.push(item)
      })
      break
  }
  res.json(filtered)
})
app.get('/allCompanyProfile', async (req, res) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET')
  res.json(allCompanyProfile)
})
app.get('/allSharesFloat', async (req, res) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET')
  res.json(allSharesFloat)
})
app.get('/allFinancialRatios', async (req, res) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET')
  res.json(allFinancialRatios)
})
app.get('/allKeyMetrics', async (req, res) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET')
  res.json(allKeyMetrics)
})
app.get('/allRatings', async (req, res) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET')
  res.json(allRatings)
})
app.get('/allRealTimeQuotes', async (req, res) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET')
  res.json(allRealTimeQuotes)
})
app.get('/allFinancialGrowth', async (req, res) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET')
  res.json(allFinancialGrowth)
})

app.get('/tickers_page/:id', (req, res) => {
  let Id = req.params.id - 1
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET')
  res.json([pagination[Id], { itemLength: sortedData.length }])
})

app.get('/sectors/:name', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET')
  let name = req.params.name
  let pageNo = req.query.pageNo - 1
  let data = sectorsFilteredData.filter((item) => {
    let a = item.name.replace(' ', '')
    return a === name
  })
  let response = [
    {
      pagination: data[0].pagination.length > 0 ? data[0].pagination : false,
      itemsLength: [data[0].items.length],
      items: data[0].pagination.length === 0 ? data[0].items : false,
    },
  ]
  if (response[0].pagination) {
    let resp = response[0].pagination[pageNo]
    let length = response[0].itemsLength
    res.json([resp, { itemLength: length }])
  } else {
    let resp = response[0].items
    let length = response[0].itemsLength
    res.json([resp, { itemLength: length }])
  }
})
app.get('/countries/:name', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET')
  let name = req.params.name
  let pageNo = req.query.pageNo - 1
  let data = countryFilteredData.filter((item) => {
    let a = item.name.replace(' ', '')
    return a === name
  })
  let response = [
    {
      pagination: data[0].pagination.length > 0 ? data[0].pagination : false,
      itemsLength: [data[0].items.length],
      items: data[0].pagination.length === 0 ? data[0].items : false,
    },
  ]
  if (response[0].pagination) {
    let resp = response[0].pagination[pageNo]
    let length = response[0].itemsLength
    res.json([resp, { itemLength: length }])
  } else {
    let resp = response[0].items
    let length = response[0].itemsLength
    res.json([resp, { itemLength: length }])
  }
})
app.get('/industries/:name', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET')
  let name = req.params.name
  let pageNo = req.query.pageNo - 1
  let data = industryFilteredData.filter((item) => {
    let a = item.name.replace(' ', '')
    return a === name
  })
  let response = [
    {
      pagination: data[0].pagination.length > 0 ? data[0].pagination : false,
      itemsLength: [data[0].items.length],
      items: data[0].pagination.length === 0 ? data[0].items : false,
    },
  ]
  if (response[0].pagination) {
    let resp = response[0].pagination[pageNo]
    let length = response[0].itemsLength
    res.json([resp, { itemLength: length }])
  } else {
    let resp = response[0].items
    let length = response[0].itemsLength
    res.json([resp, { itemLength: length }])
  }
})

app.get('/marketkCap/:name', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET')
  let pageNo = req.query.pageNo

  // formatting range from "$30000-$40000" to a=30000 and b=40000
  let name = req.params.name
    .replaceAll(' ', '')
    .replaceAll('$', '')
    .replaceAll(',', '')
    .split('-')
  let min = Number(name[0])
  let max = Number(name[1])

  let data = marketCapsFilteredData.filter((item) => {
    let val = item.name.replace(/[^0-9.-]+/g, '').replace('.00', '')
    return val >= min && val <= max
  })
  console.log(name)
  let a = pageNo === 1 ? 0 : pageNo * 30 - 30
  let b = pageNo * 30
  let sliced = data?.map((item) => item?.items[0]).slice(a, b)
  let response = [
    { pageNo: Number(pageNo), items: sliced },
    { itemLength: [data.length] },
  ]
  return res.json(response)
})

const getDataById = async (id, TABLE_NAME) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      Symbol: id,
    },
  }
  const data = await dynamoClient.get(params).promise()
  // console.log(data)
  return data
}

app.get('/companydetails/:symbol', async (req, res) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET')
  const PROFILE_TABLENAME = 'CompanyProfile'
  const SHARES_TABLENAME = 'SharesFloat'
  const FINANCIALRATIO_TABLENAME = 'FinancialRatiosTTM'
  const KEYMETRICS_TABLENAME = 'KeyMetricsTTM'
  const RATING_TABLENAME = 'Ratings'
  const REALTIMEQUOTES_TABLENAME = 'RealTimeQuotes'
  const FINANCIALGROWTH_TABLENAME = 'FinancialGrowthANN'
  const PEERS_TABLENAME = 'Peers'
  const id = req.params.symbol

  try {
    // const companyProfile = await getDataById(id, PROFILE_TABLENAME)
    // const companyShares = await getDataById(id, SHARES_TABLENAME)
    // const comapnyFinancialRatio = await getDataById(id, FINANCIALRATIO_TABLENAME)
    // const comapnyKeymetrics = await getDataById(id, KEYMETRICS_TABLENAME)
    // const comapnyRating = await getDataById(id, RATING_TABLENAME)
    // const comapnyRealTimeQuote = await getDataById(id, REALTIMEQUOTES_TABLENAME)
    // const comapnyFinancialGrowth = await getDataById(id, FINANCIALGROWTH_TABLENAME)
    const companyProfile = allCompanyProfile.find((item) => item.Symbol === id)
    const companyShares = allSharesFloat.find((item) => item.Symbol === id)
    const comapnyFinancialRatio = allFinancialRatios.find(
      (item) => item.Symbol === id,
    )
    const comapnyKeymetrics = allKeyMetrics.find((item) => item.Symbol === id)
    const comapnyRating = allRatings.find((item) => item.Symbol === id)
    const comapnyRealTimeQuote = allRealTimeQuotes.find(
      (item) => item.Symbol === id,
    )
    const comapnyFinancialGrowth = allFinancialGrowth.find(
      (item) => item.Symbol === id,
    )
    const competitors = Peers.find((item) => item.Symbol === id)

    res.json({
      companyProfile,
      companyShares,
      comapnyFinancialRatio,
      comapnyKeymetrics,
      comapnyRating,
      comapnyRealTimeQuote,
      comapnyFinancialGrowth,
      competitors,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ err: 'Something went wrong' })
    return
  }
})

app.get('/competitors/:symbol', async (req, res) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET')
  const Peers_Table = 'Peers'
  const id = req.params.symbol
  try {
    // const profile = await getDataById(id, Peers_Table)
    // const competitorsSymbols = profile?.Item?.Info?.Peers
    const profile = Peers.find((item) => item.Symbol === id)
    // const competitorsSymbols = profile?.Item?.Info?.Peers
    const competitorsSymbols = profile?.Peers
    let c = []
    competitorsSymbols.map((item) => {
      sortedData.map((i) => {
        let con = false

        if (i.Symbol === item) {
          c.map((a) => {
            if (a[0] === item) {
              con = true
            }
          })
          if (!con) {
            c.push([item, i.Info.companyname])
          }
        }
      })
    })

    // const competitorsNames = async () => Promise?.all(competitorsSymbols?.map((competitor) => getDataById(competitor, 'CompanyProfile')))
    // competitorsNames()
    //   .then(data => {
    //     data.map(({ Item: { Info: { companyname } } }) => c.push(companyname))
    //   })
    //   .then(() => {
    //     let b = []
    //     c.map((i, index) => {
    //       b.push([competitorsSymbols[index], i])
    //     })
    res.json(c)

    //   })
  } catch (error) {
    console.error(error)
    res.status(500).json({ err: 'Something went wrong' })
  }
})
app.get('/topgainers', (req, res) => {
  res.json(topGainers)
})
app.get('/topactive', (req, res) => {
  res.json(topActive)
})
app.get('/toplosers', (req, res) => {
  res.json(topLosers)
})

app.get('/companynames', async (req, res) => {
  let companynames = searchingFilter()
  let companyname = req.query.companyname
  if (!companyname) {
    res.json(companynames)
  } else {
    const filtered = sortedData.filter(
      (item) => item.Info.companyname === companyname,
    )
    res.json(filtered)
  }
})



app.post('/filteredData', jsonParser, (req, res) => {
  let filterlabel = req.query.filterlabel
  let filterCondition = req.query.filterCondition
  let filterValue = req.query.filterValue
  // let data = { profile: [], financial: [] }
  // let newData = []
  // req.body.data.map((i) => {
  //   sortedData.map((item) => i.Symbol == item.Symbol && data.profile.push(item))
  //   allFinancialRatios.map(
  //     (item) => i.Symbol == item.Symbol && data.financial.push(item),
  //   )
  // })
  // data.profile.map((item) => {
  //   data.financial.map(
  //     (i) => item.Symbol === i.Symbol && newData.push([i.Info, item.Info]),
  //   )
  // })

  customRoutes.push({
    filterlabel,
    filterCondition,
    filterValue,
    tableName: req.body.tablename,
    url: req.body.url,
    headerText: req.body.headerText,
  })
  addCustomRouteToSheet({
    filterlabel,
    filterCondition,
    filterValue,
    tableName: req.body.tablename,
    url: req.body.url,
    headerText: req.body.headerText,
  })
  res.send(`https://humbletitan-nextjs.vercel.app/due-diligence/filtered/${req.body.url}`)
})

app.get('/filtered-data/:slug', async (req, res) => {
  const slug = req.params.slug
  const slugData = await customRoutes.find((item) => item.url === slug)
  console.log('slug', slug)
  console.log('slugData', slugData)

  const filterlabel = slugData.filterlabel.toLowerCase()
  const filterCondition = slugData.filtercondition
  const filterValue = slugData.filtervalue
  const headerText = {heading: slugData.heading, description: slugData.description} 
  const tableName = slugData.tablename

  let filteredData = []
  const filtertionOfFilteredData = (filtered) => {
    const fD = filtered
    // fD.sort((a, b) => a?.Info[filter.toLocaleLowerCase()] - b?.Info[filter.toLocaleLowerCase()])
    let newData = []
    if (fD.length > 50) {
      for (let i = 1; i <= 50; i++) {
        newData.push(fD[i])
      }
      let d = { data: [...newData] }
      filteredData = d
    } else {
      let d = { data: fD }
      filteredData = d
    }
    // let newCompanies = []
    // fD.map(item=>{
    //     allCompanies.map(i=> item?.Symbol === i?.Symbol && newCompanies.push(i) )
    // })
    // setAllFilteredCompanies([...newCompanies])
    // setLoading(false)
  }
  if (filterCondition === 'Starting With') {
    let filtered = []
    switch (`all${tableName}`) {
      case 'allCompanyProfile':
        allCompanyProfile.map((item) => {
          item.Info[filterlabel][0] === filterValue && filtered.push(item)
        })
        break
      case 'allSharesFloat':
        allSharesFloat.map((item) => {
          item.Info[filterlabel][0] === filterValue && filtered.push(item)
        })
        break
      case 'allFinancialRatios':
        allFinancialRatios.map((item) => {
          item.Info[filterlabel][0] === filterValue && filtered.push(item)
        })
        break
      case 'allKeyMetrics':
        allKeyMetrics.map((item) => {
          item.Info[filterlabel][0] === filterValue && filtered.push(item)
        })
        break
      case 'allRatings':
        allRatings.map((item) => {
          item.Info[filterlabel][0] === filterValue && filtered.push(item)
        })
        break
      case 'allRealTimeQuotes':
        allRealTimeQuotes.map((item) => {
          item.Info[filterlabel][0] === filterValue && filtered.push(item)
        })
        break
      case 'allFinancialGrowth':
        allFinancialGrowth.map((item) => {
          item.Info[filterlabel][0] === filterValue && filtered.push(item)
        })
        break
    }
    filtertionOfFilteredData(filtered)
  } else if (filterCondition === 'Ending With') {
    const filtered = []
    switch (`all${tableName}`) {
      case 'allCompanyProfile':
        allCompanyProfile.map((item) => {
          item.Info[filterlabel][item.Info[filterlabel].length - 1] ===
            filterValue && filtered.push(item)
        })
        break
      case 'allSharesFloat':
        allSharesFloat.map((item) => {
          item.Info[filterlabel][item.Info[filterlabel].length - 1] ===
            filterValue && filtered.push(item)
        })
        break
      case 'allFinancialRatios':
        allFinancialRatios.map((item) => {
          item.Info[filterlabel][item.Info[filterlabel].length - 1] ===
            filterValue && filtered.push(item)
        })
        break
      case 'allKeyMetrics':
        allKeyMetrics.map((item) => {
          item.Info[filterlabel][item.Info[filterlabel].length - 1] ===
            filterValue && filtered.push(item)
        })
        break
      case 'allRatings':
        allRatings.map((item) => {
          item.Info[filterlabel][item.Info[filterlabel].length - 1] ===
            filterValue && filtered.push(item)
        })
        break
      case 'allRealTimeQuotes':
        allRealTimeQuotes.map((item) => {
          item.Info[filterlabel][item.Info[filterlabel].length - 1] ===
            filterValue && filtered.push(item)
        })
        break
      case 'allFinancialGrowth':
        allFinancialGrowth.map((item) => {
          item.Info[filterlabel][item.Info[filterlabel].length - 1] ===
            filterValue && filtered.push(item)
        })
        break
    }
    filtertionOfFilteredData(filtered)
  } else if (filterCondition === 'Equal To') {
    const filtered = []
    switch (`all${tableName}`) {
      case 'allSharesFloat':
        allSharesFloat.map((item) => {
          item.Info[filterlabel] == filterValue && filtered.push(item)
        })
        break
      case 'allCompanyProfile':
        allCompanyProfile.map((item) => {
          item.Info[filterlabel] == filterValue && filtered.push(item)
        })
        break
      case 'allFinancialRatios':
        allFinancialRatios.map((item) => {
          item.Info[filterlabel] == filterValue && filtered.push(item)
        })
        break
      case 'allKeyMetrics':
        allKeyMetrics.map((item) => {
          item.Info[filterlabel] == filterValue && filtered.push(item)
        })
        break
      case 'allRatings':
        allRatings.map((item) => {
          item.Info[filterlabel] == filterValue && filtered.push(item)
        })
        break
      case 'allRealTimeQuotes':
        allRealTimeQuotes.map((item) => {
          item.Info[filterlabel] == filterValue && filtered.push(item)
        })
        break
      case 'allFinancialGrowth':
        allFinancialGrowth.map((item) => {
          item.Info[filterlabel] == filterValue && filtered.push(item)
        })
        break
    }
    filtertionOfFilteredData(filtered)
  } else if (filterCondition === 'Greater Than') {
    const filtered = []
    let valueSearched = +filterValue
    let valueOfItem

    switch (`all${tableName}`) {
      case 'allCompanyProfile':
        allCompanyProfile.map((item) => {
          valueOfItem = +item.Info[filterlabel]
          valueOfItem > valueSearched &&
            valueOfItem != '' &&
            filtered.push(item)
        })
        break
      case 'allSharesFloat':
        allSharesFloat.map((item) => {
          valueOfItem = +item.Info[filterlabel]
          valueOfItem > valueSearched &&
            valueOfItem != '' &&
            filtered.push(item)
        })
        break
      case 'allFinancialRatios':
        allFinancialRatios.map((item) => {
          valueOfItem = +item.Info[filterlabel]
          valueOfItem > valueSearched &&
            valueOfItem != '' &&
            filtered.push(item)
        })
        break
      case 'allKeyMetrics':
        allKeyMetrics.map((item) => {
          valueOfItem = +item.Info[filterlabel]
          valueOfItem > valueSearched &&
            valueOfItem != '' &&
            filtered.push(item)
        })
        break
      case 'allRatings':
        allRatings.map((item) => {
          valueOfItem = +item.Info[filterlabel]
          valueOfItem > valueSearched &&
            valueOfItem != '' &&
            filtered.push(item)
        })
        break
      case 'allRealTimeQuotes':
        allRealTimeQuotes.map((item) => {
          valueOfItem = +item.Info[filterlabel]
          valueOfItem > valueSearched &&
            valueOfItem != '' &&
            filtered.push(item)
        })
        break
      case 'allFinancialGrowth':
        allFinancialGrowth.map((item) => {
          valueOfItem = +item.Info[filterlabel]
          valueOfItem > valueSearched &&
            valueOfItem != '' &&
            filtered.push(item)
        })
        break
    }
    filtered.sort((a, b) => a?.Info[filterlabel] - b?.Info[filterlabel])
    filtertionOfFilteredData(filtered)
  } else if (filterCondition === 'Less Than') {
    let valueSearched = +filterValue
    let valueOfItem

    const filtered = []
    switch (`all${tableName}`) {
      case 'allCompanyProfile':
        allCompanyProfile.map((item) => {
          valueOfItem = +item.Info[filterlabel]
          valueOfItem < valueSearched &&
            valueOfItem != '' &&
            filtered.push(item)
        })
        break
      case 'allSharesFloat':
        allSharesFloat.map((item) => {
          valueOfItem = +item.Info[filterlabel]
          valueOfItem < valueSearched &&
            valueOfItem != '' &&
            filtered.push(item)
        })
        break
      case 'allFinancialRatios':
        allFinancialRatios.map((item) => {
          valueOfItem = +item.Info[filterlabel]
          valueOfItem < valueSearched &&
            valueOfItem != '' &&
            filtered.push(item)
        })
        break
      case 'allKeyMetrics':
        allKeyMetrics.map((item) => {
          valueOfItem = +item.Info[filterlabel]
          valueOfItem < valueSearched &&
            valueOfItem != '' &&
            filtered.push(item)
        })
        break
      case 'allRatings':
        allRatings.map((item) => {
          valueOfItem = +item.Info[filterlabel]
          valueOfItem < valueSearched &&
            valueOfItem != '' &&
            filtered.push(item)
        })
        break
      case 'allRealTimeQuotes':
        allRealTimeQuotes.map((item) => {
          valueOfItem = +item.Info[filterlabel]
          valueOfItem < valueSearched &&
            valueOfItem != '' &&
            filtered.push(item)
        })
        break
      case 'allFinancialGrowth':
        allFinancialGrowth.map((item) => {
          valueOfItem = +item.Info[filterlabel]
          valueOfItem < valueSearched &&
            valueOfItem != '' &&
            filtered.push(item)
        })
        break
    }
    filtered.sort((a, b) => b?.Info[filterlabel] - a?.Info[filterlabel])
    filtertionOfFilteredData(filtered)
  }

  let data = { profile: [], financial: [] }
  let newData = []
  console.log("filteredData", filteredData)
  filteredData.data.map((i) => {
    sortedData.map((item) => i.Symbol == item.Symbol && data.profile.push(item))
    allFinancialRatios.map(
      (item) => i.Symbol == item.Symbol && data.financial.push(item),
    )
  })
  data.profile.map((item) => {
    data.financial.map(
      (i) => item.Symbol === i.Symbol && newData.push([i.Info, item.Info]),
    )
  })

  // customRoutes.push({
  //   data: newData,
  //   url: req.body.url,
  //   headerText: req.body.headerText,
  // })
  // res.send({ filterValue, filterCondition, filterlabel })
  // res.send(`http://localhost:3000/filtered-data/${req.body.url}`)
  res.send({
    data: newData,
    filterlabel,
    filterCondition,
    filterValue,
    headerText,
  })
})

// app.post('/filtered-data/:id', (req, res) => {
//   let url = req.params.id
//   customRoutes.map((item) => {
//     if (item.url == url) {
//       res.json(item.data)
//     }
//   })
// })

app.get('/charts/:symbol', async (req, res, next) => {
  const CHART_TABLENAME = 'CompanyClose'
  const id = req.params.symbol

  try {
    // const chartData = await getDataById(id, CHART_TABLENAME)
    const chartData = StockColsingPrice.find((item) => item.Symbol === id)
    res.json({ chartData })
  } catch (error) {
    console.log(error)
    res.status(500).json({ err: 'Something went wrong' })
    return
  }
})

const port = process.env.PORT || 8000

app.listen(port, () => {
  console.log(`listening on http://localhost:${port}`)
})
