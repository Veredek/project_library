import { useEffect, useState } from "react";
function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [bookCategory, setBookCategory] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  // URLs
  const API_URL = "http://127.0.0.1:8000/api/books/";
  const CATEGORY_URL = "http://127.0.0.1:8000/api/books/by-category/";

  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error("Erro ao buscar dados");
      }
      const data = await response.json();
      setItems(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  // Fetch Items
  useEffect(() => {
    const loadItems = async () => {
      await Promise.resolve();
      await fetchItems();
    };

    void loadItems();
  }, []);

  const createItem = async (newItem) => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newItem),
      });
      if (!response.ok) {
        throw new Error("Erro ao criar item");
      }
      // Refresh inputs
      setTitle("");
      setDescription("");
      setBookCategory("Selecione a categoria");
    } catch (err) {
      console.error("Erro ao criar item:", err);
      setError(err.message);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!title.trim() || !description.trim() || !bookCategory.trim()) {
      setError("Por favor, informe título, descrição e categoria.");
      return;
    }
    console.log("Criando item com:", { title, description, bookCategory });
    await createItem({ title, description, category: bookCategory });
    const response = await fetch(filterCategory!=="" ? `${CATEGORY_URL}?category=${filterCategory}` : API_URL);
    const data = await response.json();
    console.log("Dados após criação:", data);
    setItems(Array.isArray(data) ? data : (data.results || []));
  };

  const deleteItem = async (id) => {
    try {
      const response = await fetch(`${API_URL}${id}/`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Erro ao deletar item");
      }
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Erro ao deletar item:", err);
      setError(err.message);
    }
  };

  const handleCategoryChange = async (event) => {
    const selectedCategory = event.target.value;
    console.log("Categoria selecionada:", selectedCategory);
    setFilterCategory(selectedCategory);

    try {
      if (!selectedCategory) {
        // Se nenhuma categoria selecionada, buscar todos
        await fetchItems();
        return;
      }

      const response = await fetch(`${CATEGORY_URL}?category=${selectedCategory}`);
      if (!response.ok) {
        throw new Error("Erro ao filtrar por categoria");
      }
      const data = await response.json();
      setItems(Array.isArray(data) ? data : (data.results || []));
    } catch (err) {
      console.error("Erro ao filtrar:", err);
      setError(err.message);
    }
  }

  return (
    <div style={{ padding: "20px", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <h1>Lista de Itens</h1>
      <form
        onSubmit={handleSubmit}
        style={{
          marginBottom: "20px",
          display: "grid",
          gap: "12px",
          maxWidth: "480px",
          width: "100%",
        }}
      >
        {/* Título */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <label style={{ width: "100px", textAlign: "right" }}>Título:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ flex: 1, padding: "8px", minWidth: "0" }}
          />
        </div>
        {/* Descrição */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <label style={{ width: "100px", textAlign: "right" }}>Descrição:</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ flex: 1, padding: "8px", minWidth: "0" }}
          />
        </div>
        {/* Categoria */}
        <div style={{ display: "block", alignItems: "center", gap: "12px" }}>
          <select value={bookCategory} onChange={(e) => setBookCategory(e.target.value)}>
            <option value="">Selecione a categoria</option>
            <option value="fiction">Fiction</option>
            <option value="adventure">Adventure</option>
          </select>
        </div>
        {/* Botão de envio */}
        <button
          type="submit"
          style={{
            width: "120px",
            padding: "8px 12px",
            justifySelf: "center",
          }}
        >
          Criar item
        </button>
        {/* Filtro de categoria */}
        <label>
          <input
          type="radio"
          name="filter"
          value=""
          checked={filterCategory === ""}
          onChange={handleCategoryChange}
          />
          All
        </label>
        <label>
          <input
          type="radio"
          name="filter"
          value="fiction"
          checked={filterCategory === "fiction"}
          onChange={handleCategoryChange}
          />
          Fiction
        </label>
        <label>
          <input
          type="radio"
          name="filter"
          value="adventure"
          checked={filterCategory === "adventure"}
          onChange={handleCategoryChange}
          />
          Adventure
        </label>
      </form>
      {loading && <p>Carregando...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <strong>{item.title}</strong> - {item.description}
            <button
              style={{ marginLeft: "10px" }}
              onClick={() => deleteItem(item.id)}
            >
              Excluir
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
export default App;