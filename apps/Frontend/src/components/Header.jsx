import { Menu } from "lucide-react";
import Search from "./charts/Search";

const Header = ({
  sidebarOpen,
  setSidebarOpen,
  search,
  setSearch,
}) => {
  return (
    <header className="sticky-top bg-white border-bottom shadow-sm">
      <div className="container-fluid px-4">
        <div
          className="d-flex align-items-center gap-3"
          style={{ height: "64px" }}
        >
          <button
            type="button"
            className="btn btn-light border"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            <Menu size={20} />
          </button>

          <h5 className="mb-0 fw-bold text-nowrap">
            Blackcoffer Analytics
          </h5>

          <div className="flex-grow-1 d-flex justify-content-center">
            <Search
              search={search}
              setSearch={setSearch}
            />
          </div>

          <nav className="d-none d-lg-flex align-items-center gap-4">
            <a
              href="/"
              className="text-decoration-none text-dark fw-medium"
            >
              Dashboard
            </a>

            <a
              href="#analytics"
              className="text-decoration-none text-secondary"
            >
              Analytics
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;