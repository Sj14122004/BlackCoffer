const Data = require("../models/data");

const buildQuery = (filters = {}) => {
  const {
    country,
    topic,
    sector,
    region,
    pestle,
    source,
    swot,
    city,
    end_year,
    search,
  } = filters;

  const query = {};

  const exactMatch = (value) => ({
  $regex: `^${String(value).trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
  $options: "i",
  });

  if (country) query.country = exactMatch(country);
  if (topic) query.topic = exactMatch(topic);
  if (sector) query.sector = exactMatch(sector);
  if (region) query.region = exactMatch(region);
  if (pestle) query.pestle = exactMatch(pestle);
  if (source) query.source = exactMatch(source);
  if (swot) query.swot = exactMatch(swot);
  if (city) query.city = exactMatch(city);
  if (end_year) query.end_year = exactMatch(end_year);

  if (search && search.trim()) {
    const searchRegex = {
      $regex: search.trim(),
      $options: "i",
    };

    query.$or = [
      { country: searchRegex },
      { topic: searchRegex },
      { sector: searchRegex },
      { region: searchRegex },
      { pestle: searchRegex },
      { source: searchRegex },
      { swot: searchRegex },
      { city: searchRegex },
      { title: searchRegex },
      { insight: searchRegex },
      { end_year: searchRegex },
      { start_year: searchRegex },
      { added: searchRegex },
      { published: searchRegex },
    ];
  }

  return query;
};

const getAllData = async (filters = {}) => {
  const {
    page = 1,
    limit = 20,
  } = filters;

  const query = buildQuery(filters);

  const currentPage = Math.max(Number(page) || 1, 1);
  const currentLimit = Math.max(Number(limit) || 20, 1);
  const skip = (currentPage - 1) * currentLimit;

  const [data, total] = await Promise.all([
    Data.find(query)
      .skip(skip)
      .limit(currentLimit)
      .lean(),

    Data.countDocuments(query),
  ]);

  return {
    data,
    pagination: {
      page: currentPage,
      limit: currentLimit,
      total,
      pages: Math.ceil(total / currentLimit),
    },
  };
};

const getIntensityBySector = async (filters = {}) => {
  const query = buildQuery(filters);

  return Data.aggregate([
    { $match: query },
    {
      $group: {
        _id: "$sector",
        averageIntensity: {
          $avg: "$intensity",
        },
      },
    },
    {
      $match: {
        _id: { $nin: [null, ""] },
      },
    },
    {
      $sort: {
        averageIntensity: -1,
      },
    },
  ]);
};

const getLikelihoodByTopic = async (filters = {}) => {
  const query = buildQuery(filters);

  return Data.aggregate([
    { $match: query },
    {
      $group: {
        _id: "$topic",
        averageLikelihood: {
          $avg: "$likelihood",
        },
      },
    },
    {
      $match: {
        _id: { $nin: [null, ""] },
      },
    },
    {
      $sort: {
        averageLikelihood: -1,
      },
    },
  ]);
};

const getRelevanceByCountry = async (filters = {}) => {
  const query = buildQuery(filters);

  return Data.aggregate([
    { $match: query },
    {
      $group: {
        _id: "$country",
        averageRelevance: {
          $avg: "$relevance",
        },
      },
    },
    {
      $match: {
        _id: { $nin: [null, ""] },
      },
    },
    {
      $sort: {
        averageRelevance: -1,
      },
    },
  ]);
};

const getIntensityByYear = async (filters = {}) => {
  const query = buildQuery(filters);

  return Data.aggregate([
    { $match: query },
    {
      $group: {
        _id: "$end_year",
        averageIntensity: {
          $avg: "$intensity",
        },
      },
    },
    {
      $match: {
        _id: { $nin: [null, ""] },
      },
    },
    {
      $sort: {
        _id: 1,
      },
    },
  ]);
};

const getSummary = async (filters = {}) => {
  const query = buildQuery(filters);

  const result = await Data.aggregate([
    { $match: query },
    {
      $group: {
        _id: null,
        averageIntensity: {
          $avg: "$intensity",
        },
        averageLikelihood: {
          $avg: "$likelihood",
        },
        averageRelevance: {
          $avg: "$relevance",
        },
      },
    },
  ]);

  if (result.length === 0) {
    return {
      averageIntensity: 0,
      averageLikelihood: 0,
      averageRelevance: 0,
    };
  }

  return {
    averageIntensity: result[0].averageIntensity || 0,
    averageLikelihood: result[0].averageLikelihood || 0,
    averageRelevance: result[0].averageRelevance || 0,
  };
};

const getCountryAnalysis = async (filters = {}) => {
  const query = buildQuery(filters);

  return Data.aggregate([
    { $match: query },
    {
      $group: {
        _id: "$country",
        averageIntensity: {
          $avg: "$intensity",
        },
        averageLikelihood: {
          $avg: "$likelihood",
        },
        averageRelevance: {
          $avg: "$relevance",
        },
      },
    },
    {
      $match: {
        _id: { $nin: [null, ""] },
      },
    },
    {
      $sort: {
        averageIntensity: -1,
      },
    },
  ]);
};

const getFilterOptions = async () => {
  const result = await Data.aggregate([
    {
      $facet: {
        end_year: [
          { $match: { end_year: { $nin: [null, ""] } } },
          { $group: { _id: "$end_year" } },
          { $sort: { _id: 1 } },
        ],
        topic: [
          { $match: { topic: { $nin: [null, ""] } } },
          { $group: { _id: "$topic" } },
          { $sort: { _id: 1 } },
        ],
        sector: [
          { $match: { sector: { $nin: [null, ""] } } },
          { $group: { _id: "$sector" } },
          { $sort: { _id: 1 } },
        ],
        region: [
          { $match: { region: { $nin: [null, ""] } } },
          { $group: { _id: "$region" } },
          { $sort: { _id: 1 } },
        ],
        pestle: [
          { $match: { pestle: { $nin: [null, ""] } } },
          { $group: { _id: "$pestle" } },
          { $sort: { _id: 1 } },
        ],
        source: [
          { $match: { source: { $nin: [null, ""] } } },
          { $group: { _id: "$source" } },
          { $sort: { _id: 1 } },
        ],
        swot: [
          { $match: { swot: { $nin: [null, ""] } } },
          { $group: { _id: "$swot" } },
          { $sort: { _id: 1 } },
        ],
        country: [
          { $match: { country: { $nin: [null, ""] } } },
          { $group: { _id: "$country" } },
          { $sort: { _id: 1 } },
        ],
        city: [
          { $match: { city: { $nin: [null, ""] } } },
          { $group: { _id: "$city" } },
          { $sort: { _id: 1 } },
        ],
      },
    },
  ]);

  const options = result[0];

  return {
    end_year: options.end_year.map((item) => item._id),
    topic: options.topic.map((item) => item._id),
    sector: options.sector.map((item) => item._id),
    region: options.region.map((item) => item._id),
    pestle: options.pestle.map((item) => item._id),
    source: options.source.map((item) => item._id),
    swot: options.swot.map((item) => item._id),
    country: options.country.map((item) => item._id),
    city: options.city.map((item) => item._id),
  };
};

module.exports = {
  getAllData,
  getIntensityBySector,
  getLikelihoodByTopic,
  getRelevanceByCountry,
  getIntensityByYear,
  getSummary,
  getCountryAnalysis,
  getFilterOptions,
};