import { Router } from "express";

import {
    getALlBlogs,
    getBlogById,
    createBlog,
    editBlogById,
    deteleBlogById,
} from "../controllers/blog.controller.js";

const router = Router();

router.get("/", getALlBlogs);

router.get("/:id", getBlogById);

router.post("/", createBlog);

router.put("/:id", editBlogById);

router.delete("/:id", deteleBlogById);

export default router;