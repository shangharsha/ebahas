import {
	GET_POSTS,
	POST_ERROR,
	GET_POST,
	POST_UPDATED,
	UPDATE_LIKES,
	UPDATE_DISLIKES,
	ADD_COMMENT,
	REMOVE_COMMENT,
	POST_EDITED,
} from '../actions/types';

const initialState = {
	post: null,
	posts: [],
	loading: true,
	error: {},
};

export default function (state = initialState, action) {
	const { type, payload } = action;
	switch (type) {
		case GET_POST:
			return {
				...state,
				post: payload,
				loading: false,
			};
		case POST_UPDATED:
			return {
				...state,
				posts: state.posts.filter(post => post._id !== payload),
				loading: false,
			};
		case POST_EDITED:
			return {
				...state,
				post: payload,
				loading: false,
			};
		case GET_POSTS:
			return {
				...state,
				posts: payload,
				loading: false,
			};
		case UPDATE_LIKES:
			return {
				...state,
				post: { ...state.post, likes: payload.likes, unlikes: payload.unlikes },
				loading: false,
			};
		case UPDATE_DISLIKES:
			return {
				...state,
				post: { ...state.post, unlikes: payload.unlikes, likes: payload.likes },
				loading: false,
			};
		case POST_ERROR:
			return {
				...state,
				error: payload,
				loading: false,
			};
		case ADD_COMMENT:
			return {
				...state,
				post: { ...state.post, comments: payload },
				loading: false,
			};
		case REMOVE_COMMENT:
			return {
				...state,
				post: {
					...state.post,
					comments: state.post.comments.filter(
						comment => comment._id !== payload
					),
				},
				loading: false,
			};
		default:
			return state;
	}
}
