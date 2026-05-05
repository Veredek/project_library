import { useEffect, useState } from "react";
function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  // URL base da API (ajuste conforme seu backend Django)
  const API_URL = "http://127.0.0.1:8000/api/books/";
  const CREATE_URL = "http://127.0.0.1:8000/api/books/create/";
  const DELETE_URL = "http://127.0.0.1:8000/api/books/delete/";
  // 🔹 Buscar dados
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
  // 🔹 Executa ao carregar a página
  useEffect(() => {
    fetchItems();
  }, []);
  // 🔹 Função pronta para criar item e atualizar lista
  const createItem = async (newItem) => {
    try {
      const response = await fetch(CREATE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newItem),
      });
      if (!response.ok) {
        throw new Error("Erro ao criar item");
      }
      const created = await response.json();
      // Atualiza lista local
      setItems((prev) => [...prev, created]);
      setTitle("");
      setDescription("");
    } catch (err) {
      console.error("Erro ao criar item:", err);
      setError(err.message);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError("Por favor, informe título e descrição.");
      return;
    }
    await createItem({ title, description });
  };

  const deleteItem = async (id) => {
    try {
      const response = await fetch(`${DELETE_URL}${id}/`, {
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
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <label style={{ width: "100px", textAlign: "right" }}>Título:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ flex: 1, padding: "8px", minWidth: "0" }}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <label style={{ width: "100px", textAlign: "right" }}>Descrição:</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ flex: 1, padding: "8px", minWidth: "0" }}
          />
        </div>
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