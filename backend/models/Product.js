
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },

    description: {
      type: String,
      required: [true, "Product description is required"],
    },

    category: {
      type: String,
      required: true,
      enum: ["Men", "Women"],
    },

    subcategory: {
      type: String,
      trim: true,
      default: "",
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    discountPrice: {
      type: Number,
      default: null,
      min: 0,
    },

    images: {
      type: [String],
      default: [],
    },

    variants: [
      {
        size: {
          type: String,
          required: true,
          trim: true,
        },

        color: {
          type: String,
          required: true,
          trim: true,
        },

        colorCode: {
          type: String,
          default: "",
        },

        stock: {
          type: Number,
          default: 0,
          min: 0,
        },

        sku: {
          type: String,
          trim: true,
          default: "",
        },
      },
    ],

    isNewArrival: {
      type: Boolean,
      default: false,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
