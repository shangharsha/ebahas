import axios from 'axios';
import {
	GET_POSTS,
	POST_ERROR,
	GET_POST,
	POST_UPDATED,
	UPDATE_DISLIKES,
	UPDATE_LIKES,
	ADD_COMMENT,
	REMOVE_COMMENT,
	POST_EDITED,
	GET_COUNT,
	COUNT_ERROR,
} from './types';
import { setAlert } from './alert';

// get all the published post
export const getPosts = () => async dispatch => {
	try {
		const res = await axios.get('/api/posts');

		dispatch({
			type: GET_POSTS,
			payload: res.data,
		});
	} catch (err) {
		dispatch({
			type: POST_ERROR,
			payload: { msg: err.response.statusText, status: err.response.status },
		});
	}
};

// get all the published post from dashboard
export const publishPosts = () => async dispatch => {
	try {
		const res = await axios.get('/api/posts/publish');

		dispatch({
			type: GET_POSTS,
			payload: res.data,
		});
	} catch (err) {
		dispatch({
			type: POST_ERROR,
			payload: { msg: err.response.statusText, status: err.response.status },
		});
	}
};

// get all the pending post
export const pendingPosts = () => async dispatch => {
	try {
		const res = await axios.get('/api/posts/pending');

		dispatch({
			type: GET_POSTS,
			payload: res.data,
		});
	} catch (err) {
		dispatch({
			type: POST_ERROR,
			payload: { msg: err.response.statusText, status: err.response.status },
		});
	}
};

// get all the draft post
export const draftPosts = () => async dispatch => {
	try {
		const res = await axios.get('/api/posts/draft');

		dispatch({
			type: GET_POSTS,
			payload: res.data,
		});
	} catch (err) {
		dispatch({
			type: POST_ERROR,
			payload: { msg: err.response.statusText, status: err.response.status },
		});
	}
};

// get post by slug
export const getPostBySlug = postSlug => async dispatch => {
	try {
		const res = await axios.get(`/api/posts/${postSlug}`);

		dispatch({
			type: GET_POST,
			payload: res.data,
		});
	} catch (err) {
		dispatch({
			type: POST_ERROR,
			payload: { msg: err.response.statusText, status: err.response.status },
		});
	}
};

// get post by category slug
export const getPostByCatSlug = categorySlug => async dispatch => {
	try {
		const res = await axios.get(`/api/categories/${categorySlug}`);

		dispatch({
			type: GET_POSTS,
			payload: res.data,
		});
	} catch (err) {
		dispatch({
			type: POST_ERROR,
			payload: { msg: err.response.statusText, status: err.response.status },
		});
	}
};

//create new post
export const createPost = (fd, history) => async dispatch => {
	const config = {
		headers: {
			'Content-Type': 'multipart/form-data',
		},
	};

	try {
		const res = await axios.post('/api/posts/', fd, config);

		dispatch(setAlert(res.data, 'success'));
		history.push('/dashboard');
	} catch (err) {
		const errors = err.response.data.errors;

		if (errors) {
			errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
		}

		dispatch({
			type: POST_ERROR,
		});
	}
};

//delete post
export const deletePost = postId => async dispatch => {
	if (window.confirm('Are you sure? You want to delete ?')) {
		try {
			await axios.delete(`../api/posts/${postId}`);

			dispatch({
				type: POST_UPDATED,
				payload: postId,
			});

			dispatch(setAlert('Post Deleted', 'success'));
		} catch (err) {
			const errors = err.response.data.errors;

			if (errors) {
				errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
			}

			dispatch({
				type: POST_ERROR,
			});
		}
	}
};

//update post by id
export const updatePost = (postId, formData) => async dispatch => {
	try {
		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};

		const res = await axios.put(`../../api/posts/${postId}`, formData, config);

		dispatch({
			type: POST_EDITED,
			payload: res.data,
		});

		dispatch(setAlert('Post Successfully Updated', 'success'));
	} catch (err) {
		const errors = err.response.data.errors;

		if (errors) {
			errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
		}

		dispatch({
			type: POST_ERROR,
		});
	}
};

//approve post by id
export const approvePost = (postId, publish) => async dispatch => {
	try {
		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};

		const body = JSON.stringify({ publish });

		await axios.put(`../api/posts/${postId}/approve`, body, config);

		dispatch({
			type: POST_UPDATED,
			payload: postId,
		});

		dispatch(setAlert('Post Successfully Updated', 'success'));
	} catch (err) {
		const errors = err.response.data.errors;

		if (errors) {
			errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
		}

		dispatch({
			type: POST_ERROR,
		});
	}
};

