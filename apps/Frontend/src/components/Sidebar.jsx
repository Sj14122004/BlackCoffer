import { useEffect, useState } from "react";
import {
  Calendar,
  Globe,
  MapPin,
  Settings2,
  Tags,
  X,
} from "lucide-react";

import FilterSelect from "./filters/FilterSelect";
import { getFilterOptions } from "../api/dataApi";

const initialFilters = {
  end_year: "",
  topic: "",
  sector: "",
  region: "",
  pestle: "",
  source: "",
  swot: "",
  country: "",
  city: "",
};

const Sidebar = ({
  setSidebarOpen,
  filters,
  setFilters,
}) => {
  const [options, setOptions] = useState({
    end_year: [],
    topic: [],
    sector: [],
    region: [],
    pestle: [],
    source: [],
    swot: [],
    country: [],
    city: [],
  });

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const data = await getFilterOptions();
        setOptions(data);
      } catch (error) {
        console.error(
          "Failed to fetch filter options:",
          error
        );
      }
    };

    fetchFilterOptions();
  }, []);

  const handleFilterChange = (name, value) => {
    setFilters((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  return (
    <aside
      className="bg-white border-end flex-shrink-0"
      style={{ width: "280px" }}
    >
      <div
        className="overflow-auto"
        style={{
          position: "sticky",
          top: "64px",
          height: "calc(100vh - 64px)",
        }}
      >
        <div className="p-4">
          <div className="d-flex align-items-start justify-content-between mb-4">
            <div>
              <h6 className="fw-bold mb-1">
                Filters
              </h6>

              <small className="text-secondary">
                Refine your analytics
              </small>
            </div>

            <button
              type="button"
              className="btn btn-sm btn-light border"
              onClick={() => setSidebarOpen(false)}
            >
              <X size={17} />
            </button>
          </div>

          <div className="d-flex flex-column gap-3">
            <FilterSelect
              label="End Year"
              icon={<Calendar size={15} />}
              placeholder="All Years"
              options={options.end_year}
              value={filters.end_year}
              onChange={(event) =>
                handleFilterChange(
                  "end_year",
                  event.target.value
                )
              }
            />

            <FilterSelect
              label="Topic"
              icon={<Tags size={15} />}
              placeholder="All Topics"
              options={options.topic}
              value={filters.topic}
              onChange={(event) =>
                handleFilterChange(
                  "topic",
                  event.target.value
                )
              }
            />

            <FilterSelect
              label="Sector"
              icon={<Settings2 size={15} />}
              placeholder="All Sectors"
              options={options.sector}
              value={filters.sector}
              onChange={(event) =>
                handleFilterChange(
                  "sector",
                  event.target.value
                )
              }
            />

            <FilterSelect
              label="Region"
              icon={<Globe size={15} />}
              placeholder="All Regions"
              options={options.region}
              value={filters.region}
              onChange={(event) =>
                handleFilterChange(
                  "region",
                  event.target.value
                )
              }
            />

            <FilterSelect
              label="PESTLE"
              placeholder="All PESTLE"
              options={options.pestle}
              value={filters.pestle}
              onChange={(event) =>
                handleFilterChange(
                  "pestle",
                  event.target.value
                )
              }
            />

            <FilterSelect
              label="Source"
              placeholder="All Sources"
              options={options.source}
              value={filters.source}
              onChange={(event) =>
                handleFilterChange(
                  "source",
                  event.target.value
                )
              }
            />

            <FilterSelect
              label="SWOT"
              placeholder="All SWOT"
              options={options.swot}
              value={filters.swot}
              onChange={(event) =>
                handleFilterChange(
                  "swot",
                  event.target.value
                )
              }
            />

            <FilterSelect
              label="Country"
              icon={<Globe size={15} />}
              placeholder="All Countries"
              options={options.country}
              value={filters.country}
              onChange={(event) =>
                handleFilterChange(
                  "country",
                  event.target.value
                )
              }
            />

            <FilterSelect
              label="City"
              icon={<MapPin size={15} />}
              placeholder="All Cities"
              options={options.city}
              value={filters.city}
              onChange={(event) =>
                handleFilterChange(
                  "city",
                  event.target.value
                )
              }
            />

            <button
              type="button"
              className="btn btn-outline-secondary w-100 mt-2"
              onClick={resetFilters}
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;