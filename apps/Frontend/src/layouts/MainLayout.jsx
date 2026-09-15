import React, { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

const MainLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [search, setSearch] = useState("");

  const [filters, setFilters] = useState({
    end_year: "",
    topic: "",
    sector: "",
    region: "",
    pestle: "",
    source: "",
    swot: "",
    country: "",
    city: "",
  });

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Header
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        search={search}
        setSearch={setSearch}
      />

      <div className="d-flex flex-grow-1">
        {sidebarOpen && (
          <Sidebar
            setSidebarOpen={setSidebarOpen}
            filters={filters}
            setFilters={setFilters}
          />
        )}

        <main className="flex-grow-1 overflow-hidden">
          {React.cloneElement(children, {
            filters,
            search,
          })}
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default MainLayout;