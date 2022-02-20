const mongoose = require("mongoose");

const techSchema = new mongoose.Schema({
  name: {
    type: String,
    required: "This field is required.",
  },
  desciption: {
    type: String,
    required: "This field is required.",
  },
  email: {
    type: String,
    required: "This field is required.",
  },
  references: {
    type: Array,
    required: "This field is required.",
  },
  category: {
    type: String,
    enum: [
      "Programming Languages",
      "Web Development",
      "App Development",
      "Game Development",
      "Backend Technologies",
      "Frontend Technologies",
      "Database Design & Development",
      "Trending Technologies",
    ],
    required: "This field is required.",
  },
  image: {
    type: String,
    required: "This field is required.",
  },
});

techSchema.index({ name: "text", desciption: "text" });
// WildCard Indexing
//techSchema.index({ "$**": "text" });

module.exports = mongoose.model("Tech", techSchema);
