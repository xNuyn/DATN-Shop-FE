import React, { useEffect, useState } from "react";
import "./CategoriesList.scss";
import DashboardAdmin from "../../../components/DashboardAdmin/DashboardAdmin";
import { FaTrash } from "react-icons/fa";
import {
  getRootCategories,
  getCategory,
  createCategory,
  deleteCategory,
  Category,
} from "../../../services/categoryService";
import CategoryModal from "../../../components/CategoryModal/CategoryModal";

const itemsPerPage = 8;

const CategoriesList: React.FC = () => {
  const [parents, setParents] = useState<Category[]>([]);
  const [subs, setSubs] = useState<Category[]>([]);
  const [filteredSubs, setFilteredSubs] = useState<Category[]>([]);
  const [selectedParent, setSelectedParent] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const rootCats = await getRootCategories();
        setParents(rootCats);

        const allCats = await getCategory();
        const subCats = allCats.filter((c) => c.parent !== null);
        setSubs(subCats);
        setFilteredSubs(subCats);
      } catch (err) {
        console.error("Error loading categories:", err);
      }
    })();
  }, []);

  // Khi chọn 1 parent, filter subs
  const handleSelectParent = (parentId: number) => {
    if (selectedParent === parentId) {
      setSelectedParent(null);
      setFilteredSubs(subs);
    } else {
      setSelectedParent(parentId);
      setFilteredSubs(subs.filter((c) => c.parent === parentId));
      setCurrentPage(1);
    }
  };

  const handleCreated = async (data: { parent: number | null; name: string }) => {
    try {
      const newCat = await createCategory(data);
      setSubs((prev) => [...prev, newCat]);
      if (selectedParent === null || selectedParent === newCat.parent) {
        setFilteredSubs((prev) => [...prev, newCat]);
      }
    } catch (err) {
      console.error("Failed to create category:", err);
    }
  };

  const handleDelete = async (id: number) => {
      if (
        window.confirm(`Are you sure you want to delete category #${id}?`)
      ) {
        try {
          await deleteCategory(id);
          setSubs((prev) => prev.filter((c) => c.id !== id));
        } catch (err) {
          console.error("Delete failed:", err);
          alert("Failed to delete category");
        }
      }
    };

  const totalPages = Math.ceil(filteredSubs.length / itemsPerPage);
  const paginated = filteredSubs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="admin-layout">
      <DashboardAdmin />
      <div className="categories-list">
        <h2>CATEGORIES LIST</h2>

        {/* parent categories */}
        <div className="highlight-cards">
          {parents.map((cat) => (
            <div
              key={cat.id}
              className={`card ${selectedParent === cat.id ? "active" : ""}`}
              onClick={() => handleSelectParent(cat.id)}
            >
              <h4>{cat.name}</h4>
            </div>
          ))}
        </div>

        {/* subcategories */}
        <div className="table-section">
          <div className="header">
            <h4>
              {selectedParent
                ? `Subcategories of "${parents.find(p=>p.id===selectedParent)?.name}"`
                : "All Subcategories"}
            </h4>
            <div className="controls">
              <button className="add-btn" onClick={() => setIsModalOpen(true)}>Add Category</button>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>ID</th>
                <th>Parent ID</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((cat) => (
                <tr key={cat.id}>
                  <td>
                    <span>{cat.name}</span>
                  </td>
                  <td>{cat.id}</td>
                  <td>{cat.parent}</td>
                  <td className="actions">
                    <button className="delete" style={{ cursor: "pointer" }} onClick={() => handleDelete(cat.id)}>
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((page) =>
                page === 1 ||
                page === totalPages ||
                Math.abs(page - currentPage) <= 1
              )
              .map((page, idx, arr) => {
                const prevPage = arr[idx - 1];
                const showDots = prevPage && page - prevPage > 1;
                return (
                  <React.Fragment key={page}>
                    {showDots && <span className="dots">...</span>}
                    <button
                      className={currentPage === page ? 'active' : ''}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  </React.Fragment>
                );
              })}

            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreated}
      />
    </div>
  );
};

export default CategoriesList;
