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
              <img src="https://res.cloudinary.com/dqfrshwt9/image/upload/v1750082348/gce55wc2vg3g0qeqzf2e.jpg" alt="Laptop" />
              <p>Laptop</p>
            </div>
            <div className="carousel-item">
              <img src="https://res.cloudinary.com/dqfrshwt9/image/upload/v1750082185/kjpvubipcps2miqskc7o.jpg" alt="SmartPhone" />
              <p>SmartPhone</p>
            </div>
            <div className="carousel-item">
              <img src="https://res.cloudinary.com/dqfrshwt9/image/upload/v1750081983/newpn8v0zttvwu95ya1v.jpg" alt="Headphones" />
              <p>Headphones</p>
            </div>
            <div className="carousel-item">
              <img src="https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/4547/338172/bo-ban-phim-chuot-khong-day-philips-spt6348-160525-103518-470-600x600.jpg" alt="Accessories" />
              <p>Keyboard</p>
            </div>
            <div className="carousel-item">
              <img src="https://res.cloudinary.com/dqfrshwt9/image/upload/v1750081816/dcsrq7goroquolic8blw.jpg" alt="Camera" />
              <p>PC</p>
            </div>
            <div className="carousel-item">
              <img src="https://res.cloudinary.com/dqfrshwt9/image/upload/v1750081905/innlci6sksatzivzweyd.jpg" alt="TV & Homes" />
              <p>Tablet</p>
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
