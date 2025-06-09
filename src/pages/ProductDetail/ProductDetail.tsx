// src/pages/ProductDetail.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate  } from "react-router-dom";
import "./ProductDetail.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faMinus,
  faPlus,
  faShoppingCart,
  faExchangeAlt,
} from "@fortawesome/free-solid-svg-icons";
import {
  faHeart as faHeartOutline,
  faShareSquare,
} from "@fortawesome/free-regular-svg-icons";
import {
  faFacebookF,
  faTwitter,
  faPinterestP,
} from "@fortawesome/free-brands-svg-icons";
import ProductCategoryGrid from "../../components/ProductCategoryGrid/ProductCategoryGrid";
import { getProductDetail } from "../../services/productService";
import { addToCart } from "../../services/cartService";
import { addToWishlist } from "../../services/wishlistService";
import { addToCompare } from "../../services/compareService";

function colorToHex(colorName: string): string {
  switch (colorName.toLowerCase()) {
    case "trắng":
    case "white":
      return "#FFFFFF";
    case "đen":
    case "black":
      return "#000000";
    case "xanh":
    case "blue":
      return "#0000FF";
    case "đỏ":
    case "red":
      return "#C8102E";
    default:
      return colorName;
  }
}

type SubProduct = {
  id: number;
  old_price: number;
  price: number;
  color: string;
  size: string;
  stock: number;
  image: string;
  specification: string;
  discount_percentage: string;
  saled_per_month: number;
  status_enum: number;
  reviews: Review[];
};

type ProductData = {
  id: number;
  name: string;
  description: string;
  category: string;
  brand: string;
  image: string;
  price_min: number;
  price_max: number;
  sold_per_month: number;
  sub_products: SubProduct[];
};

