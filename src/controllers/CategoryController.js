import { useState, useCallback } from 'react';
import { CategoryService } from '../services/categoryService.js';
import { Category } from '../models/Category.js';

export const useCategoryController = () => {
    const [categories, setCategories] = useState([]);
    const [currentCategory, setCurrentCategory] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [operationType, setOperationType] = useState(null);

    const handleError = useCallback((error, operation) => {
        setError({ message: error.message, operation });
        console.error(`${operation} error:`, error);
    }, []);

    const fetchCategories = useCallback(async () => {
        setOperationType('fetch');
        setLoading(true);
        setError(null);
        try {
            const data = await CategoryService.getAllCategories();
            setCategories(data.map(c => new Category(c)));
        } catch (error) {
            handleError(error, 'Fetch categories');
        } finally {
            setLoading(false);
        }
    }, [handleError]);

    const getCategoryById = useCallback(async (id) => {
        setOperationType('get');
        setLoading(true);
        setError(null);
        try {
            const data = await CategoryService.getCategoryById(id);
            const category = new Category(data);
            setCurrentCategory(category);
            return category;
        } catch (error) {
            handleError(error, 'Get category');
        } finally {
            setLoading(false);
        }
    }, [handleError]);

    const createCategory = useCallback(async (categoryData) => {
        setOperationType('create');
        setLoading(true);
        setError(null);
        try {
            const newCategory = await CategoryService.createCategory(categoryData);
            const createdCategory = new Category(newCategory);
            setCategories(prev => [...prev, createdCategory]);
            setCurrentCategory(createdCategory);
            return createdCategory;
        } catch (error) {
            handleError(error, 'Create category');
            throw error;
        } finally {
            setLoading(false);
        }
    }, [handleError]);

    const updateCategory = useCallback(async (id, categoryData) => {
        setOperationType('update');
        setLoading(true);
        setError(null);
        try {
            const updatedCategory = await CategoryService.updateCategory(id, categoryData);
            const newCategory = new Category(updatedCategory);

            setCategories(prev =>
                prev.map(cat =>
                    cat.id === id ? newCategory : cat
                )
            );

            setCurrentCategory(prev =>
                prev?.id === id ? newCategory : prev
            );

            return newCategory;
        } catch (error) {
            handleError(error, 'Update category');
            throw error;
        } finally {
            setLoading(false);
        }
    }, [handleError]);

    const deleteCategory = useCallback(async (id) => {
        setOperationType('delete');
        setLoading(true);
        setError(null);
        try {
            await CategoryService.deleteCategory(id);
            setCategories(prev => prev.filter(cat => cat.id !== id));
            setCurrentCategory(prev => prev?.id === id ? null : prev);
        } catch (error) {
            handleError(error, 'Delete category');
            throw error;
        } finally {
            setLoading(false);
        }
    }, [handleError]);

    const resetCurrentCategory = useCallback(() => {
        setCurrentCategory(null);
    }, []);

    return {
        categories,
        currentCategory,
        loading,
        error,
        operationType,
        fetchCategories,
        getCategoryById,
        createCategory,
        updateCategory,
        deleteCategory,
        setCurrentCategory,
        resetCurrentCategory,
        resetError: () => setError(null)
    };
};