//reapproval post by id
export const approvalPost = (postId, approval) => async dispatch => {
	try {
		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};

		const body = JSON.stringify({ approval });

		await axios.put(`../api/posts/${postId}/approval`, body, config);

		dispatch({
			type: POST_UPDATED,
			payload: postId,
		});

		dispatch(setAlert('Post Successfully Updated', 'success'));
	} catch (err) {
		const errors = err.response.data.errors;

		if (errors) {
			errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
		}

		dispatch({
			type: POST_ERROR,
		});
	}
};

//change publish to draft post by id
export const draftPost = postId => async dispatch => {
	if (window.confirm('Are you sure? You want to send post to draft ?')) {
		try {
			await axios.put(`../api/posts/${postId}/draft`);

			dispatch({
				type: POST_UPDATED,
				payload: postId,
			});

			dispatch(setAlert('Post Successfully Updated', 'success'));
		} catch (err) {
			const errors = err.response.data.errors;

			if (errors) {
				errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
			}

			dispatch({
				type: POST_ERROR,
			});
		}
	}
};

// get post count
export const getCount = () => async dispatch => {
	try {
		const res = await axios.get(`/api/posts/count/all`);

		dispatch({
			type: GET_COUNT,
			payload: {
				DraftPost: res.data.dpost,
				PendingPost: res.data.ppost,
				TotalUser: res.data.tuser,
			},
		});
	} catch (err) {
		dispatch({
			type: COUNT_ERROR,
			payload: { msg: err.response.statusText, status: err.response.status },
		});
	}
};

//Add like
export const addLike = id => async dispatch => {
	try {
		const res = await axios.put(`/api/posts/like/${id}`);

		dispatch({
			type: UPDATE_LIKES,
			payload: { id, likes: res.data.plike, unlikes: res.data.punlike },
		});
	} catch (err) {
		dispatch({
			type: POST_ERROR,
			payload: { msg: err.response.statusText, status: err.response.status },
		});
	}
};

//Add Dislike
export const addDislike = id => async dispatch => {
	try {
		const res = await axios.put(`/api/posts/unlike/${id}`);

		dispatch({
			type: UPDATE_DISLIKES,
			payload: { id, likes: res.data.plike, unlikes: res.data.punlike },
		});
	} catch (err) {
		dispatch({
			type: POST_ERROR,
			payload: { msg: err.response.statusText, status: err.response.status },
		});
	}
};

// Add comment
export const addComment = (postId, FormData) => async dispatch => {
	const config = {
		headers: {
			'Content-Type': 'application/json',
		},
	};
	try {
		const res = await axios.post(
			`/api/posts/comment/${postId}`,
			FormData,
			config
		);

		dispatch({
			type: ADD_COMMENT,
			payload: res.data,
		});

		dispatch(setAlert('Comment Added ', 'success'));
	} catch (err) {
		dispatch({
			type: POST_ERROR,
			payload: { msg: err.response.statusText, status: err.response.status },
		});
	}
};

// Delete comment
export const deleteComment = (postId, commentId) => async dispatch => {
	try {
		await axios.delete(`/api/posts/comment/${postId}/${commentId}`);

		dispatch({
			type: REMOVE_COMMENT,
			payload: commentId,
		});

		dispatch(setAlert('Comment Removed ', 'success'));
	} catch (err) {
		dispatch({
			type: POST_ERROR,
			payload: { msg: err.response.statusText, status: err.response.status },
		});
	}
};

// Search Post
export const searchPost = (query, history) => async dispatch => {
	try {
		const res = await axios.get(`/api/posts/search/${query}`);
		history.push(`/search?query=${query}`);
		dispatch({
			type: GET_POSTS,
			payload: res.data,
		});
	} catch (err) {
		dispatch({
			type: POST_ERROR,
			payload: { msg: err.response.statusText, status: err.response.status },
		});
	}
};

// Dashboard Search Post
export const dashboardSearch = query => async dispatch => {
	try {
		const res = await axios.get(`/api/posts/search/published/${query}`);
		dispatch({
			type: GET_POSTS,
			payload: res.data,
		});
	} catch (err) {
		dispatch({
			type: POST_ERROR,
			payload: { msg: err.response.statusText, status: err.response.status },
		});
	}
};
