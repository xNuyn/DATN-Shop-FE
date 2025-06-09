import React from 'react';
import './CreateProduct.scss';
import DashboardAdmin from '../../../components/DashboardAdmin/DashboardAdmin';

const CreateProduct: React.FC = () => {
  return (
    <div className="admin-layout">
      <DashboardAdmin />
      <div className="create-product">
        <h2>CREATE PRODUCT</h2>
          <div className="form-card">
            <h4>Add Product Photo</h4>
            <div className="upload-box">
              <div className="upload-icon">📤</div>
              <p>
                Drop your images here, or <span className="browse">click to browse</span>
              </p>
              <small>1600 x 1200 (4:3) recommended. PNG, JPG and GIF files are allowed</small>
            </div>

            <h4>Product Information</h4>
            <div className="form-grid">
              <div className="form-group">
                <label>Product Name</label>
                <input type="text" placeholder="Items Name" />
              </div>
              <div className="form-group">
                <label>Product Categories</label>
                <select><option>Choose a categories</option></select>
              </div>
              <div className="form-group">
                <label>Brand</label>
                <input type="text" />
              </div>
              <div className="form-group">
                <label>Weight</label>
                <input type="text" />
              </div>
              <div className="form-group">
                <label>Gender</label>
                <select>
                  <option>Unisex</option>
                  <option>Male</option>
                  <option>Female</option>
                </select>
              </div>
              <div className="form-group">
                <label>Price</label>
                <input type="text" />
              </div>
              <div className="form-group">
                <label>Tag Number</label>
                <input type="text" placeholder="#******" />
              </div>
              <div className="form-group">
                <label>Stock</label>
                <input type="text" placeholder="Quantity" />
              </div>
              <div className="form-group">
                <label>Tag</label>
                <div className="tag-box">
                  <span className="tag">Fashion <span className="remove">×</span></span>
                </div>
              </div>
            </div>

            <div className="options-section">
              <div className="size-color-row">
                <div className="form-group">
                  <label>Size :</label>
                  <div className="size-options">
                    {['XS', 'S', 'M', 'XL', 'XXL', '3XL'].map((size) => (
                      <span key={size} className="size-box">{size}</span>
                    ))}
                  </div>
                </div>
                <div className="form-group">
                  <label>Colors :</label>
                  <div className="color-options">
                    {['#2f3542', '#feca57', '#ffffff', '#ff6b35', '#2ed573', '#ff6b81', '#1dd1a1', '#576574'].map((color, i) => (
                      <span key={i} className="color-dot" style={{ backgroundColor: color }}></span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="form-group full-width">
              <label>Description</label>
              <textarea placeholder="Short description about the product" rows={4}></textarea>
            </div>

            <h4>Pricing Details</h4>
            <div className="pricing-section">
              <div className="pricing-group">
                <label>Price</label>
                <div className="input-icon">
                  <span>$</span>
                  <input type="text" placeholder="000" />
                </div>
              </div>
              <div className="pricing-group">
                <label>Discount</label>
                <div className="input-icon">
                  <span>💸</span>
                  <input type="text" placeholder="000" />
                </div>
              </div>
              <div className="pricing-group">
                <label>Tax</label>
                <div className="input-icon">
                  <span>📄</span>
                  <input type="text" placeholder="000" />
                </div>
              </div>
            </div>

            <button className="submit-btn">Create Product</button>
          </div>
        </div>
    </div>
  );
};

export default CreateProduct;
