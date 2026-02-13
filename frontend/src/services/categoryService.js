import api from './api';

export const categoryService = {
    async getCategories() {
        const response = await api.get('/categories');
        return response.data;
    },

    async createCategory(name) {
        const response = await api.post('/categories', { name });
        return response.data;
    },

    async deleteCategory(id) {
        await api.delete(`/categories/${id}`);
    },
};
