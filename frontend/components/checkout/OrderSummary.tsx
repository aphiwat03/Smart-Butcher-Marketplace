"use client";

interface OrderSummaryProps {
  isPaid?: boolean;
}

export default function OrderSummary({ isPaid = false }: OrderSummaryProps) {
  const productPrice = 29.99;
  const subtotal = productPrice;
  const shipping = 5.0;
  const total = subtotal + shipping;

  return (
    <aside className="order-summary">
      {/* Product Row */}
      <div className="product-row">
        <div className="product-img-wrap">
          <img
            src="/product-candle.jpg"
            alt="Candleaf Soy Candle"
            className="product-img"
          />
          <span className="cart-badge">1</span>
        </div>
        <div className="product-meta">
          <p className="product-name">Candleaf® Soy Candle</p>
          <p className="product-variant">Forest · 100g</p>
        </div>
        <p className="product-price">${productPrice.toFixed(2)}</p>
      </div>

      <div className="divider" />

      {/* Price Breakdown */}
      <div className="price-rows">
        <div className="price-row">
          <span className="price-label">Subtotal</span>
          <span className="price-value">${subtotal.toFixed(2)}</span>
        </div>
        <div className="price-row">
          <span className="price-label">Shipping</span>
          <span className="price-value shipping-note">
            Standard · ${shipping.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="divider" />

      {/* Total */}
      <div className="price-row total-row">
        <span className="total-label">{isPaid ? "Paid" : "Total"}</span>
        <span className="total-value">${total.toFixed(2)}</span>
      </div>

      <style jsx>{`
        .order-summary {
          background: #fafaf8;
          border: 1px solid #ede9e0;
          border-radius: 12px;
          padding: 24px;
          width: 100%;
        }

        .product-row {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 20px;
        }

        .product-img-wrap {
          position: relative;
          flex-shrink: 0;
        }

        .product-img {
          width: 64px;
          height: 64px;
          object-fit: cover;
          border-radius: 8px;
          background: #e8e0d5;
          display: block;
        }

        /* Fallback when image missing */
        .product-img-wrap::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #e8e0d5 0%, #d4c4a8 100%);
          border-radius: 8px;
          z-index: 0;
        }

        .product-img {
          position: relative;
          z-index: 1;
        }

        .cart-badge {
          position: absolute;
          top: -6px;
          right: -6px;
          background: #b4915b;
          color: #fff;
          font-size: 10px;
          font-weight: 700;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
        }

        .product-meta {
          flex: 1;
          min-width: 0;
        }

        .product-name {
          font-size: 13px;
          font-weight: 600;
          color: #2c2c2c;
          margin: 0 0 3px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .product-variant {
          font-size: 12px;
          color: #999;
          margin: 0;
        }

        .product-price {
          font-size: 14px;
          font-weight: 600;
          color: #2c2c2c;
          margin: 0;
          white-space: nowrap;
        }

        .divider {
          height: 1px;
          background: #ede9e0;
          margin: 16px 0;
        }

        .price-rows {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .price-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .price-label {
          font-size: 13px;
          color: #888;
        }

        .price-value {
          font-size: 13px;
          color: #555;
        }

        .shipping-note {
          font-size: 12px;
        }

        .total-row {
          margin-top: 0;
        }

        .total-label {
          font-size: 14px;
          font-weight: 700;
          color: #2c2c2c;
        }

        .total-value {
          font-size: 18px;
          font-weight: 700;
          color: #b4915b;
        }
      `}</style>
    </aside>
  );
}
