import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductList.scss';
import DashboardAdmin from '../../../components/DashboardAdmin/DashboardAdmin';
import { FaEdit, FaTrash } from 'react-icons/fa';
import {
  fetchProductList,
  Product,
  ProductListResponse,
} from '../../../services/productService';
import { getCategories, Category } from '../../../services/categoryService';

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categoriesMap, setCategoriesMap] = useState<Record<number, string>>({});
  // const [rootCategories, setRootCategories] = useState<Category[]>([]);
  // const [activeCat, setActiveCat] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const itemsPerPage = 8;
  const navigate = useNavigate();

  // Load root categories
  // useEffect(() => {
  //   (async () => {
  //     try {
  //       const roots = await getRootCategories();
  //       setRootCategories(roots);
  //       // Optionally set first as active
  //       if (roots.length) setActiveCat(roots[0].id);
  //     } catch (err) {
  //       console.error('Fetch root categories failed:', err);
  //     }
  //   })();
  // }, []);

  // Load all categories once
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const cats: Category[] = await getCategories();
        const map: Record<number, string> = {};
        cats.forEach(c => {
          map[c.id] = c.name;
        });
        setCategoriesMap(map);
      } catch (err) {
        console.error('Fetch categories failed:', err);
      }
    };
    loadCategories();
  }, []);

  // Load products
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response: ProductListResponse = await fetchProductList(currentPage, itemsPerPage);
        setProducts(response.data);
        setTotalPages(response.meta.last_page);
      } catch (error) {
        console.error('Failed to load products:', error);
      }
    };
    loadProducts();
  }, [currentPage]);

  const handleDelete = async (id: number) => {
    if (window.confirm(`Are you sure you want to delete product #${id}?`)) {
      try {
        const response: ProductListResponse = await fetchProductList(currentPage, itemsPerPage);
        setProducts(response.data);
        setTotalPages(response.meta.last_page);
      } catch (err) {
        console.error('Delete failed:', err);
        alert('Failed to delete product');
      }
    }
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="admin-layout">
      <DashboardAdmin />
      <div className="product-list">
        {/* Category Tabs */}
        {/* <div className="category-tabs">
          {rootCategories.map(cat => (
            <button
              key={cat.id}
              className={`tab-btn ${activeCat === cat.id ? 'active' : ''}`}
              onClick={() => { setActiveCat(cat.id); setCurrentPage(1); }}
            >
              {cat.name}
            </button>
          ))}
        </div> */}
        <div className="header">
          <h2>PRODUCT LIST</h2>
          <button className="btn-add" onClick={() => navigate('/admin-product-add')}>Add Product</button>
        </div>
        <table className="product-table">
          <thead>
            <tr>
              <th className="col-img">Image</th>
              <th>Name</th>
              <th>Price</th>
              <th>Category</th>
              <th>Sold</th>
              <th>Discount Max(%)</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="product-row">
                <td>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="product-img"
                    onClick={() => navigate(`/admin-subproduct-list/${product.id}`)}
                  />
                </td>
                <td className="cell-name" 
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate(`/admin-subproduct-list/${product.id}`)}>
                    {product.name}
                </td>
                <td className="cell-price">
                    {product.price_min === product.price_max
                    ? product.price_min.toLocaleString('en-US')
                    : `${product.price_min.toLocaleString('en-US')} - ${product.price_max.toLocaleString('en-US')}`}
                </td>
                <td className="cell-category">{categoriesMap[product.category] || 'Unknown'}</td>
                <td className="cell-sold">{product.sold_per_month}</td>
                <td className="cell-discount">{product.discount_percentage_max ?? 0}%</td>
                <td className="cell-action">
                  <button className="btn action-edit" onClick={() => navigate(`/admin-subproduct-list/${product.id}`)}>
                    <FaEdit />
                  </button>
                  <button className="btn action-delete" onClick={() => handleDelete(product.id)}>
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination">
          <button className="btn-page" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(page => page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1)
            .map((page, idx, arr) => {
              const prev = arr[idx - 1];
              const showDots = prev && page - prev > 1;
              return (
                <React.Fragment key={page}>
                  {showDots && <span className="dots">...</span>}
                  <button
                    className={`btn-page ${currentPage === page ? 'active' : ''}`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                </React.Fragment>
              );
            })}
          <button className="btn-page" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
