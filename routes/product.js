const Product = require("../models/Product");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");
const router = require("express").Router();
const { isError } = require("lodash");

//CREATE

router.post("/",verifyTokenAndAdmin, async (req, res) => {
      const newProduct = new Product(req.body);
      console.log(newProduct)
      try {
        const savedProduct = await newProduct.save();
        console.log(savedProduct)
        res.status(200).json({ savedProduct });
      } catch (err) {
        res.status(400).json(err);
      }
});

//UPDATE
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  const id = req.params.id;
  if (req.file) {
    const result = await Product.findById(id);
    try {
      fs.unlinkSync("./uploads/" + result.image);
    } catch (err) {
      res.status(404).json(err);
    }
    const new_image = req.file.filename;
    const newProduct = JSON.parse(JSON.stringify(req.body));
    newProduct.image = new_image;
    try {
     const dd = await Product.findByIdAndUpdate(id, newProduct);
      res.status(200).json({ massage: "product uodate successfully" });
    } catch (err) {
      res.status(404).json({ massage: err.massage });
    }
  }else {
      const newProduct = JSON.parse(JSON.stringify(req.body));
    try {
    const ff =  await Product.findOneAndUpdate({_id: id}, newProduct);
      res.status(200).json({ massage: "product uodate successfully" });
    } catch (err) {
      res.status(404).json({ massage: err.massage });
    }
  }

});

//DELETE
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  const id = req.params.id;
  try {
    const result = await Product.findByIdAndDelete(id);
    if (result.image != "") {
        fs.unlinkSync("./uploads/" + result.image); 
    }
    res.status(200).json({ massage: "Product deleted successfully" });
  } catch (err) {
    res.status(404).json({ massage: err.massage });
  }
});

//GET PRODUCT
router.get("/find/:id", async (req, res) => {
  try {
    const product = await Product.find({ intproductId: req.params.id });
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET ALL PRODUCTS
router.get("/allproduct", async (req, res) => {
  try {
    const products = await Product.find()
    res.status(200).json({ products });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/", async (req, res) => {
  const qNew = req.query.new;
  const qCategory = req.query.category;
  try {
    let products;

    if (qNew) {
      products = await Product.find().sort({ createdAt: -1 }).limit(1);
    } else if (qCategory) {
      products = await Product.find({
        categories: {
          $in: [qCategory],
        },
      });
    } else {
      products = await Product.find();
    }
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
