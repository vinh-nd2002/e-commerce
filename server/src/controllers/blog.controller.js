const { Blog } = require("./../models");
const asyncHandler = require("express-async-handler");
const slugifyTitle = require("./../utils/slug");

const createBlog = asyncHandler(async (req, res) => {
  const { title, description, category } = req.body;
  if (!title || !description || !category) {
    throw new Error("Missing input");
  }

  req.body.author = req.user.uid;
  req.body.slug = slugifyTitle(title);

  const newBlog = await Blog.create(req.body);

  const { createdAt, updatedAt, __v, ...response } = newBlog.toObject();
  return res.status(200).json({
    success: newBlog ? true : false,
    data: newBlog ? response : "Can't create blog",
  });
});

const getBlogById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) throw new Error("Missing input");

  const blog = await Blog.findOneAndUpdate(
    { _id: id, isDelete: false },
    {
      $inc: {
        numberViews: 1,
      },
    }
  )
    .populate("category", "title")
    .populate("author", "firstName lastName")
    .select("-createdAt -updatedAt -__v");
  return res.status(200).json({
    success: blog ? true : false,
    data: blog ? blog : "Can't found",
  });
});

const getAllBlogs = asyncHandler(async (req, res) => {
  const blogs = await Blog.find()
    .populate("category", "title")
    .populate("author", "firstName lastName")
    .select("-createdAt -updatedAt -__v");

  return res.status(200).json({
    success: blogs ? true : false,
    data: blogs ? blogs : "Can't found",
  });
});

const deleteBlogById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) throw new Error("Missing input");
  const response = await Blog.findByIdAndUpdate(
    { _id: id },
    { isDelete: true },
    { new: true }
  );
  return res.status(200).json({
    success: response ? true : false,
    mes: response ? "Blog has been deleted successfully" : "Delete Blog failed",
  });
});

const undoBlogById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) throw new Error("Missing input");
  const response = await Blog.findByIdAndUpdate(
    { _id: id },
    { isDelete: false },
    { new: true }
  );
  return res.status(200).json({
    success: response ? true : false,
    mes: blogUpdated ? "Blog undo successful" : "Undo blog failed",
  });
});

const updateBlogById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id || Object.keys(req.body).length === 0)
    throw new Error("Missing input");

  if (req.body.title) req.body.slug = slugifyTitle(req.body.title);

  const blogUpdated = await Blog.findByIdAndUpdate({ _id: id }, req.body, {
    new: true,
  }).select("-createdAt -updatedAt -__v");
  return res.status(200).json({
    success: blogUpdated ? true : false,
    mes: blogUpdated ? "Blog update successful" : "Update blog failed",
  });
});

const likeBlog = asyncHandler(async (req, res) => {
  const { uid } = req.user;
  const { bid } = req.params;
  if (!bid) throw new Error("Missing inputs");

  const blog = await Blog.findById(bid);

  var response;

  // The user liked the post
  const alreadyLiked = blog?.likes.find((ele) => ele.toString() === uid);

  if (alreadyLiked) {
    response = await Blog.findByIdAndUpdate(
      bid,
      {
        $pull: { likes: uid },
      },
      { new: true }
    );

    return res.status(200).json({
      success: response ? true : false,
      data: response ? response : "No data",
    });
  }

  // the user disliked the post
  const alreadyDisliked = blog?.dislikes.find((ele) => ele.toString() === uid);

  if (alreadyDisliked) {
    response = await Blog.findByIdAndUpdate(
      bid,
      {
        $pull: { dislikes: uid },
        $push: { likes: uid },
      },
      { new: true }
    );

    return res.status(200).json({
      success: response ? true : false,
      data: response ? response : "No data",
    });
  }

  // anything
  response = await Blog.findByIdAndUpdate(
    bid,
    {
      $push: { likes: uid },
    },
    { new: true }
  );

  return res.status(200).json({
    success: response ? true : false,
    data: response ? response : "No data",
  });
});

const dislikeBlog = asyncHandler(async (req, res) => {
  const { uid } = req.user;
  const { bid } = req.params;
  if (!bid) throw new Error("Missing inputs");

  const blog = await Blog.findOne({ _id: bid, isDelete: false });

  if (!blog) {
    return res.status(200).json({
      success: false,
      mes: "Can't found this blog",
    });
  }
  var response;

  // the user disliked the post
  const alreadyDisliked = blog?.dislikes.find((ele) => ele.toString() === uid);

  if (alreadyDisliked) {
    response = await Blog.findByIdAndUpdate(
      bid,
      {
        $pull: { dislikes: uid },
      },
      { new: true }
    );

    return res.status(200).json({
      success: response ? true : false,
      data: response ? response : "No data",
    });
  }

  // The user liked the post
  const alreadyLiked = blog?.likes.find((ele) => ele.toString() === uid);

  if (alreadyLiked) {
    response = await Blog.findByIdAndUpdate(
      bid,
      {
        $pull: { likes: uid },
        $push: { dislikes: uid },
      },
      { new: true }
    );

    return res.status(200).json({
      success: response ? true : false,
      data: response ? response : "No data",
    });
  }

  response = await Blog.findByIdAndUpdate(
    bid,
    {
      $push: { dislikes: uid },
    },
    { new: true }
  );

  return res.status(200).json({
    success: response ? true : false,
    data: response ? response : "No data",
  });
});

const uploadBlogImage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id || !req.file) throw new Error("Missing inputs");
  const response = await Blog.findByIdAndUpdate(
    id,
    {
      image: req.file.path,
    },
    {
      new: true,
    }
  );
  return res.status(200).json({
    success: response ? true : false,
    mes: response ? "Blog images update successful" : "Update image failed",
  });
});

module.exports = {
  createBlog,
  getBlogById,
  getAllBlogs,
  deleteBlogById,
  updateBlogById,
  likeBlog,
  dislikeBlog,
  uploadBlogImage,
  undoBlogById,
};
