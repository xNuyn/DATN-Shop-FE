import React from "react";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import "./Pagination.scss";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const getPageItems = (): (number | string)[] => {
    const items: (number | string)[] = [];
    const delta = 1;
    const rangeStart = Math.max(2, currentPage - delta);
    const rangeEnd = Math.min(totalPages - 1, currentPage + delta);

    // first
    items.push(1);

    // left ellipsis
    if (rangeStart > 2) {
      items.push("left-ellipsis");
    }

    // middle pages
    for (let i = rangeStart; i <= rangeEnd; i++) {
      items.push(i);
    }

    // right ellipsis
    if (rangeEnd < totalPages - 1) {
      items.push("right-ellipsis");
    }

    // last
    if (totalPages > 1) {
      items.push(totalPages);
    }

    return items;
  };

  const pageItems = getPageItems();

  return (
    <div className="pagination">
      <button
        className="arrow"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <LeftOutlined />
      </button>

      {pageItems.map((item, idx) => {
        if (item === "left-ellipsis" || item === "right-ellipsis") {
          return (
            <span key={idx} className="ellipsis">
              ...
            </span>
          );
        }

        const pageNumber = item as number;
        return (
          <button
            key={idx}
            className={`page ${pageNumber === currentPage ? "active" : ""}`}
            onClick={() => onPageChange(pageNumber)}
          >
            {String(pageNumber).padStart(2, "0")}
          </button>
        );
      })}

      <button
        className="arrow"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <RightOutlined />
      </button>
    </div>
  );
};

export default Pagination;