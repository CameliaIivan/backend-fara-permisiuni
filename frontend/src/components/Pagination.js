"use client"

function Pagination({ currentPage, totalPages, onPageChange }) {
  const pages = []

  // Create array of page numbers to display
  if (totalPages <= 7) {
    // If 7 or fewer pages, show all
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i)
    }
  } else {
    // Always show first page
    pages.push(1)

    // Calculate start and end of middle pages
    const startPage = Math.max(2, currentPage - 1)
    const endPage = Math.min(totalPages - 1, currentPage + 1)

    // Add ellipsis if needed
    if (startPage > 2) {
      pages.push("...")
    }

    // Add middle pages
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    // Add ellipsis if needed
    if (endPage < totalPages - 1) {
      pages.push("...")
    }

    // Always show last page
    pages.push(totalPages)
  }

  return (
    <nav className="flex justify-center mt-8" aria-label="Pagination">
      <ul className="flex space-x-1">
        {/* Previous button */}
        <li>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded-md ${
              currentPage === 1
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
            }`}
            aria-label="Previous page"
          >
            &laquo;
          </button>
        </li>

        {/* Page numbers */}
        {pages.map((page, index) => (
          <li key={index}>
            {page === "..." ? (
              <span className="px-3 py-1">...</span>
            ) : (
              <button
                onClick={() => onPageChange(page)}
                className={`px-3 py-1 rounded-md ${
                  currentPage === page
                    ? "bg-primary-600 text-white"
                    : "text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                }`}
                aria-current={currentPage === page ? "page" : undefined}
                aria-label={`Page ${page}`}
              >
                {page}
              </button>
            )}
          </li>
        ))}

        {/* Next button */}
        <li>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded-md ${
              currentPage === totalPages
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
            }`}
            aria-label="Next page"
          >
            &raquo;
          </button>
        </li>
      </ul>
    </nav>
  )
}

export default Pagination
