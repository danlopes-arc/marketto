const router = require('express').Router()
const passport = require('passport')
const chalk = require('chalk')
const { stringfyAndTrim, logServerError } = require('../../helpers/helpers')
const { isEmpty } = require('lodash')

const User = require('../../models/User')
const Product = require('../../models/Product')

router.get('/', async (req, res) => {
  try {
    const products = await Product.find()

    return res.json(products)

  } catch (err) {
    logServerError(err, 'create product', __filename)
    return res.sendStatus(500)
  }
})

router.post('/', async (req, res) => {
  const { price, userId } = req.body

  const title = stringfyAndTrim(req.body.title)
  const description = stringfyAndTrim(req.body.description)

  const fields = {}

  if (!title) fields.title = 'Title is empty'
  if (!description) fields.description = 'Description is empty'
  if (!price && price !== 0) fields.price = 'Price is empty'
  if (!userId) fields.user = 'User is empty'

  if (!isEmpty(fields)) {
    return res.status(400).json({ msg: 'Invalid input', fields })
  }

  try {
    const user = await User.findById(userId)
    if (!user) {
      fields.user = "User not found"
      return res.status(404).json({ msg: fields.user, fields })
    }

    const product = await new Product({
      title,
      description,
      price,
      user: userId
    }).save()

    return res.status(201).json({ id: product.id })

  } catch (err) {
    logServerError(err, 'create product', __filename)
    return res.sendStatus(500)
  }
})

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)

    if (!product) {
      return res.status(404).json({msg: 'Product not found'})
    }

    return res.json(product)
    
  } catch (err) {
    logServerError(err, 'get product', __filename)
    return res.sendStatus(500)
  }
})

router.put('/:id', async (req, res) => {
  const { price } = req.body

  const title = stringfyAndTrim(req.body.title)
  const description = stringfyAndTrim(req.body.description)

  const fields = {}

  if (!title) fields.title = 'Title is empty'
  if (!description) fields.description = 'Description is empty'
  if (!price && price !== 0) fields.price = 'Price is empty'

  if (!isEmpty(fields)) {
    return res.status(400).json({ msg: 'Invalid input', fields })
  }

  try {
    const product = await Product.findById(req.params.id)

    if (!product) {
      return res.status(404).json({msg: 'Product not found'})
    }

    Object.assign(product, {
      title,
      description,
      price
    })
    
    const updatedProduct = await product.save()

    return res.status(200).json(updatedProduct)

  } catch (err) {
    logServerError(err, 'create product', __filename)
    return res.sendStatus(500)
  }
})


router.delete('/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id)

    if (!deletedProduct) {
      return res.status(404).json({msg: 'Product not found'})
    }

    return res.sendStatus(204)
  } catch (err) {
    logServerError(err, 'create product', __filename)
    return res.sendStatus(500)
  }
})

module.exports = router