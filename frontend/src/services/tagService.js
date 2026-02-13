import api from './api';

export const tagService = {
    async getTags() {
        const response = await api.get('/tags');
        return response.data;
    },

    async createTags(names) {
        const response = await api.post('/tags', { names });
        return response.data;
    },

    async deleteTag(id) {
        await api.delete(`/tags/${id}`);
    },
};
