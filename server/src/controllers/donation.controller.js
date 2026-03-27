const pool = require('../db/connection')

exports.getAll = async (req, res, next) => {
  try {
    res.json({ message: 'getAll donation' })
  } catch (err) {
    next(err)
  }
}

exports.getOne = async (req, res, next) => {
  try {
    res.json({ message: 'getOne donation', id: req.params.id })
  } catch (err) {
    next(err)
  }
}

exports.create = async (req, res, next) => {
  try {
    res.status(201).json({ message: 'created donation', data: req.body })
  } catch (err) {
    next(err)
  }
}
