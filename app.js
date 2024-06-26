const express = require('express')
const {
  convertStateDBobjectToResponse,
  convertDistrictDBobjectToResponse,
} = require('./DBobjectTOResponse')
const path = require('path')

const {open} = require('sqlite')
const sqlite3 = require('sqlite3')

const app = express()
app.use(express.json())
const dbPath = path.join(__dirname, 'covid19India.db')

db = null
const PORT = 3000

const initializeDBandServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(PORT, () => {
      console.log(`Server started at port ${PORT}`)
    })
  } catch (e) {
    console.log(`Error: ${e}`)
  }
}

initializeDBandServer()

//API 1 Returns a list of all states in the state table
app.get('/states/', async (request, response) => {
  const getStatesQuery = `
    SELECT
        *
    FROM
        state;
    `
  const states = await db.all(getStatesQuery)
  response.send(
    states.map(eachState => convertStateDBobjectToResponse(eachState)),
  )
})

//API 2 Returns a state based on the state ID
app.get('/states/:stateId', async (request, response) => {
  const {stateId} = request.params
  const getStateQuery = `
    SELECT
      *
    FROM
      state
    WHERE
      state_id = ${stateId};
    `
  const state = await db.get(getStateQuery)
  response.send(convertStateDBobjectToResponse(state))
})

//API 3 Create a district in the district table, district_id is auto-incremented
app.post('/districts/', async (request, response) => {
  const districtDetails = request.body
  const {districtName, stateId, cases, cured, active, deaths} = districtDetails
  const addDistrictQuery = `
  INSERT INTO
  district (district_name,state_id,cases,cured,active,deaths)
  VALUES
  (
    '${districtName}',
    ${stateId},
    ${cases},
    ${cured},
    ${active},
    ${deaths}
  );
  `
  await db.run(addDistrictQuery)
  response.send('District Successfully Added')
})

//API 4 Returns a district based on the district ID

app.get('/districts/:districtId/', async (request, response) => {
  const {districtId} = request.params
  const getDistrictQuery = `
  SELECT 
    *
  FROM
    district
  WHERE
    district_id = ${districtId};
  `
  const district = await db.get(getDistrictQuery)
  response.send(convertDistrictDBobjectToResponse(district))
})

//API 5 Deletes a district from the district table based on the district ID

app.delete('/districts/:districtId/', async (request, response) => {
  const {districtId} = request.params
  const deleteDistrictQuery = `
  DELETE FROM
    district
  WHERE
    district_id = ${districtId};
  `
  await db.run(deleteDistrictQuery)
  response.send('District Removed')
})

//API 6 Updates the details of a specific district based on the district ID

app.put('/districts/:districtId/', async (request, response) => {
  const {districtId} = request.params
  const districtDetails = request.body
  const {districtName, stateId, cases, cured, active, deaths} = districtDetails
  const updateDistrictQuery = `
  UPDATE
    district
  SET
    district_name = '${districtName}',
    state_id = ${stateId},
    cases = ${cases},
    cured = ${cured},
    active = ${active},
    deaths = ${deaths}
  WHERE
    district_id = ${districtId};
  `
  await db.run(updateDistrictQuery)
  response.send('District Details Updated')
})

//API 7 Returns the statistics of total cases, cured, active, deaths of a specific state based on state ID
app.get('/states/:stateId/stats/', async (request, response) => {
  const {stateId} = request.params
  const getStatisticsQuery = `
  SELECT
    SUM(cases) as totalCases,
    SUM(cured) as totalCured,
    SUM(active) as totalActive,
    SUM(deaths) as totalDeaths
  FROM
    district
  WHERE
    state_id = ${stateId};
  `
  const statistics = await db.get(getStatisticsQuery)
  response.send(statistics)
})

//API 8 Returns an object containing the state name of a district based on the district ID
app.get('/districts/:districtId/details/', async (request, response) => {
  const {districtId} = request.params
  const getStateNameQuery = `
  SELECT
    state.state_name
  FROM 
    state JOIN district ON state.state_id = district.state_id
  WHERE
   district_id = ${districtId};
  `
  const stateName = await db.get(getStateNameQuery)
  response.send(convertStateDBobjectToResponse(stateName))
})
module.exports = app
