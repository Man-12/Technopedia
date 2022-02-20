require("../models/database");
const Category = require("../models/Category");
const Tech = require("../models/Tech");
var bodyParser = require("body-parser");

//GET /
//Homepage

exports.homepage = async (req, res) => {
  try {
    const limitNumber = 5;
    const categories = await Category.find({}).limit(limitNumber);
    const latest = await Tech.find({}).sort({ _id: -1 }).limit(limitNumber);
    const programming_languages = await Tech.find({
      category: "Programming Languages",
    }).limit(limitNumber);
    const web_development = await Tech.find({
      category: "Web Development",
    }).limit(limitNumber);
    const app_development = await Tech.find({
      category: "App Development",
    }).limit(limitNumber);
    const game_development = await Tech.find({
      category: "Game Development",
    }).limit(limitNumber);
    const backend_technologies = await Tech.find({
      category: "Backend Technologies",
    }).limit(limitNumber);
    const frontend_technologies = await Tech.find({
      category: "Frontend Technologies",
    }).limit(limitNumber);
    const database_design_development = await Tech.find({
      category: "Database Design & Development",
    }).limit(limitNumber);
    const trending_technologies = await Tech.find({
      category: "Trending Technologies",
    }).limit(limitNumber);

    const things = {
      latest,
      programming_languages,
      web_development,
      app_development,
      game_development,
      backend_technologies,
      frontend_technologies,
      database_design_development,
      trending_technologies,
    };

    res.render("index", { title: "Technopedia - Home", categories, things });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error occured" });
  }
};

//GET /categories
//Categories

exports.exploreCategories = async (req, res) => {
  try {
    const limitNumber = 20;
    const categories = await Category.find({}).limit(limitNumber);

    res.render("categories", { title: "Technopedia - Categories", categories });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error occured" });
  }
};

//GET /categories/:id
//Categories

exports.exploreCategoriesById = async (req, res) => {
  try {
    let categoryid = req.params.id;

    const limitNumber = 20;
    const categoryById = await Tech.find({ category: categoryid }).limit(
      limitNumber
    );

    res.render("categories", {
      title: "Technopedia - Categories",
      categoryById,
    });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error occured" });
  }
};

//GET /tech/:id
//Tech

exports.exploreTech = async (req, res) => {
  try {
    let techId = req.params.id;
    const tech = await Tech.findById(techId);

    res.render("tech", { title: "Technopedia - Technologies", tech });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error occured" });
  }
};

//POST /search
//Search

exports.searchTech = async (req, res) => {
  try {
    // console.log(req.body.searchTerm);

    let searchTerm = req.body.searchTerm;
    let tech = await Tech.find({
      $text: { $search: searchTerm, $diacriticSensitive: true },
    });

    res.render("search", { title: "Technopedia - Search", tech });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error occured" });
  }
};

//GET /explore-latest
//Explore Latest

exports.exploreLatest = async (req, res) => {
  try {
    const limitNumber = 20;
    const tech = await Tech.find({}).sort({ _id: -1 }).limit(limitNumber);

    res.render("exploreLatest", { title: "Technopedia - Latest", tech });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error occured" });
  }
};

//GET /explore-Random
//Explore Random

exports.exploreRandom = async (req, res) => {
  try {
    let count = await Tech.find().countDocuments();
    let random = Math.floor(Math.random() * count);
    let tech = await Tech.findOne().skip(random).exec();

    res.render("exploreRandom", { title: "Technopedia - Random", tech });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error occured" });
  }
};

//GET /Submit-Tech
//Submit Tech

exports.submitTech = async (req, res) => {
  const infoErrorsObj = req.flash("infoErrors");
  const infoSubmitObj = req.flash("infoSubmit");
  res.render("submitTech", {
    title: "Technopedia - Submit",
    infoSubmitObj,
    infoErrorsObj,
  });
};

//POST /Submit-Tech
//Submit Tech

exports.submitTechOnPost = async (req, res) => {
  try {
    let imageUploadFile;
    let uploadPath;
    let newImageName;

    if (!req.files || Object.keys(req.files).length === 0) {
      console.log("No Files were uploaded.");
    } else {
      imageUploadFile = req.files.image;
      newImageName = Date.now() + imageUploadFile.name;

      uploadPath =
        require("path").resolve("./") + "/public/uploads/" + newImageName;

      imageUploadFile.mv(uploadPath, function (err) {
        if (err) return res.satus(500).send(err);
      });
    }

    const newTech = new Tech({
      name: req.body.name,
      desciption: req.body.desciption,
      email: req.body.email,
      references: req.body.references,
      category: req.body.category,
      image: newImageName,
    }).save();

    // await newTech.save();

    req.flash("infoSubmit", "Technology has been added.");
    res.redirect("/submit-tech");
  } catch (error) {
    console.log(error);
    req.flash("infoErrors", error);
    res.redirect("/submit-tech");
  }
};

// async function insertCategoryData() {
//   try {
//     await Category.insertMany([
//       {
//         name: "Programming Languages",
//         image: "programming.png",
//       },
//       {
//         name: "Web Development",
//         image: "web.png",
//       },
//       {
//         name: "App Development",
//         image: "app1.png",
//       },
//       {
//         name: "Game Development",
//         image: "game.jpeg",
//       },
//       {
//         name: "Backend Technologies",
//         image: "backend.jpg",
//       },
//       {
//         name: "Frontend Technologies",
//         image: "frontend.jpg",
//       },
//       {
//         name: "Database Design & Development",
//         image: "database.png",
//       },
//       {
//         name: "Trending Technologies",
//         image: "trending.jpg",
//       },
//     ]);
//   } catch (error) {
//     console.log("Error: " + error);
//   }
// }

