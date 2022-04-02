import { Product } from "../Product";

interface SearchResultsProps {
  results: Array<{
    id: number;
    price: number;
    title: string;
  }>;
}

const SearchProduct = ({ results }: SearchResultsProps) => {
  return (
    <div>
      {results.map((result) => (
        <Product key={result.id} product={result} />
      ))}
    </div>
  );
};

export { SearchProduct };
