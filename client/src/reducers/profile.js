import {
	GET_USERS,
	USER_ERROR,
	GET_PROFILE,
	PROFILE_UPDATED,
	USER_DELETED,
} from '../actions/types';

const initialState = {
	profile: null,
	profiles: [],
	loading: true,
	error: {},
};

export default function (state = initialState, action) {
	const { type, payload } = action;

	switch (type) {
		case GET_USERS:
			return {
				...state,
				profiles: payload,
				loading: false,
			};
		case GET_PROFILE:
			return {
				...state,
				profile: payload,
				loading: false,
			};
		case PROFILE_UPDATED:
			return {
				...state,
				profile: payload,
				loading: false,
			};
		case USER_DELETED:
			return {
				...state,
				profiles: state.profiles.filter(profile => profile._id !== payload),
				loading: false,
			};
		case USER_ERROR:
			return {
				...state,
				error: payload,
				loading: false,
			};
		default:
			return state;
	}
}
