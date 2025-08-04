import axios from 'axios';
const baseUrl = '/api/comments';

const getAll = async () => {
    const res = await axios.get(baseUrl);
    return res.data;
};

const addComment = async (blogId, comment) => {
    const res = await axios.post(`${baseUrl}/${blogId}`, comment);
    return res.data;
};

export default { getAll, addComment };
