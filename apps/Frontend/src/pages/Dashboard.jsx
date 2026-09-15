import { useEffect, useState } from "react";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import StatCard from "../components/dashboard/StatCard";
import ChartCard from "../components/dashboard/ChartCard";
import DataTable from "../components/dashboard/DataTable";
import { getSummary } from "../api/dataApi";

import CountryAnalysis from "../components/charts/CountryAnalysis";
import RelevanceByCountry from "../components/charts/RelevanceByCountry";
import LikelihoodByTopic from "../components/charts/LikelihoodByTopic";
import IntensityBySector from "../components/charts/IntensityBySector";
import IntensityByYear from "../components/charts/IntensityByYear";
import IntensityLikelihoodScatter from "../components/charts/IntensityLikelihoodScatter";
import RegionAnalysis from "../components/charts/RegionAnalysis";
import CityAnalysis from "../components/charts/CityAnalysis";

const Dashboard = ({ filters, search }) => {
  const [summary, setSummary] = useState({
    averageIntensity: 0,
    averageLikelihood: 0,
    averageRelevance: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
    <div className="container-fluid p-4">
      <DashboardHeader />

      {error && (
        <div className="alert alert-danger mb-4">
          {error}
        </div>
      )}

      <div className="row g-4 mb-4">
        <StatCard
          title="Average Intensity"
          value={
            loading
              ? "..."
              : summary.averageIntensity.toFixed(2)
          }
        />

        <StatCard
          title="Average Likelihood"
          value={
            loading
              ? "..."
              : summary.averageLikelihood.toFixed(2)
          }
        />

        <StatCard
          title="Average Relevance"
          value={
            loading
              ? "..."
              : summary.averageRelevance.toFixed(2)
          }
        />
      </div>

      <div className="row g-4">
        <div className="col-12">
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

        <div className="col-12">
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

        <div className="col-12">
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
        
        <div className="col-12">
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
        
        <div className="col-12 col-xl-6">
          <ChartCard
            title="Topic Analysis"
            description="Explore likelihood across different topics."
          >
            <LikelihoodByTopic
              filters={filters}
              search={search}
            />
          </ChartCard>
        </div>

        <div className="col-12 col-xl-6">
          <ChartCard
            title="Sector Analysis"
            description="Compare intensity across different sectors."
          >
            <IntensityBySector
              filters={filters}
              search={search}
            />
          </ChartCard>
        </div>

        <div className="col-12 col-xl-6">
          <ChartCard
            title="Year Analysis"
            description="Explore how intensity changes across different years."
          >
            <IntensityByYear
              filters={filters}
              search={search}
            />
          </ChartCard>
        </div>

        <div className="col-12 col-xl-6">
          <ChartCard
            title="Intensity vs Likelihood"
            description="Explore the relationship between intensity and likelihood."
          >
            <IntensityLikelihoodScatter
              filters={filters}
              search={search}
            />
          </ChartCard>
        </div>

        <div className="col-12">
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
  );
};

export default Dashboard;