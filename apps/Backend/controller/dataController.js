const {
  getAllData,
  getIntensityBySector,
  getLikelihoodByTopic,
  getRelevanceByCountry,
  getIntensityByYear,
  getSummary,
  getCountryAnalysis,
  getFilterOptions,
} = require("../services/dataService");

const wrapAsync = require("../utils/wrapAsync");

const getData = async (req, res) => {
  const data = await getAllData(req.query);
  res.json(data);
};

const getIntensityBySectorData = async (req, res) => {
  const data = await getIntensityBySector(req.query);
  res.json(data);
};

const getLikelihoodByTopicData = async (req, res) => {
  const data = await getLikelihoodByTopic(req.query);
  res.json(data);
};

const getRelevanceByCountryData = async (req, res) => {
  const data = await getRelevanceByCountry(req.query);
  res.json(data);
};

const getIntensityByYearData = async (req, res) => {
  const data = await getIntensityByYear(req.query);
  res.json(data);
};

const getSummaryData = async (req, res) => {
  const data = await getSummary(req.query);
  res.json(data);
};

const getCountryAnalysisData = async (req, res) => {
  const data = await getCountryAnalysis(req.query);
  res.json(data);
};

const getFilterOptionsData = async (req, res) => {
  const data = await getFilterOptions();
  res.json(data);
};

module.exports = {
  getData: wrapAsync(getData),
  getIntensityBySectorData: wrapAsync(getIntensityBySectorData),
  getLikelihoodByTopicData: wrapAsync(getLikelihoodByTopicData),
  getRelevanceByCountryData: wrapAsync(getRelevanceByCountryData),
  getIntensityByYearData: wrapAsync(getIntensityByYearData),
  getSummaryData: wrapAsync(getSummaryData),
  getCountryAnalysisData: wrapAsync(getCountryAnalysisData),
  getFilterOptionsData: wrapAsync(getFilterOptionsData),
};