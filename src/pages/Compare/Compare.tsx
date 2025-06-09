import './Compare.scss';
import DashboardSidebar from "../../components/DashboardSidebar/DashboardSidebar";
import { useEffect, useState } from "react";
import { getMyCompareProducts, softDeleteCompareProduct  } from "../../services/compareService";
import { addToCart } from "../../services/cartService";

interface Product {
  compareProductId: number;
  subProductId: number;
  image: string;
  title: string;
  rating: number;
  ratingCount: string;
  price: string;
  color: string;
  brand: string;
  model: string;
  status: 'IN STOCK' | 'OUT OF STOCK';
  size: string;
}

const fieldLabels = [
  'Customer feedback',
  'Price',
  'Color',
  'Brand',
  'Model',
  'ROM',
  'Stock status',
];

const chunkArray = <T,>(arr: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};

const Compare = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const productChunks = chunkArray(products, 3);
  const filteredFieldLabels = fieldLabels.filter(label => {
  if (label === 'ROM') {
    return products.some(product => product.size && product.size.trim() !== '');
  }
  return true;
});


  const extractModel = (specification: string): string | null => {
    const match = specification.match(/Model:\s*([^,]+)/i);
    return match ? match[1].trim() : null;
  };


  useEffect(() => {
    getMyCompareProducts().then(apiData => {
      const formatted: Product[] = apiData.map((item: any) => {
        const sub = item.sub_product;
        const prod = sub.product;
        return {
          compareProductId: item.id,
          subProductId: sub.id,
          image: sub.image,
          title: prod.name,
          rating: 4.5, // nếu có rating thực tế thì thay vào
          ratingCount: prod.sold_per_month.toLocaleString(),
          price: `${sub.price.toLocaleString('en-US', { maximumFractionDigits: 2 })} VNĐ`,  
          color: sub.color,
          brand: prod.brand,
          model: extractModel(sub.specification) || "",
          status: sub.stock > 0 ? "IN STOCK" : "OUT OF STOCK",
          size: sub.size,
        };
      });

      setProducts(formatted);
    }).catch(err => {
      console.error("Error fetching compare products:", err);
    });
  }, []);

  const handleRemove = async (compareProductId: number) => {
    try {
      await softDeleteCompareProduct(compareProductId);
      setProducts(prev => prev.filter(p => p.compareProductId !== compareProductId));
    } catch (err) {
      console.error("Error removing product:", err);
    }
  };

  const handleAddToCart = async (subProductId: number) => {
      try {
        await addToCart(subProductId, 1);
        alert("Đã thêm vào giỏ hàng!");
      } catch (error) {
        console.error("Lỗi khi thêm vào giỏ hàng:", error);
        alert("Sản phẩm đã có trong giỏ hàng.");
      }
    };

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
                      <button className="remove-button" onClick={() => handleRemove(product.compareProductId)}>✖</button>
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
                          onClick={() => handleAddToCart(product.subProductId)}
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
              {filteredFieldLabels.map((label, i) => (
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
                      case 'Color':
                        content = product.color;
                        break;
                      case 'Brand':
                        content = product.brand;
                        break;
                      case 'Model':
                        content = product.model;
                        break;
                      case 'ROM':
                        content = product.size;
                        break;
                      case 'Stock status':
                        content = product.status;
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
