import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductList.scss';
import DashboardAdmin from '../../../components/DashboardAdmin/DashboardAdmin';
import { FaStar, FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import { getSubproducts, deleteSubProduct, SubProduct, Review } from '../../../services/subproductService';

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<SubProduct[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getSubproducts();
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };
    fetchData();
  }, []);

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const paginatedProducts = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDelete = async (id: number) => {
    if (
      window.confirm(`Are you sure you want to delete subproduct #${id}?`)
    ) {
      try {
        await deleteSubProduct(id);
        // xoá khỏi state để UI cập nhật
        setProducts((prev) => prev.filter((c) => c.id !== id));
      } catch (err) {
        console.error("Delete failed:", err);
        alert("Failed to delete subproduct");
      }
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Helper: calculate average rating
  const avgRating = (reviews: Review[]): number => {
    if (!reviews.length) return 0;
    const sum = reviews.reduce((total, r) => total + r.rating, 0);
    return parseFloat((sum / reviews.length).toFixed(1));
  };

  return (
    <div className="admin-layout">
      <DashboardAdmin />
      <div className="product-list">
        <div className="header">
          <h2>PRODUCT LIST</h2>
          <button className="add-product">Add Product</button>
        </div>
        <table className="product-table">
          <thead>
            <tr>
              {/* <th></th> */}
              <th>Product Name & Size</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Category</th>
              <th>Rating</th>
              <th>Reviews</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProducts.map((sub) => (
              <tr key={sub.id}>
                {/* <td><input type="checkbox" /></td> */}
                <td>
                  <div className="product-info" onClick={() => navigate(`/admin-product-edit/${sub.id}`)} style={{ cursor: "pointer" }}>
                    <img src={sub.image} alt={sub.product.name} className="product-img" />
                    <div className="product-details">
                      <div className="name">{sub.product.name}</div>
                      <div className="size">Size: {sub.size || 'N/A'}</div>
                    </div>
                  </div>
                </td>
                <td>{sub.price.toLocaleString('en-US', { maximumFractionDigits: 2 })}</td>
                <td>
                  <div>{sub.stock} Item Left</div>
                  <div>{sub.saled_per_month} Sold</div>
                </td>
                <td>{sub.product.category}</td>
                <td>
                  <span className="rating"><FaStar /> {avgRating(sub.reviews)}</span>
                </td>
                <td>
                  <div>{sub.reviews.length} Review{sub.reviews.length !== 1 ? 's' : ''}</div>
                </td>
                <td className="actions">
                  {/* <button className="view"><FaEye /></button> */}
                  <button className="edit" onClick={() => navigate(`/admin-product-edit/${sub.id}`)}><FaEdit /></button>
                  <button className="delete" style={{ cursor: "pointer" }} onClick={() => handleDelete(sub.id)}><FaTrash /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pagination">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>

          {/* Hiển thị tối đa 3 trang: current - 1, current, current + 1 nếu có */}
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((page) =>
              page === 1 || // luôn hiển thị trang 1
              page === totalPages || // luôn hiển thị trang cuối
              Math.abs(page - currentPage) <= 1 // hiển thị các trang xung quanh currentPage
            )
            .map((page, idx, arr) => {
              const prevPage = arr[idx - 1];
              const showDots = prevPage && page - prevPage > 1;
              return (
                <React.Fragment key={page}>
                  {showDots && <span className="dots">...</span>}
                  <button
                    className={currentPage === page ? 'active' : ''}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                </React.Fragment>
              );
            })}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductList;