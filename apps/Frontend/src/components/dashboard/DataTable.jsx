import { useEffect, useState } from "react";
import { getData } from "../../api/dataApi";

const DataTable = ({ filters, search }) => {
  const [data, setData] = useState([]);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 1,
  });

  useEffect(() => {
    setPagination((previous) => ({
      ...previous,
      page: 1,
    }));
  }, [filters, search]);

  useEffect(() => {
    const fetchTableData = async () => {
      try {
        const result = await getData({
          ...filters,
          search,
          page: pagination.page,
          limit: pagination.limit,
        });

        const records = Array.isArray(result)
          ? result
          : result.data || [];

        setData(records);

        if (result.pagination) {
          setPagination((previous) => ({
            ...previous,
            ...result.pagination,
          }));
        }
      } catch (error) {
        console.error(
          "Failed to fetch table data:",
          error
        );

        setData([]);
      }
    };

    fetchTableData();
  }, [filters, search, pagination.page]);

  const handlePrevious = () => {
    setPagination((previous) => ({
      ...previous,
      page: Math.max(
        1,
        previous.page - 1
      ),
    }));
  };

  const handleNext = () => {
    setPagination((previous) => ({
      ...previous,
      page: Math.min(
        previous.pages,
        previous.page + 1
      ),
    }));
  };

  return (
    <div>
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th>Country</th>
              <th>Topic</th>
              <th>Sector</th>
              <th>Intensity</th>
              <th>Likelihood</th>
              <th>Relevance</th>
              <th>Year</th>
            </tr>
          </thead>

          <tbody>
            {data.length > 0 ? (
              data.map((item, index) => (
                <tr key={item._id || index}>
                  <td>
                    {item.country || "-"}
                  </td>

                  <td>
                    {item.topic || "-"}
                  </td>

                  <td>
                    {item.sector || "-"}
                  </td>

                  <td>
                    {item.intensity ?? "-"}
                  </td>

                  <td>
                    {item.likelihood ?? "-"}
                  </td>

                  <td>
                    {item.relevance ?? "-"}
                  </td>

                  <td>
                    {item.end_year || "-"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="text-center text-secondary py-5"
                >
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {data.length > 0 && (
        <div className="d-flex align-items-center justify-content-between mt-3">
          <small className="text-secondary">
            Page {pagination.page} of{" "}
            {pagination.pages}
          </small>

          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary"
              onClick={handlePrevious}
              disabled={
                pagination.page === 1
              }
            >
              Previous
            </button>

            <button
              type="button"
              className="btn btn-sm btn-outline-secondary"
              onClick={handleNext}
              disabled={
                pagination.page >=
                pagination.pages
              }
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;