import {
    getAllBlogs,
    getBlogById as findBlogById,
    createBlog as createBlogRepository,
    editBlogById as editBlogRepository,
    deleteBlogById as deleteBlogRepository,
} from "../repositories/blog.repository.js";


export const getALlBlogs = async (req, res) => {
    try {
        const blogs = await getAllBlogs();

        return res.status(200).json({
            success: true,
            data: blogs,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to get blogs",
        });
    }
};


export const getBlogById = async (req, res) => {
    try {
        const { id } = req.params;

        const blog = await findBlogById(id);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: blog,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to get blog",
        });
    }
};


export const createBlog = async (req, res) => {
    try {
        // User ID injected by API Gateway/Auth middleware
        const userId = req.headers["x-user-id"];

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User authentication required",
            });
        }

        const { title, content } = req.body;

        if (!title || !content) {
            return res.status(400).json({
                success: false,
                message: "Title and content are required",
            });
        }

        const blog = await createBlogRepository({
            title,
            content,
            authorId: userId,
        });

        return res.status(201).json({
            success: true,
            message: "Blog created successfully",
            data: blog,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to create blog",
        });
    }
};


export const editBlogById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.headers["x-user-id"];

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User authentication required",
            });
        }

        const { title, content } = req.body;

        const existingBlog = await findBlogById(id);

        if (!existingBlog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found",
            });
        }

        // Only the author can edit
        if (existingBlog.authorId !== userId) {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to edit this blog",
            });
        }

        const blog = await editBlogRepository(id, {
            title,
            content,
        });

        return res.status(200).json({
            success: true,
            message: "Blog updated successfully",
            data: blog,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to update blog",
        });
    }
};


export const deteleBlogById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.headers["x-user-id"];

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User authentication required",
            });
        }

        const existingBlog = await findBlogById(id);

        if (!existingBlog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found",
            });
        }

        // Only the author can delete
        if (existingBlog.authorId !== userId) {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to delete this blog",
            });
        }

        await deleteBlogRepository(id);

        return res.status(200).json({
            success: true,
            message: "Blog deleted successfully",
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete blog",
        });
    }
};