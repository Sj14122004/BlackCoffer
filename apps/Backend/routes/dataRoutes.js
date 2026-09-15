const express = require("express");

const {
  getData,
  getIntensityBySectorData,
  getLikelihoodByTopicData,
  getRelevanceByCountryData,
  getIntensityByYearData,
  getSummaryData,
  getCountryAnalysisData,
  getFilterOptionsData,
} = require("../controller/dataController");

const router = express.Router();

router.get("/", getData);
router.get("/intensity-by-sector", getIntensityBySectorData);
router.get("/likelihood-by-topic", getLikelihoodByTopicData);
router.get("/relevance-by-country", getRelevanceByCountryData);
router.get("/intensity-by-year", getIntensityByYearData);
router.get("/summary", getSummaryData);
router.get("/country-analysis", getCountryAnalysisData);
router.get("/filter-options", getFilterOptionsData);

module.exports = router;