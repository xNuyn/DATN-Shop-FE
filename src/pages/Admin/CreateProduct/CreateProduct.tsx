import React from 'react';
import './CreateProduct.scss';
import DashboardAdmin from '../../../components/DashboardAdmin/DashboardAdmin';

const CreateProduct: React.FC = () => {
  const specItems = [
    { label: 'Material', value: 'Cotton' },
    { label: 'Weight', value: '250g' },
    { label: 'Origin', value: 'Vietnam' },
  ];

  return (
    <div className="admin-layout">
      <DashboardAdmin />
      <form className="create-product">
        <h2>EDIT SUB-PRODUCT</h2>

        <div className="form-content">
          <div className="left-panel">
            {/* Product Preview */}
            <div className="product-preview">
              <div className="image-box">
                <img src="/placeholder.jpg" alt="Product Preview" />
              </div>
              <h3>Sample Product Name</h3>
              <p className="product-id">#123</p>
            </div>

            {/* Specification */}
            <div className="specification">
              <h4>Specification</h4>
              <ul>
                {specItems.map((item, idx) => (
                  <li key={idx}>
                    <span className="label">{item.label}</span>
                    <span className="value">{item.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="form-card">
            <h4>Add Product Photo</h4>
            <div className="upload-box">
              <div className="upload-icon">📤</div>
              <input type="file" accept="image/*" disabled />
              <p>
                Drop your images here, or <span className="browse">click to browse</span>
              </p>
              <small>
                1600 x 1200 (4:3) recommended. PNG, JPG and GIF files are allowed
              </small>
            </div>

            <h4>Product Information</h4>
            <div className="form-grid">
              <div className="form-group">
                <label>Category</label>
                <select disabled>
                  <option value="">T-shirt</option>
                </select>
              </div>
              <div className="form-group">
                <label>Brand</label>
                <select disabled>
                  <option value="">CoolBrand</option>
                </select>
              </div>
              <div className="form-group">
                <label>Price</label>
                <input type="number" value={199} readOnly />
              </div>
              <div className="form-group">
                <label>Old Price</label>
                <input type="number" value={249} readOnly />
              </div>
              <div className="form-group">
                <label>Discount Percentage</label>
                <input type="number" value={20} readOnly />
              </div>
              <div className="form-group">
                <label>Stock</label>
                <input type="number" value={50} readOnly />
              </div>
              <div className="form-group">
                <label>Sold</label>
                <input type="number" value={10} readOnly />
              </div>
            </div>

            <div className="options-section">
              <div className="size-color-row">
                <div className="form-group">
                  <label>Size :</label>
                  <div className="size-options">
                    <span className="size-box">M</span>
                  </div>
                </div>
                <div className="form-group">
                  <label>Colors :</label>
                  <div className="color-options">
                    <span className="color-dot" style={{ backgroundColor: '#ff5733' }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="form-group full-width">
              <label>Description</label>
              <textarea rows={4} value="This is a sample product description." readOnly />
            </div>

            <button type="button" className="submit-btn" disabled>
              Update Product
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateProduct;