interface Review {
  user_name: string;
  avatar: string | null;
  rating: number;
  comment: string;
  created_at: string;
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<ProductData | null>(null);
  const [mainIdx, setMainIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState<
    "description" | "specification" | "review"
  >("description");

  const [selectedSubProduct, setSelectedSubProduct] = useState<SubProduct | null>(null);

  const [allColors, setAllColors] = useState<string[]>([]);
  const [allSizes, setAllSizes] = useState<string[]>([]);
  const [allImages, setAllImages] = useState<string[]>([]);

  useEffect(() => {
    if (!id) return;
    const productId = Number(id);
    if (isNaN(productId)) return;

    getProductDetail(productId)
      .then((res) => {
        setData(res);

        if (res.sub_products && res.sub_products.length > 0) {
          setSelectedSubProduct(res.sub_products[0]);

          const colors : any = Array.from(
            new Set(res.sub_products.map((sp: SubProduct) => sp.color))
          );
          setAllColors(colors);

          const sizes : any = Array.from(
            new Set(
              res.sub_products
                .flatMap((sp: SubProduct) => sp.size.split(",").map((s) => s.trim()))
            )
          );
          setAllSizes(sizes);

          const images = res.sub_products.map((sp: any) => sp.image);
          setAllImages(images);

          setMainIdx(0);
        }
      })
      .catch((err) => {
        console.error("Lỗi khi fetch ProductDetail:", err);
      });
  }, [id]);

  if (!data || !selectedSubProduct) {
    return <div className="loading">Loading...</div>;
  }

  const currentIndex = data.sub_products.findIndex(
    (sp) => sp.id === selectedSubProduct.id
  );

  const handlePrevImage = () => {
    if (!data) return;
    const total = data.sub_products.length;
    const prevIndex = (currentIndex - 1 + total) % total;
    setSelectedSubProduct(data.sub_products[prevIndex]);
    setMainIdx(prevIndex);
    setQty(1);
  };

  const handleNextImage = () => {
    if (!data) return;
    const total = data.sub_products.length;
    const nextIndex = (currentIndex + 1) % total;
    setSelectedSubProduct(data.sub_products[nextIndex]);
    setMainIdx(nextIndex);
    setQty(1);
  };

  const handleBuyNow = () => {
    if (!selectedSubProduct || !data) return;

    const cartItem = {
      id: selectedSubProduct.id,
      name: data.name,
      image: selectedSubProduct.image,
      price: selectedSubProduct.old_price,
      quantity: qty,
    };

    const discountPercentage = parseFloat(selectedSubProduct.discount_percentage) || 0;

    navigate("/checkout", {
      state: {
        cartItems: [cartItem],
        discountPercentage: discountPercentage,
      },
    });
  };

  const handleAddToWishlist = async () => {
    if (!selectedSubProduct) return;
    try {
      const res = await addToWishlist(selectedSubProduct.id);
      console.log("Wishlist response:", res);
      alert("Added to wishlist!");
    } catch (error: any) {
      console.error("Error adding to wishlist:", error);
      alert("Sản phẩm đã có trong danh sách yêu thích của bạn.");
    }
  };

  const handleAddToCompare = async () => {
    if (!selectedSubProduct) return;
    try {
      const res = await addToCompare(selectedSubProduct.id);
      console.log("Compare response:", res);
      alert("Đã thêm vào danh sách so sánh!");
    } catch (error: any) {
      console.error("Error adding to Compare:", error);

      if (error.response && error.response.data) {
        const detail = error.response.data.detail;

        if (typeof detail === 'string') {
          alert(detail);
        } else if (typeof detail === 'object') {
          const messages = Object.values(detail).join('\n');
          alert(messages);
        } else {
          alert("Đã xảy ra lỗi không xác định khi thêm sản phẩm.");
        }

      } else {
        alert("Không thể thêm vào danh sách so sánh. Vui lòng thử lại.");
      }
    }
  };


  const product = {
    brand: data.brand,
    category: data.category,
  };

  const subproduct = {
    title: data.name,
    sku: selectedSubProduct.id,
    current: selectedSubProduct.price,
    original: selectedSubProduct.old_price,
    availability: selectedSubProduct.stock > 0 ? "In Stock" : "Out of Stock",
    discountPercent: parseFloat(selectedSubProduct.discount_percentage),
  };

  const tabs = {
    description: data.description,
    specification: selectedSubProduct.specification.split(", ").map(
      (item) =>
        item.charAt(0).toUpperCase() + item.slice(1).toLowerCase()
    ),
    reviews: selectedSubProduct.reviews,
  };

  const handleColorSelect = (color: string) => {
    if (!data) return;
    const found = data.sub_products.find((sp) => sp.color === color);
    if (found) {
      setSelectedSubProduct(found);
      setMainIdx(data.sub_products.findIndex((sp) => sp.id === found.id));
      setQty(1);
    }
  };

  const handleSizeSelect = (size: string) => {
    if (!data || !selectedSubProduct) return;
    const found = data.sub_products.find(
      (sp) =>
        sp.color === selectedSubProduct.color &&
        sp.size.trim() === size
    );
    if (found) {
      setSelectedSubProduct(found);
      setMainIdx(data.sub_products.findIndex((sp) => sp.id === found.id));
      setQty(1);
    }
  };

  const handleImageSelect = (index: number) => {
    if (!data) return;
    const sp = data.sub_products[index];
    setSelectedSubProduct(sp);
    setMainIdx(index);
    setQty(1);
  };

  return (
    <div className="product-detail">
      <div className="top">
        {/* Gallery */}
        <div className="gallery">
          {allImages.length > 1 && (
            <button className="nav prev" onClick={handlePrevImage}>
              &lt;
            </button>
          )}

          <img
            src={selectedSubProduct.image}
            alt={`Main Image`}
            className="main-img"
          />

          {allImages.length > 1 && (
            <button className="nav next" onClick={handleNextImage}>
              &gt;
            </button>
          )}

          {allImages.length > 1 && (
            <div className="thumbs">
              {allImages.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`Thumb ${i + 1}`}
                  className={
                    data.sub_products[i].id === selectedSubProduct.id
                      ? "active"
                      : ""
                  }
                  onClick={() => handleImageSelect(i)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="info">
          <div className="rating">
            {Array.from({ length: 5 }).map((_, i) => (
              <FontAwesomeIcon key={i} icon={faStar} color="#f5a623" />
            ))}
            <span>4.8 Star Rating (Auto-fixed)</span>
          </div>
          <h1 className="title">{subproduct.title}</h1>
          <ul className="meta">
            <li>
              <strong>Sku:</strong> {subproduct.sku}
            </li>
            <li>
              <strong>Brand:</strong> {product.brand}
            </li>
            <li>
              <strong>Availability:</strong>{" "}
              <span
                className={
                  subproduct.availability === "In Stock"
                    ? "in-stock"
                    : "out-of-stock"
                }
              >
                {subproduct.availability}
              </span>
            </li>
            <li>
              <strong>Category:</strong> {product.category}
            </li>
          </ul>

          <div className="price-block">
            <span className="new">{subproduct.current.toLocaleString('en-US', { maximumFractionDigits: 2 })} VNĐ</span>
            <span className="old">{subproduct.original.toLocaleString('en-US', { maximumFractionDigits: 2 })} VNĐ</span>
            <span className="discount">
              {subproduct.discountPercent}% OFF
            </span>
          </div>

          {/* Lựa chọn color & size */}
          <div className="options">
            <div className="option">
              <label>Color:</label>
              <div className="colors">
                {allColors.map((color, i) => (
                  <span
                    key={i}
                    className={`circle ${
                      selectedSubProduct.color === color ? "selected" : ""
                    }`}
                    title={color}
                    onClick={() => handleColorSelect(color)}
                    style={{ backgroundColor: colorToHex(color) }}
                  />
                ))}
              </div>
            </div>
            <div className="option">
              <label>Size:</label>
              <select
                value={selectedSubProduct.size.trim()}
                onChange={(e) => handleSizeSelect(e.target.value)}
              >
                {data.sub_products
                  .filter((sp) => sp.color === selectedSubProduct.color)
                  .flatMap((sp) =>
                    sp.size.split(",").map((s) => s.trim())
                  )
                  .filter((value, idx, self) => self.indexOf(value) === idx)
                  .map((size, i) => (
                    <option key={i}>{size}</option>
                  ))}
              </select>
            </div>
          </div>

          {/* Quantity & Add to Cart */}
          <div className="actions">
            <div className="qty">
              <button onClick={() => setQty(Math.max(1, qty - 1))}>
                <FontAwesomeIcon icon={faMinus} />
              </button>
              <span>{qty.toString().padStart(2, "0")}</span>
              <button onClick={() => setQty(qty + 1)}>
                <FontAwesomeIcon icon={faPlus} />
              </button>
            </div>
            <button
              className="btn add-to-cart"
              disabled={selectedSubProduct.stock <= 0}
              onClick={async () => {
                try {
                  const res = await addToCart(selectedSubProduct.id, qty);
                  console.log("Added to cart:", res.cart);
                  alert("Đã thêm vào giỏ hàng!");
                } catch (error: any) {
                  console.error("Lỗi khi thêm vào giỏ hàng:", error);
                  const response = error.response;

                  if (response?.data?.errors?.subproduct?.length > 0) {
                    alert(response.data.errors.subproduct[0]);
                  } else if (response?.data?.detail) {
                    alert(response.data.detail);
                  } else {
                    alert("Thêm vào giỏ hàng thất bại!");
                  }
                }
              }}
            >
              <FontAwesomeIcon icon={faShoppingCart} /> Add to Cart
            </button>
            <button
              className="btn buy-now"
              onClick={handleBuyNow}
              disabled={selectedSubProduct.stock === 0}
            >
              Buy Now
            </button>
          </div>

          <div className="extras">
            <button onClick={handleAddToWishlist}>
              <FontAwesomeIcon icon={faHeartOutline} /> Add to Wishlist
            </button>
            <button onClick={handleAddToCompare}>
              <FontAwesomeIcon icon={faExchangeAlt} /> Add to Compare
            </button>
            <div className="share">
              <span>Share product:</span>
              <FontAwesomeIcon icon={faShareSquare} />
              <FontAwesomeIcon icon={faFacebookF} />
              <FontAwesomeIcon icon={faTwitter} />
              <FontAwesomeIcon icon={faPinterestP} />
            </div>
          </div>

          <div className="secure">
            <span>100% Guarantee Safe Checkout</span>
            <div className="payment-methods">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo.svg"
                alt="Amex"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg"
                alt="Visa"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png"
                alt="MasterCard"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
                alt="PayPal"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bottom">
        <div className="tabs">
          {["description", "specification", "review"].map((tab) => (
            <button
              key={tab}
              className={activeTab === tab ? "active" : ""}
              onClick={() => setActiveTab(tab as "description" | "specification" | "review")}
            >
              {tab === "review"
                ? "Reviews"
                : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="tab-content">
          {activeTab === "description" && (
            <div className="desc">
              <p>{tabs.description}</p>
            </div>
          )}
          {activeTab === "specification" && (
            <div className="spec">
              <ul>
                {tabs.specification.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          )}
          {activeTab === "review" && (
            <div className="review">
              {tabs.reviews.length === 0 ? (
                <p>Chưa có đánh giá nào.</p>
              ) : (
                <ul className="review-list">
                  {tabs.reviews.map((r, idx) => (
                    <li key={idx} className="review-item">
                      <div className="review-header">
                        <strong>{r.user_name}</strong>
                        <span className="rating"> ({r.rating} ★)</span>
                        <span className="date">
                          {new Date(r.created_at).toLocaleDateString("vi-VN", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                          })}
                        </span>
                      </div>
                      <p className="comment">{r.comment}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>

      <ProductCategoryGrid />
    </div>
  );
}
