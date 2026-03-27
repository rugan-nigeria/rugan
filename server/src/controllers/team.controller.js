const pool = require('../db/connection')

exports.getAll = async (req, res, next) => {
  try {
    res.json({ message: 'getAll team' })
  } catch (err) {
    next(err)
  }
}

exports.getOne = async (req, res, next) => {
  try {
    res.json({ message: 'getOne team', id: req.params.id })
  } catch (err) {
    next(err)
  }
}

exports.create = async (req, res, next) => {
  try {
    res.status(201).json({ message: 'created team', data: req.body })
  } catch (err) {
    next(err)
  }
}
