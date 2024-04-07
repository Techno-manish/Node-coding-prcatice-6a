function convertStateDBobjectToResponse(DBobject) {
  return {
    stateId: DBobject.state_id,
    stateName: DBobject.state_name,
    population: DBobject.population,
  }
}
exports.convertStateDBobjectToResponse = convertStateDBobjectToResponse
function convertDistrictDBobjectToResponse(DBobject) {
  return {
    districtId: DBobject.district_id,
    districtName: DBobject.district_name,
    stateId: DBobject.state_id,
    cases: DBobject.cases,
    cured: DBobject.cured,
    active: DBobject.active,
    deaths: DBobject.deaths,
  }
}

exports.convertDistrictDBobjectToResponse = convertDistrictDBobjectToResponse
