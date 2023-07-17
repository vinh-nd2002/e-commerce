const { Product, Brand, Category } = require("./../models");
const asyncHandler = require("express-async-handler");

const data = require("./../../data/data.json");
const dataCate = require("./../../data/cateBrand");
const slugifyTitle = require("./../utils/slug");

const fn3 = async (product, category) => {
  const oldProduct = await Product.findOneAndUpdate(
    { title: product?.name },
    { $push: { categories: category } }
  );
  if (oldProduct) {
    return;
  }

  var brand = await Brand.findOne({ name: product?.brand });
  if (!brand) {
    brand = await Brand.create({ name: product?.brand });
  }
  const init = {
    title: product?.name,
    slug: slugifyTitle(product?.name) + Math.round(Math.random() * 20) + "",
    description: product?.description.toString(),
    thumb: product?.thumb,
    price: Math.round(Number(product?.price.match(/\d/g).join("")) / 100),
    brand,
    categories: category,
    images: product?.images,
    quantity: Math.round(Math.random() * 1000),
    sold: Math.round(Math.random() * 100),
    color: product?.variants?.find((ele) => ele.label === "Color")?.variants[0],
    totalRatings: (Math.random() * 5).toFixed(1),
  };

  await Product.create(init);
};

const insertProduct = asyncHandler(async (req, res) => {
  const promises = [];
  for (let product of data) {
    const category = await Category.findOne({ title: product?.category[0] });
    promises.push(fn3(product, category));
  }
  await Promise.all(promises);
  return res.json("Done");
});

const fn1 = async (brand) => {
  const alreadyBrand = await Brand.findOne({ name: brand });
  if (alreadyBrand) return alreadyBrand;

  const response = await Brand.create({ name: brand });
  if (response) return response;
};

const fn2 = async (category) => {
  const res = [];
  for (let item of category.brand) res.push(await fn1(item));
  return res.map((ele) => ele._id);
};

const insertCategoryAndBrand = asyncHandler(async (req, res) => {
  for (let cate of dataCate) {
    const brands = await fn2(cate);
    const init = {
      title: cate?.cate,
      brands,
      slug: slugifyTitle(cate?.cate),
    };
    await Category.create(init);
  }
  return res.json("Done");
});

module.exports = { insertProduct, insertCategoryAndBrand };
