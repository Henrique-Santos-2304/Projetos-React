import { memo } from "react";

interface ProductProps {
  product: {
    id: number;
    price: number;
    title: string;
  };
}

const ProductComponent = ({ product }: ProductProps) => (
  <p>
    {product.title}:{" "}
    <strong style={{ marginLeft: "1rem" }}>{product.price}</strong>
  </p>
);

export const Product = memo(ProductComponent, (prev, next) => {
  return Object.is(prev.product, next.product);
});
