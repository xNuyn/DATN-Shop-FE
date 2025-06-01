import React, { useState } from "react";
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
import ProductCategoryGrid from '../../components/ProductCategoryGrid/ProductCategoryGrid';


interface FakeData {
  images: string[];
  rating: { stars: number; count: number };
  product: {
    title: string;
    sku: string;
    brand: string;
    availability: string;
    category: string;
  };
  pricing: {
    current: number;
    original: number;
    discountPercent: number;
  };
  options: {
    colors: { hex: string; selected: boolean }[];
    sizes: string[];
  };
  tabs: {
    description: string;
    specification: string[];
    shippingInformation: { method: string; time: string }[];
    reviewSummary: string;
  };
}

const fakeData: FakeData = {
  images: [
    "https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/44/327980/dell-latitude-3440-i5-l3440i51235u16g512g-thumb-638754978664212690-600x600.jpg",
    "https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/44/311178/asus-vivobook-go-15-e1504fa-r5-nj776w-140225-100949-251-600x600.jpg",
    "https://cdn.tgdd.vn/Products/Images/44/335362/macbook-air-13-inch-m4-xanh-da-troi-600x600.jpg",
    "https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/44/326124/msi-thin-15-b12ucx-i5-2046vn-140225-102530-055-600x600.jpg",
    "https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/44/322222/acer-aspire-3-a314-42p-r3b3-r7-nxksfsv001-thumb-638754904905578083-600x600.jpg",
  ],
  rating: {
    stars: 4.7,
    count: 21671,
  },
  product: {
    title:
      "2020 Apple MacBook Pro with Apple M1 Chip (13-inch, 8GB RAM, 256GB SSD) – Space Gray",
    sku: "A264671",
    brand: "Apple",
    availability: "In Stock",
    category: "Electronics Devices",
  },
  pricing: {
    current: 1699,
    original: 1999,
    discountPercent: 21,
  },
  options: {
    colors: [
      { hex: "#c0c0c0", selected: true },
      { hex: "#f0f0f0", selected: false },
    ],
    sizes: ["14-inch Liquid Retina XDR display"],
  },
  tabs: {
    description:
      "The most powerful MacBook Pro ever is here... (lorem ipsum)...",
    specification: [
      "Free 1 Year Warranty",
      "Free Shipping & Fast Delivery",
      "100% Money-back guarantee",
      "24/7 Customer support",
      "Secure payment method",
    ],
    shippingInformation: [
      { method: "Courier", time: "2–4 days, free shipping" },
      { method: "Local Shipping", time: "up to one week, $19.00" },
      { method: "UPS Ground Shipping", time: "4–6 days, $29.00" },
      { method: "Uniship Global Export", time: "3–4 days, $39.00" },
    ],
    reviewSummary: "(21,671 ratings)…",
  },
};

export default function ProductDetail() {
  const {
    images,
    rating,
    product,
    pricing,
    options,
    tabs,
  } = fakeData;

  const [mainIdx, setMainIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState<
    "description" | "specification" | "shippingInformation" | "review"
  >("description");

  return (
    <div className="product-detail">
      <div className="top">
        {/* Gallery */}
        <div className="gallery">
          <img
            src={images[mainIdx]}
            alt={`Product ${mainIdx + 1}`}
            className="main-img"
          />
          <button
            className="nav prev"
            onClick={() =>
              setMainIdx((mainIdx - 1 + images.length) % images.length)
            }
          >
            ‹
          </button>
          <button
            className="nav next"
            onClick={() => setMainIdx((mainIdx + 1) % images.length)}
          >
            ›
          </button>
          <div className="thumbs">
            {images.map((src, i) => (
              <img
                key={i}
                src={src}
                alt=""
                className={i === mainIdx ? "active" : ""}
                onClick={() => setMainIdx(i)}
              />
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="info">
          <div className="rating">
            {Array.from({ length: 5 }).map((_, i) => (
              <FontAwesomeIcon
                key={i}
                icon={faStar}
                color="#f5a623"
              />
            ))}
            <span>
              {rating.stars} Star Rating ({rating.count} User feedback)
            </span>
          </div>
          <h1 className="title">{product.title}</h1>
          <ul className="meta">
            <li>
              <strong>Sku:</strong> {product.sku}
            </li>
            <li>
              <strong>Brand:</strong> {product.brand}
            </li>
            <li>
              <strong>Availability:</strong>{" "}
              <span className="in-stock">{product.availability}</span>
            </li>
            <li>
              <strong>Category:</strong> {product.category}
            </li>
          </ul>

          <div className="price-block">
            <span className="new">${pricing.current}</span>
            <span className="old">${pricing.original}</span>
            <span className="discount">
              {pricing.discountPercent}% OFF
            </span>
          </div>

          <div className="options">
            <div className="option">
              <label>Color:</label>
              <div className="colors">
                {options.colors.map((c, i) => (
                  <span
                    key={i}
                    className={`circle ${c.selected ? "selected" : ""}`}
                    style={{ background: c.hex }}
                  />
                ))}
              </div>
            </div>
            <div className="option">
              <label>Size:</label>
              <select>
                {options.sizes.map((s, i) => (
                  <option key={i}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="actions">
            <div className="qty">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
              >
                <FontAwesomeIcon icon={faMinus} />
              </button>
              <span>{qty.toString().padStart(2, "0")}</span>
              <button onClick={() => setQty(qty + 1)}>
                <FontAwesomeIcon icon={faPlus} />
              </button>
            </div>
            <button className="btn add-to-cart">
              Add To Cart <FontAwesomeIcon icon={faShoppingCart} />
            </button>
            <button className="btn buy-now">Buy Now</button>
          </div>

          <div className="extras">
            <button>
              <FontAwesomeIcon icon={faHeartOutline} /> Add to Wishlist
            </button>
            <button>
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
                <img src="https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo.svg" alt="Amex" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" alt="Visa" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png" alt="MasterCard" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" />
            </div>
            {/* <img
              src="https://via.placeholder.com/300x40?text=Visa+PayPal+..."
              alt="payments"
            /> */}
          </div>
        </div>
      </div>
      <div className="bottom">
        {/* Tabs */}
        <div className="tabs">
          {[
            "description",
            "specification",
            "shippingInformation",
            "review",
          ].map((tab) => (
            <button
              key={tab}
              className={activeTab === tab ? "active" : ""}
              onClick={() => setActiveTab(tab as any)}
            >
              {tab === "shippingInformation"
                ? "Shipping Info"
                : tab === "review"
                ? "Reviews"
                : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === "description" && (
            <div className="desc">
              <p>{tabs.description}</p>
            </div>
          )}
          {activeTab === "specification" && (
            <div className="spec">
              <h3>Specification</h3>
              <ul>
                {tabs.specification.map((spec, i) => (
                  <li key={i}>{spec}</li>
                ))}
              </ul>
            </div>
          )}
          {activeTab === "shippingInformation" && (
            <div className="spec">
              <h3>Shipping Information</h3>
              <ul>
                {tabs.shippingInformation.map((sh, i) => (
                  <li key={i}>
                    {sh.method}: {sh.time}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {activeTab === "review" && (
              <div className="review">
                  <h3>Reviews</h3>
                  <p>{tabs.reviewSummary}</p>
              </div>
          )}
        </div>
      </div>
      <ProductCategoryGrid />
    </div>
  );
}
