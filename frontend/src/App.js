import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import CarrosList from './pages/CarrosList';
import CarroForm from './pages/CarroForm';
import PrivateRoute from './components/PrivateRoute';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/carros"
          element={
            <PrivateRoute>
              <CarrosList />
            </PrivateRoute>
          }
        />
        <Route
          path="/carros/novo"
          element={
            <PrivateRoute>
              <CarroForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/carros/editar/:id"
          element={
            <PrivateRoute>
              <CarroForm />
            </PrivateRoute>
          }
        />
        <Route path="/" element={<Navigate to="/carros" />} />
      </Routes>
    </Router>
  );
}

export default App;
