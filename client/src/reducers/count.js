import { GET_COUNT, COUNT_ERROR } from '../actions/types';

const initialState = {
	draft: null,
	pending: null,
	totaluser: null,
	loading: true,
	error: {},
};

export default function (state = initialState, action) {
	const { type, payload } = action;
	switch (type) {
		case GET_COUNT:
			return {
				...state,
				draft: payload.DraftPost,
				pending: payload.PendingPost,
				totaluser: payload.TotalUser,
				loading: false,
			};
		case COUNT_ERROR:
			return {
				...state,
				error: payload,
				loading: false,
			};
		default:
			return state;
	}
}
