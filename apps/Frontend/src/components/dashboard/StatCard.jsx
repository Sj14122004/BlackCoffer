const StatCard = ({ title, value }) => {
  return (
    <div className="col-12 col-md-4">
      <div className="card border-0 shadow-sm h-100">
        <div className="card-body">
          <p className="text-secondary small mb-2">
            {title}
          </p>

          <h3 className="fw-bold mb-0">
            {value}
          </h3>
        </div>
      </div>
    </div>
  );
};

export default StatCard;