
const Blog = require("../model/blog");
const _ = require("lodash");
const {
  uploadFromBuffer,
  deleteFile,
} = require("../utils/coudinary/coudinary");


module.exports.create = async (req, res, next) => {
  console.log("you hit the create pateint route", req.body);
  try {
    const { heading, subHeading, content,keywords,title } = req.body;

    let data = { heading, subHeading, content ,keywords,title};
    if (req.file) {
      data.imageUrl = await uploadFromBuffer(req.file.buffer);
    }
    const blog = await Blog.create(data);
   return res.status(201).json({
      data: blog,
      message: "Blog Created",
      success: true,
    });
  } catch (error) {
    console.log("error is cought", error);
    res.status(400).json({
      success: false,
      message: "Patient not created",
      error: error,
    });
  }
};

module.exports.getAll = async (req, res, next) => {
  const {
    page = 1,
    pageSize = 999,
    filterField = null,
    search = null,
    fromDate = null,
    toDate = null,
    column = "createdAt",
    direction = -1,
  } = req.query;

  const skip = Math.max(0, parseInt(page, 10) - 1) * parseInt(pageSize, 10);
  console.log("shakir", req.query);
 console.log("you hit the getAll");
  const  blog= await Blog.aggregate([
    {
      $match: {
        $or: [
          { heading: { $regex: search || "", $options: "i" } }, // Case-insensitive search by name
          { subheading: { $regex: search || "", $options: "i" } }, // Case-insensitive search by phone
        ],
      },
    },
    
    {
      $sort: {
        [column]: Number(direction),
      },
    },
    {
      $facet: {
        metadata: [{ $count: "total" }],
        data: [
          { $skip: skip },
          { $limit: parseInt(pageSize, 10) },
          {
            $sort: {
              [column]: Number(direction),
            },
          },
        ],
      },
    },
  ]);

  console.log("your data",blog[0].metadata);

  let count = blog[0]?.metadata[0]?.total ?? 0;
  let data = blog[0].data;
  console.log("hit the get patient route got the data");
  res.status(200).json({
    data,
    count,
  });
};




module.exports.getById = async (req, res, next) => {
  console.log("you hit the get pateint route");
  try {
    const existing = await Blog.findOne({ _id: req.params.id });

    if (!existing) {
   return   res.status(404).json({
        message: "Blog not found",
        success: false,
      });
    }

    res.status(200).json({
      success: true,
      data: existing,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "cant fetch  blog now",
      error,
    });
  }
};


module.exports.getByTitle = async (req, res, next) => {
  console.log("you hit the get pateint route");
  try {
    const existing = await Blog.findOne({ title:req.params.id});
    if (!existing) {
   return   res.status(404).json({
        message: "Blog not found",
        success: false,
      });
    }
    res.status(200).json({
      success: true,
      data: existing,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "cant fetch  blog now",
      error,
    });
  }
};



module.exports.deleteblog = async (req, res, next) => {
  console.log("you hit the get pateint route");
  try {
    const blog = await Blog.deleteOne({ _id: req.params.id });
    res.status(200).json({
      message: "blog deleted",
      success: true,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "cant fetch  blog now",
      error,
    });
  }
};

module.exports.update = async (req, res, next) => {
  console.log("you hit the update pateint route", req.body);

  try {

const existing=await Blog.findOne({_id:req.params.id})

   

    if (!existing) {
    return  res.status(403).json({
        message: "unProcessable entity",
        success: false,
        data: null,
      });
    }

    if (req.file) {
      console.log("user updating the image");
     existing.imageUrl? await deleteFile(existing.imageUrl):null;
      req.body.imageUrl = await uploadFromBuffer(req.file.buffer);
    }
    let blog = await Blog.findOneAndUpdate({ _id: req.params.id }, req.body, {
      new: true,
    });
   
    res.status(200).json({
      message: "Blog updated",
      success: true,
      data: blog,
    });
  } catch (error) {
    console.log("error", error);
    res.status(400).json({
      success: false,
      message: "cant update Blog right now",
      error,
    });
  }
};
