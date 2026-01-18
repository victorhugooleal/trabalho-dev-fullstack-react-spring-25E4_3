import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { carroService } from '../services/carroService';
import { authService } from '../services/authService';
import './CarrosList.css';

function CarrosList() {
  const [carros, setCarros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState({ modelo: '', fabricante: '', pais: '' });
  const [isSearchActive, setIsSearchActive] = useState(false);
  const navigate = useNavigate();
  const pageSize = 10;

  useEffect(() => {
    loadCarros();
  }, [page]);

  const loadCarros = async () => {
    try {
      setLoading(true);
      const result = await carroService.getAll(page, pageSize);
      setCarros(result.carros);
      setTotalCount(result.totalCount);
      setIsSearchActive(false);
      setError('');
    } catch (err) {
      setError('Erro ao carregar carros');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setPage(0);
      const result = await carroService.search(
        search.modelo,
        search.fabricante,
        search.pais
      );
      setCarros(result);
      setTotalCount(result.length);
      setIsSearchActive(true);
      setError('');
    } catch (err) {
      setError('Erro ao buscar carros');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Deseja realmente excluir este carro?')) {
      return;
    }

    try {
      await carroService.delete(id);
      if (isSearchActive) {
        handleSearch({ preventDefault: () => {} });
      } else {
        loadCarros();
      }
    } catch (err) {
      setError('Erro ao excluir carro');
    }
  };

  const handleClearSearch = () => {
    setSearch({ modelo: '', fabricante: '', pais: '' });
    setPage(0);
    setIsSearchActive(false);
    loadCarros();
  };

  const handleExport = async () => {
    try {
      await carroService.exportCSV();
    } catch (err) {
      setError('Erro ao exportar dados');
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="carros-container">
      <header className="carros-header">
        <h1>Gerenciamento de Carros</h1>
        <div className="header-actions">
          <span>Bem-vindo, {authService.getUser()?.nome}</span>
          <button onClick={handleLogout} className="btn-logout">Sair</button>
        </div>
      </header>

      <div className="carros-content">
        {error && <div className="error-message">{error}</div>}

        <div className="search-section">
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="Modelo"
              value={search.modelo}
              onChange={(e) => setSearch({ ...search, modelo: e.target.value })}
            />
            <input
              type="text"
              placeholder="Fabricante"
              value={search.fabricante}
              onChange={(e) => setSearch({ ...search, fabricante: e.target.value })}
            />
            <input
              type="text"
              placeholder="Pais"
              value={search.pais}
              onChange={(e) => setSearch({ ...search, pais: e.target.value })}
            />
            <button type="submit" className="btn-search">Buscar</button>
            <button type="button" onClick={handleClearSearch} className="btn-clear">Limpar</button>
          </form>
        </div>

        <div className="actions-section">
          <button onClick={() => navigate('/carros/novo')} className="btn-primary">
            Novo Carro
          </button>
          <button onClick={handleExport} className="btn-export">
            Exportar CSV
          </button>
        </div>

        {loading ? (
          <div className="loading">Carregando...</div>
        ) : (
          <>
            <table className="carros-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Modelo</th>
                  <th>Ano</th>
                  <th>Cor</th>
                  <th>Potencia</th>
                  <th>Fabricante</th>
                  <th>Pais</th>
                  <th>Acoes</th>
                </tr>
              </thead>
              <tbody>
                {carros.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center' }}>
                      Nenhum carro encontrado
                    </td>
                  </tr>
                ) : (
                  carros.map((carro) => (
                    <tr key={carro.id}>
                      <td>{carro.id}</td>
                      <td>{carro.modelo}</td>
                      <td>{carro.ano}</td>
                      <td>{carro.cor}</td>
                      <td>{carro.cavalosDePotencia} HP</td>
                      <td>{carro.fabricante}</td>
                      <td>{carro.pais}</td>
                      <td>
                        <button
                          onClick={() => navigate(`/carros/editar/${carro.id}`)}
                          className="btn-edit"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(carro.id)}
                          className="btn-delete"
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {totalPages > 1 && !isSearchActive && (
              <div className="pagination">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 0}
                  className="btn-page"
                >
                  Anterior
                </button>
                <span>
                  Pagina {page + 1} de {totalPages}
                </span>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page >= totalPages - 1}
                  className="btn-page"
                >
                  Proxima
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default CarrosList;
