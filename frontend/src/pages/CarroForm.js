import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { carroService } from '../services/carroService';
import './CarroForm.css';

function CarroForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [carro, setCarro] = useState({
    modelo: '',
    ano: new Date().getFullYear(),
    cor: '',
    cavalosDePotencia: '',
    fabricante: '',
    pais: '',
  });

  useEffect(() => {
    if (id) {
      loadCarro();
    }
  }, [id]);

  const loadCarro = async () => {
    try {
      setLoading(true);
      const data = await carroService.getById(id);
      setCarro(data);
    } catch (err) {
      setError('Erro ao carregar carro');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCarro({ ...carro, [name]: value });
    if (validationErrors[name]) {
      setValidationErrors({ ...validationErrors, [name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setValidationErrors({});
    setLoading(true);

    try {
      if (id) {
        await carroService.update(id, carro);
      } else {
        await carroService.create(carro);
      }
      navigate('/carros');
    } catch (err) {
      if (err.response && err.response.data) {
        if (typeof err.response.data === 'object') {
          setValidationErrors(err.response.data);
        } else {
          setError('Erro ao salvar carro');
        }
      } else {
        setError('Erro ao salvar carro');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading && id) {
    return <div className="loading">Carregando...</div>;
  }

  return (
    <div className="form-container">
      <div className="form-box">
        <div className="form-header">
          <h1>{id ? 'Editar Carro' : 'Novo Carro'}</h1>
          <button onClick={() => navigate('/carros')} className="btn-back">
            Voltar
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="modelo">Modelo *</label>
              <input
                type="text"
                id="modelo"
                name="modelo"
                value={carro.modelo}
                onChange={handleChange}
                required
              />
              {validationErrors.modelo && (
                <span className="field-error">{validationErrors.modelo}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="ano">Ano *</label>
              <input
                type="number"
                id="ano"
                name="ano"
                value={carro.ano}
                onChange={handleChange}
                min="1886"
                max="2030"
                required
              />
              {validationErrors.ano && (
                <span className="field-error">{validationErrors.ano}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="cor">Cor *</label>
              <input
                type="text"
                id="cor"
                name="cor"
                value={carro.cor}
                onChange={handleChange}
                required
              />
              {validationErrors.cor && (
                <span className="field-error">{validationErrors.cor}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="cavalosDePotencia">Cavalos de Potencia *</label>
              <input
                type="number"
                id="cavalosDePotencia"
                name="cavalosDePotencia"
                value={carro.cavalosDePotencia}
                onChange={handleChange}
                min="50"
                max="2000"
                required
              />
              {validationErrors.cavalosDePotencia && (
                <span className="field-error">{validationErrors.cavalosDePotencia}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="fabricante">Fabricante *</label>
              <input
                type="text"
                id="fabricante"
                name="fabricante"
                value={carro.fabricante}
                onChange={handleChange}
                required
              />
              {validationErrors.fabricante && (
                <span className="field-error">{validationErrors.fabricante}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="pais">Pais *</label>
              <input
                type="text"
                id="pais"
                name="pais"
                value={carro.pais}
                onChange={handleChange}
                required
              />
              {validationErrors.pais && (
                <span className="field-error">{validationErrors.pais}</span>
              )}
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={() => navigate('/carros')} className="btn-cancel">
              Cancelar
            </button>
            <button type="submit" disabled={loading} className="btn-submit">
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CarroForm;
