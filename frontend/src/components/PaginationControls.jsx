import PropTypes from "prop-types";

function PaginationControls({ page, totalPages, onPageChange }) {
  return (
    <div style={{ marginTop: "1rem", textAlign: "center" }}>
      <button onClick={() => onPageChange(page - 1)} disabled={page <= 1}>
        Previous
      </button>
      <span style={{ margin: "0 1rem" }}>
        Page {page} of {totalPages}
      </span>
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
      >
        Next
      </button>
    </div>
  );
}
PaginationControls.propTypes = {
  page: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};
export default PaginationControls;