//insertCategoryData();

// async function insertDymmyRecipeData() {
//   try {
//     await Tech.insertMany([
//       {
//         name: "Recipe Name Goes Here",
//         desciption:
//           "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
//         email: "recipeemail@raddy.co.uk",
//         references: [
//           "1 level teaspoon baking powder",
//           "1 level teaspoon cayenne pepper",
//           "1 level teaspoon hot smoked paprika",
//         ],
//         category: "American",
//         image: "southern-friend-chicken.jpg",
//       },
//       {
//         name: "Recipe Name Goes Here",
//         desciption:
//           "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
//         email: "recipeemail@raddy.co.uk",
//         references: [
//           "1 level teaspoon baking powder",
//           "1 level teaspoon cayenne pepper",
//           "1 level teaspoon hot smoked paprika",
//         ],
//         category: "American",
//         image: "southern-friend-chicken.jpg",
//       },
//       {
//         name: "Recipe Name Goes Here",
//         desciption:
//           "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
//         email: "recipeemail@raddy.co.uk",
//         references: [
//           "1 level teaspoon baking powder",
//           "1 level teaspoon cayenne pepper",
//           "1 level teaspoon hot smoked paprika",
//         ],
//         category: "Thai",
//         image: "southern-friend-chicken.jpg",
//       },
//       {
//         name: "Recipe Name Goes Here",
//         desciption:
//           "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
//         email: "recipeemail@raddy.co.uk",
//         references: [
//           "1 level teaspoon baking powder",
//           "1 level teaspoon cayenne pepper",
//           "1 level teaspoon hot smoked paprika",
//         ],
//         category: "Thai",
//         image: "southern-friend-chicken.jpg",
//       },
//       {
//         name: "Recipe Name Goes Here",
//         desciption:
//           "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
//         email: "recipeemail@raddy.co.uk",
//         references: [
//           "1 level teaspoon baking powder",
//           "1 level teaspoon cayenne pepper",
//           "1 level teaspoon hot smoked paprika",
//         ],
//         category: "Chinese",
//         image: "southern-friend-chicken.jpg",
//       },
//       {
//         name: "Recipe Name Goes Here",
//         desciption:
//           "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
//         email: "recipeemail@raddy.co.uk",
//         references: [
//           "1 level teaspoon baking powder",
//           "1 level teaspoon cayenne pepper",
//           "1 level teaspoon hot smoked paprika",
//         ],
//         category: "Chinese",
//         image: "southern-friend-chicken.jpg",
//       },
//       {
//         name: "Recipe Name Goes Here",
//         desciption:
//           "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
//         email: "recipeemail@raddy.co.uk",
//         references: [
//           "1 level teaspoon baking powder",
//           "1 level teaspoon cayenne pepper",
//           "1 level teaspoon hot smoked paprika",
//         ],
//         category: "Mexican",
//         image: "southern-friend-chicken.jpg",
//       },
//       {
//         name: "Recipe Name Goes Here",
//         desciption:
//           "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
//         email: "recipeemail@raddy.co.uk",
//         references: [
//           "1 level teaspoon baking powder",
//           "1 level teaspoon cayenne pepper",
//           "1 level teaspoon hot smoked paprika",
//         ],
//         category: "Mexican",
//         image: "southern-friend-chicken.jpg",
//       },
//       {
//         name: "Recipe Name Goes Here",
//         desciption:
//           "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
//         email: "recipeemail@raddy.co.uk",
//         references: [
//           "1 level teaspoon baking powder",
//           "1 level teaspoon cayenne pepper",
//           "1 level teaspoon hot smoked paprika",
//         ],
//         category: "Indian",
//         image: "southern-friend-chicken.jpg",
//       },
//       {
//         name: "Recipe Name Goes Here",
//         desciption:
//           "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
//         email: "recipeemail@raddy.co.uk",
//         references: [
//           "1 level teaspoon baking powder",
//           "1 level teaspoon cayenne pepper",
//           "1 level teaspoon hot smoked paprika",
//         ],
//         category: "Indian",
//         image: "southern-friend-chicken.jpg",
//       },
//       {
//         name: "Recipe Name Goes Here",
//         desciption:
//           "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
//         email: "recipeemail@raddy.co.uk",
//         references: [
//           "1 level teaspoon baking powder",
//           "1 level teaspoon cayenne pepper",
//           "1 level teaspoon hot smoked paprika",
//         ],
//         category: "Spanish",
//         image: "southern-friend-chicken.jpg",
//       },
//       {
//         name: "Recipe Name Goes Here",
//         desciption:
//           "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
//         email: "recipeemail@raddy.co.uk",
//         references: [
//           "1 level teaspoon baking powder",
//           "1 level teaspoon cayenne pepper",
//           "1 level teaspoon hot smoked paprika",
//         ],
//         category: "Spanish",
//         image: "southern-friend-chicken.jpg",
//       },
//     ]);
//   } catch (error) {
//     console.log("err", error);
//   }
// }

// insertDymmyRecipeData();
