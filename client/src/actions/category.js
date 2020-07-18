import axios from 'axios';
import {
	GET_CATEGORIES,
	CATEGORY_ERROR,
	DELETE_CATEGORY,
	ADD_CATEGORY,
	GET_POSTS,
} from './types';
import { setAlert } from './alert';

//list of all the categories
export const getCategories = () => async dispatch => {
	try {
		const res = await axios.get('/api/categories');

		dispatch({
			type: GET_CATEGORIES,
			payload: res.data,
		});
	} catch (err) {
		dispatch({
			type: CATEGORY_ERROR,
			payload: { msg: err.response.statusText, status: err.response.status },
		});
	}
};

//add a category
export const addCategory = fd => async dispatch => {
	try {
		const config = {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		};
		console.log(fd);
		const res = await axios.post('/api/categories', fd, config);

		dispatch({
			type: ADD_CATEGORY,
			payload: res.data,
		});

		dispatch(setAlert('Category Added ', 'success'));
	} catch (err) {
		dispatch({
			type: CATEGORY_ERROR,
			payload: { msg: err.response.statusText, status: err.response.status },
		});
	}
};

//list of all the categories
export const getPostsCategory = categorySlug => async dispatch => {
	try {
		const res = await axios.get(`/api/categories/${categorySlug}`);

		dispatch({
			type: GET_POSTS,
			payload: res.data,
		});
	} catch (err) {
		dispatch({
			type: CATEGORY_ERROR,
			payload: { msg: err.response.statusText, status: err.response.status },
		});
	}
};

//delete the category
export const deleteCategory = categoryId => async dispatch => {
	if (window.confirm('Are you sure? You want to delete ?')) {
		try {
			await axios.delete(`/api/categories/${categoryId}`);

			dispatch({
				type: DELETE_CATEGORY,
				payload: categoryId,
			});

			dispatch(setAlert('Category Removed ', 'success'));
		} catch (err) {
			dispatch({
				type: CATEGORY_ERROR,
				payload: { msg: err.response.statusText, status: err.response.status },
			});
		}
	}
};
