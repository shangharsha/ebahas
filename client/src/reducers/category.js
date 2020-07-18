import {
	GET_CATEGORIES,
	CATEGORY_ERROR,
	DELETE_CATEGORY,
	ADD_CATEGORY,
} from '../actions/types';

const initialState = {
	category: null,
	categories: [],
	loading: true,
	error: {},
};

export default function (state = initialState, action) {
	const { type, payload } = action;
	switch (type) {
		case GET_CATEGORIES:
			return {
				...state,
				categories: payload,
				loading: false,
			};
		case CATEGORY_ERROR:
			return {
				...state,
				error: payload,
				loading: false,
			};
		case ADD_CATEGORY:
			return {
				...state,
				categories: payload,
				loading: false,
			};
		case DELETE_CATEGORY:
			return {
				...state,
				categories: state.categories.filter(
					category => category._id !== payload
				),

				loading: false,
			};
		default:
			return state;
	}
}
