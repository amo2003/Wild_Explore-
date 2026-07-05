import mongoose from 'mongoose'

const animalSchema = new mongoose.Schema(
  {
    name:               { type: String, required: true, trim: true },
    scientificName:     { type: String, required: true, trim: true },
    category:           { type: String, required: true },
    conservationStatus: { type: String, default: '' },
    origin: { type: String, enum: ['endemic', 'native', 'exotic', ''], default: '' },

    // Taxonomy
    className:  { type: String, default: '' },
    order:      { type: String, default: '' },
    suborder:   { type: String, default: '' },
    family:     { type: String, default: '' },
    subfamily:  { type: String, default: '' },

    // Physical — split by sex
    maleWeight:   { type: String, default: '' },
    femaleWeight: { type: String, default: '' },
    maleHeight:   { type: String, default: '' },
    femaleHeight: { type: String, default: '' },
    // legacy average fields (populated automatically)
    averageWeight: { type: String, default: '' },
    averageHeight: { type: String, default: '' },

    birthArea: { type: String, required: true },
    food:      { type: String, required: true },
    description:   { type: String, default: '' },
    descriptionSi: { type: String, default: '' },
    descriptionTa: { type: String, default: '' },

    // Images
    images: [{ type: String }],
    image:  { type: String, default: '' },  // main image (first of images)

    // Map coordinates
    lng: { type: Number, default: null },
    lat: { type: Number, default: null },
  },
  { timestamps: true }
)

export default mongoose.model('Animal', animalSchema)
