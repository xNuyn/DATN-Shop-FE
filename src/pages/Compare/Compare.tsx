import './Compare.scss';
import DashboardSidebar from "../../components/DashboardSidebar/DashboardSidebar";

interface Product {
  image: string;
  title: string;
  rating: number;
  ratingCount: string;
  price: string;
  soldBy: string;
  brand: string;
  model: string;
  status: 'IN STOCK' | 'OUT OF STOCK';
  size: string;
  weight: string;
}

const products: Product[] = [
  {
    image: 'https://cdn.tgdd.vn/Products/Images/42/323567/vivo-v30e-nau-thumb-1-600x600.jpg',
    title: 'Gamdias ARES M2 Gaming Keyboard, Mouse and Mouse Mat Combo',
    rating: 5,
    ratingCount: '51,746,385',
    price: '$899.00',
    soldBy: 'Clicon',
    brand: 'StarTech',
    model: 'ARES M2 and ZEUS E2',
    status: 'IN STOCK',
    size: '6.71 inches, 110.5 cm',
    weight: '650 g (7.41 oz)',
  },
  {
    image: 'https://cdn.tgdd.vn/Products/Images/42/323567/vivo-v30e-nau-thumb-1-600x600.jpg',
    title: 'Apple iMac 24" 4K Retina Display M1 8 Core CPU, 256GB SSD, Blue',
    rating: 5,
    ratingCount: '673,971,743',
    price: '$1,699.00',
    soldBy: 'Apple',
    brand: 'Apple',
    model: 'iMac 24” M1 Blue 2021',
    status: 'IN STOCK',
    size: '6.7 inches, 109.8 cm',
    weight: '240 g (8.47 oz)',
  },
  {
    image: 'https://cdn.tgdd.vn/Products/Images/42/323567/vivo-v30e-nau-thumb-1-600x600.jpg',
    title: 'Samsung Galaxy S21 FE 5G Cell Phone, 128GB, 120Hz Display',
    rating: 4.5,
    ratingCount: '96,459,761',
    price: '$699.99',
    soldBy: 'Clicon',
    brand: 'Samsung',
    model: 'S21 FE',
    status: 'OUT OF STOCK',
    size: '6.4 inches, 98.9 cm',
    weight: '177 g (6.24 oz)',
  },
  {
    image: 'https://cdn.tgdd.vn/Products/Images/42/323567/vivo-v30e-nau-thumb-1-600x600.jpg',
    title: 'Gamdias ARES M2 Gaming Keyboard, Mouse and Mouse Mat Combo',
    rating: 5,
    ratingCount: '51,746,385',
    price: '$899.00',
    soldBy: 'Clicon',
    brand: 'StarTech',
    model: 'ARES M2 and ZEUS E2',
    status: 'IN STOCK',
    size: '6.71 inches, 110.5 cm',
    weight: '650 g (7.41 oz)',
  },
  {
    image: 'https://cdn.tgdd.vn/Products/Images/42/323567/vivo-v30e-nau-thumb-1-600x600.jpg',
    title: 'Apple iMac 24" 4K Retina Display M1 8 Core CPU, 256GB SSD, Blue',
    rating: 5,
    ratingCount: '673,971,743',
    price: '$1,699.00',
    soldBy: 'Apple',
    brand: 'Apple',
    model: 'iMac 24” M1 Blue 2021',
    status: 'IN STOCK',
    size: '6.7 inches, 109.8 cm',
    weight: '240 g (8.47 oz)',
  },
  {
    image: 'https://cdn.tgdd.vn/Products/Images/42/323567/vivo-v30e-nau-thumb-1-600x600.jpg',
    title: 'Samsung Galaxy S21 FE 5G Cell Phone, 128GB, 120Hz Display',
    rating: 4.5,
    ratingCount: '96,459,761',
    price: '$699.99',
    soldBy: 'Clicon',
    brand: 'Samsung',
    model: 'S21 FE',
    status: 'OUT OF STOCK',
    size: '6.4 inches, 98.9 cm',
    weight: '177 g (6.24 oz)',
  },
];

const fieldLabels = [
  'Customer feedback',
  'Price',
  'Sold by',
  'Brand',
  'Model',
  'Stock status',
  'Size',
  'Weight',
];

const chunkArray = <T,>(arr: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};

const Compare = () => {
  const productChunks = chunkArray(products, 3);

  return (
    <div className='compare-page'>
      <div className="sidebar">
        <DashboardSidebar />
      </div>

      <div className="compare-container">
        <h2>Compare Product</h2>
        {productChunks.map((chunk, groupIndex) => (
          <table key={groupIndex} className="compare-table">
            <thead>
              <tr>
                <th></th>
                {chunk.map((product, idx) => (
                  <th key={idx}>
                    <div className="product-cell">
                      <div className="product-image">
                        <img src={product.image} alt={product.title} />
                      </div>
                      <div className="product-title" title={product.title}>
                        {product.title}
                      </div>
                      <div className="product-action">
                        <button
                          className={`add-to-cart ${product.status === 'OUT OF STOCK' ? 'disabled' : ''}`}
                          disabled={product.status === 'OUT OF STOCK'}
                        >
                          ADD TO CART 🛒
                        </button>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {fieldLabels.map((label, i) => (
                <tr key={i}>
                  <td className="label-cell">{label}</td>
                  {chunk.map((product, idx) => {
                    let content = '';
                    switch (label) {
                      case 'Customer feedback':
                        content = `${product.rating}⭐ (${product.ratingCount})`;
                        break;
                      case 'Price':
                        content = product.price;
                        break;
                      case 'Sold by':
                        content = product.soldBy;
                        break;
                      case 'Brand':
                        content = product.brand;
                        break;
                      case 'Model':
                        content = product.model;
                        break;
                      case 'Stock status':
                        content = product.status;
                        break;
                      case 'Size':
                        content = product.size;
                        break;
                      case 'Weight':
                        content = product.weight;
                        break;
                      default:
                        content = '';
                    }
                    return (
                      <td
                        key={idx}
                        className={
                          label === 'Stock status'
                            ? product.status === 'IN STOCK'
                              ? 'in-stock'
                              : 'out-of-stock'
                            : ''
                        }
                      >
                        {content}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        ))}
      </div>
    </div>
  );
};

export default Compare;
