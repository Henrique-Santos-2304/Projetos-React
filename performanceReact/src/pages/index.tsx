import type { NextPage } from "next";
import { FormEvent, useState } from "react";
import { SearchProduct } from "../components/SearchProduct";

const Home: NextPage = () => {
  const [search, setSearch] = useState("");
  const [result, setResult] = useState([]);
  const handleSearch = async (event: FormEvent) => {
    event.preventDefault();

    if (!search.trim()) {
      return;
    }
    const response = await fetch(`http://localhost:3333/products?q=${search}`);
    const data = await response.json();

    console.log(data);

    setResult(data);
  };
  return (
    <div style={{ marginLeft: "5rem" }}>
      <h1>Pesquisa</h1>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <button type="submit">Enviar</button>
      </form>
      <SearchProduct results={result} />
    </div>
  );
};

export default Home;
