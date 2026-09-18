import { Router } from "express";

import {
    getALlBlogs,
    getBlogById,
    createBlog,
    editBlogById,
    deteleBlogById,
    getBlogComment,
    createBlogComment
} from "../controllers/blog.controller.js";

const router = Router();

router.get("/", getALlBlogs);

router.get("/:id", getBlogById);

router.post("/", createBlog);

router.put("/:id", editBlogById);

router.delete("/:id", deteleBlogById);

router.get("/:id/comment", getBlogComment);

router.post("/:id/comment", createBlogComment);

export default router;