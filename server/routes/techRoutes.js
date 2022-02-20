const express = require("express");
const router = express.Router();
const techController = require("../controllers/techController");

//App Routes

router.get("/", techController.homepage);
router.get("/tech/:id", techController.exploreTech);
router.get("/categories", techController.exploreCategories);
router.get("/categories/:id", techController.exploreCategoriesById);
router.post("/search", techController.searchTech);
router.get("/explore-latest", techController.exploreLatest);
router.get("/explore-random", techController.exploreRandom);
router.get("/submit-tech", techController.submitTech);
router.post("/submit-tech", techController.submitTechOnPost);

module.exports = router;
