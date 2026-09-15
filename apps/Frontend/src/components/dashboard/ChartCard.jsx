const ChartCard = ({
  title,
  description,
  children,
  className = "",
}) => {
  return (
    <div
      className={`card border-0 shadow-sm h-100 ${className}`}
    >
      <div className="card-body d-flex flex-column">
        <div className="mb-3">
          <h5 className="fw-bold mb-1">
            {title}
          </h5>

          <p className="text-secondary small mb-0">
            {description}
          </p>
        </div>

        <div className="flex-grow-1">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ChartCard;