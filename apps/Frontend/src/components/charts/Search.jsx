import { Search as SearchIcon } from "lucide-react";

const Search = ({ search, setSearch }) => {
  return (
    <div
      className="input-group"
      style={{ maxWidth: "600px" }}
    >
      <span className="input-group-text bg-light border-end-0">
        <SearchIcon size={18} />
      </span>

      <input
        type="text"
        className="form-control bg-light border-start-0"
        placeholder="Search insights, countries, topics..."
        value={search}
        onChange={(event) =>
          setSearch(event.target.value)
        }
      />
    </div>
  );
};

export default Search;