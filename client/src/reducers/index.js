import { combineReducers } from 'redux';
import alert from './alert';
import auth from './auth';
import post from './post';
import category from './category';
import profile from './profile';
import count from './count';

export default combineReducers({
	alert,
	auth,
	post,
	category,
	profile,
	count,
});
