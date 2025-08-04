import blogService from "../services/blogs";
import commentsService from "../services/comments"
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunks
export const initializeBlogs = createAsyncThunk(
    'blogs/initializeBlogs',
    async () => {
        const blogs = await blogService.getAll();
        return blogs;
    }
);

export const createBlog = createAsyncThunk(
    'blogs/createBlog',
    async (blogData) => {
        const newBlog = await blogService.create(blogData);
        return newBlog;
    }
);
export const deleteBlog = createAsyncThunk(
    'blogs/deleteBlog',
    async (id) => {
        await blogService.remove(id);
        return id;
    }
);

export const updateBlog = createAsyncThunk(
    'blogs/updateBlog',
    async (blog) => {
        const updated = await blogService.update(blog, blog.id);
        return updated;
    }
);



export const addNewComment = createAsyncThunk(
    'blogs/addNewComment',
    async ({ blogId, content }) => {
        const savedComment = await commentsService.addComment(blogId, { content });
        return { blogId, comment: savedComment };
    }
);


const blogsSlice = createSlice({
    name: 'blogs',
    initialState: [],
    reducers: {
        setBlogs: (state, action) => {
            return action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(initializeBlogs.fulfilled, (_, action) => action.payload)
            .addCase(createBlog.fulfilled, (state, action) => {
                state.push(action.payload);
            })
            .addCase(deleteBlog.fulfilled, (state, action) => {
                return state.filter((blog) => blog.id !== action.payload);
            })
            .addCase(updateBlog.fulfilled, (state, action) => {
                return state.map((blog) =>
                    blog.id === action.payload.id ? action.payload : blog
                );
            })
            .addCase(addNewComment.fulfilled, (state, action) => {
                const { blogId, comment } = action.payload;
                return state.map(blog =>
                    blog.id === blogId
                        ? { ...blog, comments: [...(blog.comments || []), comment] }
                        : blog
                );
            })

    }
});

export const { setBlogs } = blogsSlice.actions;

export default blogsSlice.reducer;