import { useEffect, useState } from "react";

const Pagination = ({
  totalItems,
  itemsPerPage,
  onPageChange,
}: {
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (currentPage: number) => void;
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  useEffect(() => {
    onPageChange(currentPage);
  }, [currentPage, onPageChange]);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="flex justify-center mt-8">
      <button
        onClick={handlePrevPage}
        disabled={currentPage === 1}
        className="px-4 py-2 bg-gray-200 rounded-l-lg hover:bg-gray-300 disabled:opacity-50"
      >
        Prev
      </button>
      <span className="px-4 py-2 bg-white border-t border-b">{currentPage}</span>
      <button
        onClick={handleNextPage}
        disabled={currentPage === totalPages}
        className="px-4 py-2 bg-gray-200 rounded-r-lg hover:bg-gray-300 disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
