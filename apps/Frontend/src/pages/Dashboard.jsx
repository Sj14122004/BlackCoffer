import { useEffect, useState } from "react";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import StatCard from "../components/dashboard/StatCard";
import ChartCard from "../components/dashboard/ChartCard";
import DataTable from "../components/dashboard/DataTable";
import {
  getSummary,
  getFilterOptions,
} from "../api/dataApi";
import { ChevronDown } from "lucide-react";

import CountryAnalysis from "../components/charts/CountryAnalysis";
import RelevanceByCountry from "../components/charts/RelevanceByCountry";
import LikelihoodByTopic from "../components/charts/LikelihoodByTopic";
import IntensityBySector from "../components/charts/IntensityBySector";
import IntensityByYear from "../components/charts/IntensityByYear";
import IntensityLikelihoodScatter from "../components/charts/IntensityLikelihoodScatter";
import RegionAnalysis from "../components/charts/RegionAnalysis";
import CityAnalysis from "../components/charts/CityAnalysis";

const Dashboard = ({ filters, setFilters, search }) => {
  const [summary, setSummary] = useState({
    averageIntensity: 0,
    averageLikelihood: 0,
    averageRelevance: 0,
  });


  const [filterOptions, setFilterOptions] = useState({
    region: [],
    sector: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        const data = await getFilterOptions();

        setFilterOptions({
          region: data.region || [],
          sector: data.sector || [],
        });
      } catch (error) {
        console.error(
          "Failed to load filter options:",
          error
        );
      }
    };

    loadFilterOptions();
  }, []);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getSummary({
          ...filters,
          search,
        });

        setSummary(data);
      } catch (error) {
        console.error(
          "Failed to fetch summary:",
          error
        );

        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [filters, search]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--surface-0, #fafafa)",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "var(--surface-2, #ffffff)",
          borderBottom:
            "1px solid var(--border, #e5e7eb)",
          position: "sticky",
          top: 0,
          zIndex: 40,
          boxShadow:
            "0 1px 3px rgba(0,0,0,0.05)",
        }}
      >
        <div
          style={{
            maxWidth: "1600px",
            margin: "0 auto",
            padding: "20px",
          }}
        >
          <DashboardHeader />

          {/* Filters Toggle */}
          <button
            onClick={() =>
              setShowFilters(!showFilters)
            }
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "transparent",
              border:
                "1px solid var(--border, #e5e7eb)",
              borderRadius: "8px",
              padding: "8px 12px",
              fontSize: "13px",
              fontWeight: "500",
              color:
                "var(--text-primary, #1f2937)",
              cursor: "pointer",
              transition: "all 0.2s",
              marginTop: "16px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background =
                "var(--surface-1, #f3f4f6)";

              e.currentTarget.style.borderColor =
                "var(--border-strong, #d1d5db)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background =
                "transparent";

              e.currentTarget.style.borderColor =
                "var(--border, #e5e7eb)";
            }}
          >
            <span>Advanced Filters</span>

            <ChevronDown
              size={16}
              style={{
                transform: showFilters
                  ? "rotate(180deg)"
                  : "rotate(0deg)",
                transition:
                  "transform 0.3s",
              }}
            />
          </button>

          {/* Expandable Filters */}
          {showFilters && (
            <div
              style={{
                marginTop: "12px",
                padding: "15px",
                background:
                  "var(--surface-1, #f9fafb)",
                borderRadius: "8px",
                border:
                  "1px solid var(--border, #e5e7eb)",
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "12px",
              }}
            >
              {/* Region */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "11px",
                    fontWeight: "600",
                    marginBottom: "6px",
                    color:
                      "var(--text-secondary, #6b7280)",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Region
                </label>

                <select
                  value={filters.region || ""}
                  onChange={(e) =>
                    handleFilterChange(
                      "region",
                      e.target.value
                    )
                  }
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "6px",
                    border:
                      "1px solid var(--border, #d1d5db)",
                    fontSize: "13px",
                    background:
                      "var(--surface-2, #ffffff)",
                    color:
                      "var(--text-primary, #1f2937)",
                    cursor: "pointer",
                  }}
                >
                  <option value="">
                    All Regions
                  </option>

                  {filterOptions.region.map(
                    (region) => (
                      <option
                        key={region}
                        value={region}
                      >
                        {region}
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* Sector */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "11px",
                    fontWeight: "600",
                    marginBottom: "6px",
                    color:
                      "var(--text-secondary, #6b7280)",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Sector
                </label>

                <select
                  value={filters.sector || ""}
                  onChange={(e) =>
                    handleFilterChange(
                      "sector",
                      e.target.value
                    )
                  }
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "6px",
                    border:
                      "1px solid var(--border, #d1d5db)",
                    fontSize: "13px",
                    background:
                      "var(--surface-2, #ffffff)",
                    color:
                      "var(--text-primary, #1f2937)",
                    cursor: "pointer",
                  }}
                >
                  <option value="">
                    All Sectors
                  </option>

                  {filterOptions.sector.map(
                    (sector) => (
                      <option
                        key={sector}
                        value={sector}
                      >
                        {sector}
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* Reset */}
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                }}
              >
                <button
                  onClick={() => setFilters({})}
                  style={{
                    flex: 1,
                    padding: "8px 12px",
                    borderRadius: "6px",
                    border:
                      "1px solid var(--border, #d1d5db)",
                    background: "transparent",
                    fontSize: "12px",
                    fontWeight: "500",
                    color:
                      "var(--text-primary, #1f2937)",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background =
                      "var(--surface-0, #f9fafb)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background =
                      "transparent";
                  }}
                >
                  Reset All
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div
        style={{
          maxWidth: "1600px",
          margin: "0 auto",
          padding: "20px",
        }}
      >
        {/* Error Alert */}
        {error && (
          <div
            style={{
              background: "#fee2e2",
              border: "1px solid #fecaca",
              borderRadius: "8px",
              padding: "12px 16px",
              marginBottom: "20px",
              color: "#991b1b",
              fontSize: "14px",
            }}
          >
            {error}
          </div>
        )}

        {/* Stat Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          <StatCard
            title="Average Intensity"
            value={
              loading
                ? "..."
                : summary.averageIntensity.toFixed(2)
            }
            icon="📊"
            trend="+2.5%"
          />

          <StatCard
            title="Average Likelihood"
            value={
              loading
                ? "..."
                : summary.averageLikelihood.toFixed(2)
            }
            icon="📈"
            trend="+1.2%"
          />

          <StatCard
            title="Average Relevance"
            value={
              loading
                ? "..."
                : summary.averageRelevance.toFixed(2)
            }
            icon="⭐"
            trend="+3.1%"
          />
        </div>

        {/* Charts Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(500px, 1fr))",
            gap: "20px",
          }}
        >
          {/* Country Analysis */}
          <div style={{ gridColumn: "1 / -1" }}>
            <ChartCard
              title="Country Analysis"
              description="Compare average intensity across countries."
            >
              <CountryAnalysis
                filters={filters}
                search={search}
              />
            </ChartCard>
          </div>

          {/* Relevance by Country */}
          <div style={{ gridColumn: "1 / -1" }}>
            <ChartCard
              title="Relevance by Country"
              description="Compare average relevance across countries."
            >
              <RelevanceByCountry
                filters={filters}
                search={search}
              />
            </ChartCard>
          </div>

          {/* Region Analysis */}
          <div style={{ gridColumn: "1 / -1" }}>
            <ChartCard
              title="Region Analysis"
              description="Compare the number of data records across regions."
            >
              <RegionAnalysis
                filters={filters}
                search={search}
              />
            </ChartCard>
          </div>

          {/* City Analysis */}
          <div style={{ gridColumn: "1 / -1" }}>
            <ChartCard
              title="City Analysis"
              description="Explore the cities with the highest number of data records."
            >
              <CityAnalysis
                filters={filters}
                search={search}
              />
            </ChartCard>
          </div>

          {/* Topic Analysis */}
          <ChartCard
            title="Topic Analysis"
            description="Explore likelihood across different topics."
          >
            <LikelihoodByTopic
              filters={filters}
              search={search}
            />
          </ChartCard>

          {/* Sector Analysis */}
          <ChartCard
            title="Sector Analysis"
            description="Compare intensity across different sectors."
          >
            <IntensityBySector
              filters={filters}
              search={search}
            />
          </ChartCard>

          {/* Year Analysis */}
          <ChartCard
            title="Year Analysis"
            description="Explore how intensity changes across different years."
          >
            <IntensityByYear
              filters={filters}
              search={search}
            />
          </ChartCard>

          {/* Intensity vs Likelihood */}
          <ChartCard
            title="Intensity vs Likelihood"
            description="Explore the relationship between intensity and likelihood."
          >
            <IntensityLikelihoodScatter
              filters={filters}
              search={search}
            />
          </ChartCard>

          {/* Data Table */}
          <div style={{ gridColumn: "1 / -1" }}>
            <ChartCard
              title="Data Records"
              description="View individual records from the Blackcoffer dataset."
            >
              <DataTable
                filters={filters}
                search={search}
              />
            </ChartCard>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          borderTop:
            "1px solid var(--border, #e5e7eb)",
          background:
            "var(--surface-2, #ffffff)",
          padding: "16px 20px",
          textAlign: "center",
          color:
            "var(--text-secondary, #6b7280)",
          fontSize: "12px",
          marginTop: "20px",
        }}
      >
        Last updated:{" "}
        {new Date().toLocaleTimeString()} | Dashboard
        Version 2.0
      </div>

      {/* Responsive Styles */}
      <style>{`
        @media (max-width: 768px) {
          div[style*="grid-template-columns"] {
            grid-template-columns: 1fr !important;
          }
        }

        @media (prefers-color-scheme: dark) {
          body {
            background-color: var(--surface-0, #1f2937);
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;