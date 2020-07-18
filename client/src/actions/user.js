import axios from 'axios';
import {
	GET_USERS,
	USER_ERROR,
	GET_PROFILE,
	PROFILE_UPDATED,
	CLEAR_PROFILE,
	USER_LOADED,
	USER_DELETED,
} from './types';
import { setAlert } from './alert';

//get users list
export const getUsers = () => async dispatch => {
	try {
		const res = await axios.get('/api/users');

		dispatch({
			type: GET_USERS,
			payload: res.data,
		});
	} catch (err) {
		dispatch({
			type: USER_ERROR,
			payload: { msg: err.response.statusText, status: err.response.status },
		});
	}
};

//change password of user
export const changePassword = formData => async dispatch => {
	console.log(formData);
	try {
		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};

		await axios.post('../api/users/changepassword', formData, config);

		dispatch(setAlert('Password Successfully changed', 'success'));

		dispatch({
			type: PROFILE_UPDATED,
		});
	} catch (err) {
		const errors = err.response.data.errors;

		if (errors) {
			errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
		}
		dispatch({
			type: USER_ERROR,
		});
	}
};

//Forget password
export const forgetPassword = email => async dispatch => {
	try {
		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};

		const body = JSON.stringify({ email });

		const res = await axios.post('../api/users/forgetpassword', body, config);

		if (res.data.success) {
			dispatch(setAlert(res.data.success, 'success'));
		} else {
			dispatch(setAlert(res.data.danger, 'danger'));
		}
	} catch (err) {
		const errors = err.response.data.errors;

		if (errors) {
			errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
		}
		dispatch({
			type: USER_ERROR,
		});
	}
};

//Reset password
export const resetPassword = (newpassword, token) => async dispatch => {
	try {
		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};

		const body = JSON.stringify({ newpassword });

		const res = await axios.post(
			`/api/users/resetpassword/${token}`,
			body,
			config
		);

		console.log(res.data);

		if (res.data.success) {
			dispatch(setAlert(res.data.success, 'success'));
		} else {
			dispatch(setAlert(res.data, 'danger'));
		}
	} catch (err) {
		const errors = err.response.data.errors;
		console.log(errors);

		if (errors) {
			errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
		} else {
			dispatch(setAlert(err.response.data.msg, 'danger'));
		}

		dispatch({
			type: USER_ERROR,
		});
	}
};

//get profile by id
export const getProfile = userId => async dispatch => {
	try {
		const res = await axios.get(`/api/users/${userId}`);

		dispatch({
			type: GET_PROFILE,
			payload: res.data,
		});
	} catch (err) {
		dispatch({
			type: USER_ERROR,
			payload: { msg: err.response.statusText, status: err.response.status },
		});
	}
};

//update own profile
export const updateProfile = (userId, fd) => async dispatch => {
	try {
		const config = {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		};

		const res = await axios.put(`/api/users/${userId}`, fd, config);

		dispatch({
			type: USER_LOADED,
			payload: res.data,
		});

		dispatch(setAlert('Profile Updated', 'success'));
	} catch (err) {
		dispatch({
			type: USER_ERROR,
			payload: { msg: err.response.statusText, status: err.response.status },
		});
	}
};

//update user profile
export const updateUserProfile = (userId, fd) => async dispatch => {
	console.log(fd);
	try {
		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};

		const res = await axios.put(`/api/users/${userId}`, fd, config);

		dispatch({
			type: PROFILE_UPDATED,
			payload: res.data,
		});

		dispatch(setAlert('Profile Updated', 'success'));
	} catch (err) {
		dispatch({
			type: USER_ERROR,
			payload: { msg: err.response.statusText, status: err.response.status },
		});
	}
};

//delete user by id
export const deleteUser = userId => async dispatch => {
	if (window.confirm('Are you sure? You want to delete ?')) {
		try {
			await axios.delete(`/api/users/${userId}`);

			dispatch({
				type: USER_DELETED,
				payload: userId,
			});

			dispatch(setAlert('User Deleted', 'success'));
		} catch (err) {
			dispatch({
				type: USER_ERROR,
				payload: { msg: err.response.statusText, status: err.response.status },
			});
		}
	}
};

// Dashboard Search User
export const dashboardSearch = query => async dispatch => {
	try {
		const res = await axios.get(`/api/users/search/${query}`);
		dispatch({
			type: GET_USERS,
			payload: res.data,
		});
	} catch (err) {
		dispatch({
			type: USER_ERROR,
			payload: { msg: err.response.statusText, status: err.response.status },
		});
	}
};

//clear profile
export const clearProfile = () => dispatch => {
	console.log('clear profile');
	dispatch({
		type: CLEAR_PROFILE,
	});
};
