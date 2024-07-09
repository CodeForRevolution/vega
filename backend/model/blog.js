const mongoose = require("mongoose");
const blogSchema = mongoose.Schema(
  {
    heading: {
      type: String,
    },
    title:{
      type:String,
      unique: true,
    },
    keywords:{

    },
    subHeading: {
      type: String,
    },

    imageUrl:{
      type:String
    },
    content: {
      type: String,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Blog1", blogSchema);
