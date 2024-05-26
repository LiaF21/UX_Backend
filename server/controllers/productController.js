const productService = require('../services/productService');
const express = require('express');
const router = express.Router();


exports.createTransaccion = async (req, res) => {
  try {
    const { id_huesped, valor, fecha, becada } = req.body;
    const transaccion = await productService.createTransaccion(id_huesped, valor, fecha, becada);
    res.status(201).json(transaccion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTransaccionById = async (req, res) => {
  try {
    const transaccion = await productService.getTransaccionById(req.params.id);
    if (transaccion) {
      res.status(200).json(transaccion);
    } else {
      res.status(404).json({ message: 'Esta transaccion no existe en registro' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTransaccionesByFecha = async (req, res) => {
  try {
    const { fechaInicio, fechaFinal } = req.query;
    const transacciones = await productService.getTransaccionesByFecha(fechaInicio, fechaFinal);
    res.status(200).json(transacciones);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createRegla = async (req, res) => {
  try {
    const { numero_regla, descripcion_regla } = req.body;
    const regla = await productService.createRegla(numero_regla, descripcion_regla);
    res.status(201).json(regla);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getReglaById = async (req, res) => {
  try {
    const regla = await productService.getReglaById(req.params.id);
    if (regla) {
      res.status(200).json(regla);
    } else {
      res.status(404).json({ message: 'Regla no encontrda' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getReglamento = async (req, res) => {
  try {
    const reglamento = await productService.getReglamento();
    res.status(200).json(reglamento);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.editRegla = async (req, res) => {
  try {
    const { numero_regla, descripcion_regla } = req.body;
    await productService.editRegla(req.params.id, numero_regla, descripcion_regla);
    res.status(200).json({ message: 'Regla modificada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createHospital = async (req, res) => {
  try {
    const { nombre, direccion } = req.body;
    const hospital = await productService.createHospital(nombre, direccion);
    res.status(201).json(hospital);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getHospitalById = async (req, res) => {
  try {
    const hospital = await productService.getHospitalById(req.params.id);
    if (hospital) {
      res.status(200).json(hospital);
    } else {
      res.status(404).json({ message: 'Hospital no encontrado en registro' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getHospitales = async (req, res) => {
  try {
    const hospitales = await productService.getHospitales();
    res.status(200).json(hospitales);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteHospitalById = async (req, res) => {
  try {
    await productService.deleteHospitalById(req.params.id);
    res.status(200).json({ message: 'Hospital eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createPiso = async (req, res) => {
  try {
    const { id_hospital, nombre_piso } = req.body;
    const piso = await productService.createPiso(id_hospital, nombre_piso);
    res.status(201).json(piso);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPisoById = async (req, res) => {
  try {
    const piso = await productService.getPisoById(req.params.id);
    if (piso) {
      res.status(200).json(piso);
    } else {
      res.status(404).json({ message: 'Piso no encontrado en registro' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createSala = async (req, res) => {
  try {
    const { id_piso, nombre_sala } = req.body;
    const sala = await productService.createSala(id_piso, nombre_sala);
    res.status(201).json(sala);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSalaById = async (req, res) => {
  try {
    const sala = await productService.getSalaById(req.params.id);
    if (sala) {
      res.status(200).json(sala);
    } else {
      res.status(404).json({ message: 'Sala no encontrada en registro' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




