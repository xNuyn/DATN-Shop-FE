import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import './SubProductEdit.scss';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardAdmin from '../../../components/DashboardAdmin/DashboardAdmin';
import { getSubproductById, updateSubProductById, SubProduct } from '../../../services/subproductService';
import { uploadImage } from '../../../services/uploadService';
import { getCategoryById, Category } from '../../../services/categoryService';
import { getBrandById, Brand } from '../../../services/brandService';

const SubProductEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const subId = Number(id);
  const navigate = useNavigate();
  const [sub, setSub] = useState<SubProduct | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [brand, setBrand] = useState<Brand | null>(null);

  const [price, setPrice] = useState(0);
  const [oldPrice, setOldPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [stock, setStock] = useState(0);
  const [soldPerMonth, setSoldPerMonth] = useState(0);
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (isNaN(subId)) return;
    (async () => {
      const data = await getSubproductById(subId);
      setSub(data);
      setPrice(data.price);
      setOldPrice(data.old_price);
      setDiscount(Number(data.discount_percentage));
      setStock(data.stock);
      setSoldPerMonth(data.saled_per_month);
      setDescription(data.product.description);
      setCategory(await getCategoryById(data.product.category));
      setBrand(await getBrandById(data.product.brand));
    })();
  }, [subId]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!sub) return;

    try {
      let imageUrl: string | null = null;
      if (file) {
        // 1) Upload ảnh lên /api/upload/
        imageUrl = await uploadImage(file);
      }

      // 2) Chuẩn bị payload JSON cho patch
      const payload: Record<string, any> = {
        product_id: sub.product.id,
        price,
        old_price: oldPrice,
        discount_percentage: discount,
        stock,
        saled_per_month: soldPerMonth,
        description,
      };
      if (imageUrl) payload.image = imageUrl;

      // 3) Gửi PATCH JSON
      await updateSubProductById(sub.id, payload);

      alert('Cập nhật thành công!');
      navigate('/admin-subproduct-edit/:id');
    } catch (err) {
      console.error('Update failed:', err);
      alert('Cập nhật thất bại, vui lòng thử lại.');
    }
  };

  if (!sub) {
    return <div className="admin-layout">
      <DashboardAdmin />
      <div className="create-product">
        <h2>Product not found</h2>
      </div>
    </div>;
  }

  const specItems = sub.specification
    .split(', ')
    .map((entry) => {
      const [label, ...rest] = entry.split(': ');
      return {
        label: label.trim(),
        value: rest.join(': ').trim(),
      };
    })
    .filter((item) => item.label && item.value);

  return (
    <div className="admin-layout">
      <DashboardAdmin />
      <form className="create-product" onSubmit={handleSubmit} encType="multipart/form-data">
        <h2>EDIT SUB-PRODUCT</h2>

        <div className="form-content">
          {/* ========== CỘT TRÁI ========= */}
          <div className="left-panel">
            {/* Product Preview */}
            <div className="product-preview">
              <div className="image-box">
                <img src={file ? URL.createObjectURL(file) : sub.image} alt={sub.product.image} />
              </div>
              <h3>{sub.product.name}</h3>
              <p className="product-id">#{sub.id}</p>
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

          {/* ========== CỘT PHẢI: FORM ========= */}
          <div className="form-card">
            <h4>Add Product Photo</h4>
            <div className="upload-box" >
              <div className="upload-icon">📤</div>
              <input type="file" accept="image/*" onChange={handleFileChange} />
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
                <select value={category?.id || ''} disabled>
                  <option value="">{category?.name}</option>
                </select>
              </div>
              <div className="form-group">
                <label>Brand</label>
                <select value={brand?.id || ''} disabled>
                  <option value="">{brand?.name}</option>
                </select>
              </div>
              <div className="form-group">
                <label>Price</label>
                <input type="number" value={price} onChange={e => setPrice(Number(e.target.value))} />
              </div>
              <div className="form-group">
                <label>Old Price</label>
                <input type="number" value={oldPrice} onChange={e => setOldPrice(Number(e.target.value))} />
              </div>
              <div className="form-group">
                <label>Discount Percentage</label>
                <input type="number" value={discount} onChange={e => setDiscount(Number(e.target.value))} />
              </div>
              <div className="form-group">
                <label>Stock</label>
                <input type="number" value={stock} onChange={e => setStock(Number(e.target.value))} />
              </div>
              <div className="form-group">
                <label>Sold</label>
                <input type="number" value={soldPerMonth} onChange={e => setSoldPerMonth(Number(e.target.value))} />
              </div>
            </div>

            <div className="options-section">
              <div className="size-color-row">
                <div className="form-group">
                  <label>Size :</label>
                  <div className="size-options">
                  <span className="size-box">{sub.size}</span>
                </div>
                </div>
                <div className="form-group">
                  <label>Colors :</label>
                  <div className="color-options">
                  <span
                    className="color-dot"
                    style={{ backgroundColor: sub.color }}
                  />
                </div>
                </div>
              </div>
            </div>

            <div className="form-group full-width">
              <label>Description</label>
              <textarea
                  rows={4}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                />
            </div>
            <button type="submit" className="submit-btn">Update Product</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SubProductEdit;
