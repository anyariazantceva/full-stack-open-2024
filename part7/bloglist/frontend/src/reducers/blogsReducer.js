import blogService from "../services/blogs";

const blogsReducer = (state = [], action) => {
    switch (action.type) {
        case "INIT_BLOGS":
            return action.payload
        case "CREATE_BLOG":
            return [...state, action.payload]
        case "DELETE_BLOG":
            return state.filter((blog) => blog.id !== action.payload)
        case "UPDATE_BLOG":
            return state.map((blog) =>
                blog.id === action.payload.id ? action.payload : blog
            );
        case 'SET_BLOGS':
            return action.payload;
        default: return state
    }
}

export const initializeBlogs = () => {
    return async (dispatch) => {
        const blogs = await blogService.getAll();
        dispatch({ type: "INIT_BLOGS", payload: blogs });
    }
}

export const setBlogs = (blogs) => {
    return {
        type: 'SET_BLOGS',
        payload: blogs,
    };
};

export const createBlog = (blogData) => {
    return async (dispatch) => {
        const newBlog = await blogService.create(blogData);
        dispatch({ type: "CREATE_BLOG", payload: newBlog });
    };
};

export const deleteBlog = (id) => {
    return async (dispatch) => {
        await blogService.remove(id)
        dispatch({ type: "DELETE_BLOG", payload: id })
    }
}

export const updateBlog = (blog) => {
    return async (dispatch) => {
        const updated = await blogService.update(blog, blog.id);
        dispatch({ type: "UPDATE_BLOG", payload: updated });
    };
};

export default blogsReducer