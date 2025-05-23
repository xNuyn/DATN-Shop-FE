import { FC, memo } from "react";
import ProductItem from "../../components/ProductItem";

const HomePage: FC = memo(() => {
    return (
            <ProductItem
                image="https://img.fcbayern.com/image/upload/cms/public/images/fcbayern-com/homepage/stadien/wallpaper-allianz-arena/allianz_arena1.jpg"
                tagName="19% Off"
                productName="Simple Mobile 4G LTE Prepaid Smartphone"
                oldPrice="$100"
                newPrice="$50"
            />
    );
});

export default HomePage;
