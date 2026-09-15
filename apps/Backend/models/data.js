const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema(
  {
    end_year: String,
    intensity: Number,
    sector: String,
    topic: String,
    insight: String,
    url: String,
    region: String,
    start_year: String,
    impact: String,
    added: String,
    published: String,
    country: String,
    relevance: Number,
    pestle: String,
    source: String,
    title: String,
    likelihood: Number,
    swot: String,
    city: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Data", dataSchema);