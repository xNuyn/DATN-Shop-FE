import ProductCategoryGrid from '../../components/ProductCategoryGrid/ProductCategoryGrid';
import './HomePage.scss';
import FeaturedProducts from "../../components/FeaturedProducts/FeaturedProducts";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="homepage">
        <div className="promo-banner">
        <div className="promo-left">
            <div className="promo-content">
                <button className="promo-button" onClick={() =>
                  {
                    navigate("/shop-page");
                  }
                }>SHOP NOW</button>
            </div>
            <div className="promo-bg" />
        </div>
        <div className="promo-right">
          <div className="promo-card pixel">
          </div>
          <div className="promo-card xiaomi">
            <div className="promo-card-content">
            </div>
          </div>
        </div>
      </div>

      <div className="category-carousel">
        <h2 className="carousel-title">Shop with Categorys</h2>
        <div className="carousel-container">
          <button className="carousel-button left">{'<'}</button>
          <div className="carousel-items">
            <div className="carousel-item">
              <img src="https://cdn.tgdd.vn/Products/Images/44/289472/apple-macbook-air-m2-2022-xanh-den-1-2-600x600.jpg" alt="Laptop" />
              <p>Laptop</p>
            </div>
            <div className="carousel-item">
              <img src="https://cdn.tgdd.vn/Products/Images/42/335955/samsung-galaxy-s25-edge-sliver-thumb-600x600.jpg" alt="SmartPhone" />
              <p>SmartPhone</p>
            </div>
            <div className="carousel-item">
              <img src="https://cdn.tgdd.vn/Products/Images/54/324580/tai-nghe-bluetooth-chup-tai-jbl-tune-670nc-xanh-thumb-600x600.jpg" alt="Headphones" />
              <p>Headphones</p>
            </div>
            <div className="carousel-item">
              <img src="https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/4547/338172/bo-ban-phim-chuot-khong-day-philips-spt6348-160525-103518-470-600x600.jpg" alt="Accessories" />
              <p>Accessories</p>
            </div>
            <div className="carousel-item">
              <img src="https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/4728/329241/camera-ip-360-do-3mp-ezviz-ty1-thumb-1-638665876017214332-600x600.jpg" alt="Camera" />
              <p>Camera</p>
            </div>
            <div className="carousel-item">
              <img src="https://cdn.tgdd.vn/Products/Images/5697/321396/xiaomi-a27i-27-inch-fhd-thumb-600x600.jpg" alt="TV & Homes" />
              <p>TV & Homes</p>
            </div>
          </div>
          <button className="carousel-button right">{'>'}</button>
        </div>
      </div>
      <FeaturedProducts />
      <div className="promo-video1">
        <div className="video-wrapper">
            <video
            src="https://images.samsung.com/is/content/samsung/assets/vn/2407/pcd/smp/New_PCD_B6Q6_Main-KV_1440x640_pc.mp4"
            autoPlay
            muted
            loop
            playsInline
            />
        </div>
      </div>
      <div className="promo-video">
        <div className="video-wrapper">
            <video
            src="https://images.samsung.com/is/content/samsung/assets/vn/2501/pcd/smartphones/PCD_P3_Main-KV_1440x640_pc_LTR.mp4"
            autoPlay
            muted
            loop
            playsInline
            />
        </div>
      </div>
      <ProductCategoryGrid />
    </div>
  );
};

export default HomePage;
