import axios from "axios"

const baseUrl = 'http://localhost:3001/api/comments'

const getAll = async () => {
    const response = await axios.get(baseUrl)
    return response.data
}

const addComment = async (id, content) => {
    console.log(id)
    const response = await axios.post(`/api/comments/${id}`, { content: content });
    return response.data;
};

export default { getAll, addComment }