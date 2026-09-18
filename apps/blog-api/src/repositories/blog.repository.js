import { prisma } from "./../configs/db.config.js";

export const getAllBlogs = async () => {
    return await prisma.blog.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });
};

export const getBlogById = async (id) => {
    return await prisma.blog.findUnique({
        where: {
            id: Number(id),
        },
    });
};

export const createBlog = async (data) => {
    console.log("this called with "+data)
    return await prisma.blog.create({
        data: {
            title: data.title,
            content: data.content,
            authorId: data.authorId,
        },
    });
};

export const editBlogById = async (id, data) => {
    return await prisma.blog.update({
        where: {
            id: Number(id),
        },
        data,
    });
};

export const deleteBlogById = async (id) => {
    return await prisma.blog.delete({
        where: {
            id: Number(id),
        },
    });
};