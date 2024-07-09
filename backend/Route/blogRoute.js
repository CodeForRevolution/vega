const express=require("express");
const router=express.Router();
const upload=require("../utils/upload/upload")

const {create,update,deleteblog,getAll,getById, getByTitle}=require("../Controllers/blogController");
router.route("/blog/new").post(upload.single("image"), create);
router.route("/blog/getAll").get(getAll);
router.route("/blog/getById/:id").get(getById);
router.route("/blog/getByTitle/:id").get(getByTitle);
router.route("/blog/delete/:id").delete(deleteblog); 
router.route("/blog/update/:id").put(upload.single("image"),update);
module.exports=router;