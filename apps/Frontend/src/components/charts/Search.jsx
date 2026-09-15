import { Search as SearchIcon } from "lucide-react";

const Search = ({ search, setSearch }) => {
  return (
    <div
      style={{
        maxWidth: "600px",
        width: "100%",
        display: "flex",
        alignItems: "center",
        backgroundColor: "var(--surface-2, #ffffff)",
        border: "1px solid var(--border, #e5e7eb)",
        borderRadius: "8px",
        padding: "0 12px",
        transition: "all 0.2s ease",
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor =
          "var(--text-primary, #3b82f6)";
        e.currentTarget.style.boxShadow =
          "0 0 0 3px rgba(59, 130, 246, 0.1)";
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor =
          "var(--border, #e5e7eb)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <SearchIcon
        size={18}
        style={{
          color: "var(--text-secondary, #6b7280)",
          flexShrink: 0,
          marginRight: "10px",
        }}
      />

      <input
        type="text"
        placeholder="Search insights, countries, topics..."
        value={search}
        onChange={(event) =>
          setSearch(event.target.value)
        }
        style={{
          flex: 1,
          border: "none",
          background: "transparent",
          fontSize: "14px",
          color: "var(--text-primary, #1f2937)",
          outline: "none",
          padding: "10px 0",
          fontFamily: "var(--font-sans, inherit)",
        }}
      />

      {search && (
        <button
          onClick={() => setSearch("")}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: "4px 8px",
            color: "var(--text-secondary, #6b7280)",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => {
            e.target.style.color =
              "var(--text-primary, #1f2937)";
          }}
          onMouseLeave={(e) => {
            e.target.style.color =
              "var(--text-secondary, #6b7280)";
          }}
          aria-label="Clear search"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default Search;