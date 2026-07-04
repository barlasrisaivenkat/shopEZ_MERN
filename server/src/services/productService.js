import Product from "../models/Product.js";

export const getAllProducts = async (query) => {
  const {
    keyword,
    category,
    minPrice,
    maxPrice,
    sort,
    seller,
    page = 1,
    limit = 10,
  } = query;

  const filter = {};

  if (keyword) {
    filter.title = { $regex: keyword, $options: "i" };
  }

  if (category) {
    filter.category = category;
  }

  if (minPrice || maxPrice) {
    filter.price = {};

    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  if (seller) {
    filter.seller = seller;
  }

  const sortOption =
    sort === "price_asc"
      ? { price: 1 }
      : sort === "price_desc"
      ? { price: -1 }
      : sort === "newest"
      ? { createdAt: -1 }
      : { createdAt: -1 };

  const skip = (Number(page) - 1) * Number(limit);

  const total = await Product.countDocuments(filter);

  const products = await Product.find(filter)
    .populate("category", "name")
    .sort(sortOption)
    .skip(skip)
    .limit(Number(limit));

  return {
    data: products,
    total,
    page: Number(page),
    pages: Math.ceil(total / limit),
  };
};

export const getProductById = async (id) => {
  const product = await Product.findById(id).populate("category", "name");

  if (!product) {
    throw {
      statusCode: 404,
      message: "Product not found",
    };
  }

  return product;
};

export const createProduct = async (data) => {

  // Convert image -> images
  if (data.image && !data.images) {
    data.images = [data.image];
  }

  delete data.image;

  return await Product.create(data);
};

export const updateProduct = async (id, data) => {

  // Convert image -> images
  if (data.image && !data.images) {
    data.images = [data.image];
  }

  delete data.image;

  const product = await Product.findByIdAndUpdate(
    id,
    data,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!product) {
    throw {
      statusCode: 404,
      message: "Product not found",
    };
  }

  return product;
};

export const deleteProduct = async (id) => {
  const product = await Product.findByIdAndDelete(id);

  if (!product) {
    throw {
      statusCode: 404,
      message: "Product not found",
    };
  }
};

export const getProductsByCategory = async (categoryId) => {
  return await Product.find({
    category: categoryId,
  }).populate("category", "name");
};
