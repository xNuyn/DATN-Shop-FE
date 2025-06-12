import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './SubProductList.scss';
import DashboardAdmin from '../../../components/DashboardAdmin/DashboardAdmin';
import { FaStar, FaTrash } from 'react-icons/fa';
import { getProductDetail } from '../../../services/productService';
import { deleteSubProduct } from '../../../services/subproductService';

interface Review {
  rating: number;
}
interface SubProduct {
  id: number;
  price: number;
  stock: number;
  saled_per_month: number;
  image: string;
  size?: string;
  color: string;
  reviews: Review[];
}

const SubProductList: React.FC = () => {
  const { id: productId } = useParams<{ id: string }>();
  const [subProducts, setSubProducts] = useState<SubProduct[]>([]);
  const [parentName, setParentName] = useState<string>('');
  const [parentCategory, setParentCategory] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (!productId) return;
      try {
        const data = await getProductDetail(Number(productId));
        setParentName(data.name);
        setParentCategory(data.category);
        setSubProducts(data.sub_products);
      } catch (error) {
        console.error('Failed to fetch sub-products:', error);
      }
    };
    fetchData();
  }, [productId]);

  const totalPages = Math.ceil(subProducts.length / itemsPerPage);
  const paginated = subProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDelete = async (id: number) => {
    if (window.confirm(`Delete subproduct #${id}?`)) {
      try {
        await deleteSubProduct(id);
        setSubProducts(prev => prev.filter(s => s.id !== id));
      } catch {
        alert('Delete failed');
      }
    }
  };

  const avgRating = (reviews: Review[]): number => {
    if (!reviews.length) return 0;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return parseFloat((sum / reviews.length).toFixed(1));
  };

  return (
    <div className="admin-layout">
      <DashboardAdmin />
      <div className="product-list">
        <div className="header">
          <h2>SUB-PRODUCT FOR: {parentName}</h2>
        </div>
        <table className="product-table">
          <thead>
            <tr>
              <th>Name & Size</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Category</th>
              <th>Rating</th>
              <th>Reviews</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map(sub => (
              <tr key={sub.id}>
                <td onClick={() => navigate(`/admin-subproduct-edit/${sub.id}`)} style={{cursor: 'pointer'}}>
                  <div className="product-info">
                    <img src={sub.image} alt={parentName} className="product-img" />
                    <div className="product-details">
                      <div className="name">{parentName}</div>
                      <div className="size">{sub.color} / {sub.size || 'N/A'}</div>
                    </div>
                  </div>
                </td>
                <td>{sub.price.toLocaleString()}</td>
                <td>
                  <div>{sub.stock} left</div>
                  <div>{sub.saled_per_month} sold</div>
                </td>
                <td>{parentCategory}</td>
                <td className='rating'><FaStar /> {avgRating(sub.reviews)}</td>
                <td>{sub.reviews.length}</td>
                <td>
                  <FaTrash className="action-icon" style={{ cursor: "pointer" }} onClick={() => handleDelete(sub.id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pagination">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>Previous</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .map(page => (
              <button
                key={page}
                className={page === currentPage ? 'active' : ''}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>Next</button>
        </div>
      </div>
    </div>
  );
};

export default SubProductList;