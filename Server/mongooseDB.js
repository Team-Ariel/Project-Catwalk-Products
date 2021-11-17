const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/SDC')


const FeatureSchema = new mongoose.Schema({
  value: String,
  feature: String
})
const ProductSchema = new mongoose.Schema({
  id: Number,
  name: String,
  description: String,
  category: String,
  default_price: String,
  features: {
    type: [FeatureSchema],
    default: undefined
  },
  related: [Number],
  results: [StyleSchema]
})

const PhotoSchema = new mongoose.Schema({
  thumbnail_url: String,
  url: String
})

const SkuSchema = new mongoose.Schema({
  any: {
    quantity: Number,
    size: String
  }
})

const StyleSchema = new mongoose.Schema({
  style_id: Number,
  name: String,
  original_price: String,
  sale_price: String,
  default?: Boolean,
  photos: [PhotoSchema],
  skus: [SkuSchema]

})




