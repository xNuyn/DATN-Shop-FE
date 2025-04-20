import "./app.scss";
import Footer from "./components/Footer";
import Header from "./components/Header";
import ProductItem from "./components/ProductItem";

function App() {
    return (
        <div>
            <Header />
            <ProductItem
                image="https://img.fcbayern.com/image/upload/cms/public/images/fcbayern-com/homepage/stadien/wallpaper-allianz-arena/allianz_arena1.jpg"
                tagName="19% Off"
                productName="Simple Mobile 4G LTE Prepaid Smartphone"
                oldPrice="$100"
                newPrice="$50"
            />
            <Footer />
        </div>
    );
}

export default App;
