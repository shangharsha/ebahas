import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Login from './components/auth/Login';
import ForgetPassword from './components/auth/ForgetPassword';
import ResetPassword from './components/auth/ResetPassword';
import Register from './components/auth/Register';
import Posts from './components/posts/Posts';
import CatPosts from './components/category/Posts';
import Post from './components/post/Post';
import CreatePost from './components/dashboard/CreatePost';
import SearchPost from './components/search/Posts';
import Dashboard from './components/dashboard/Dashboard';
import PendingPost from './components/dashboard/PendingPost';
import DraftPost from './components/dashboard/DraftPost';
import EditPost from './components/dashboard/EditPost';
import Users from './components/dashboard/Users';
import Categories from './components/dashboard/Categories';
import ChangePassword from './components/dashboard/ChangePassword';
import AddCategory from './components/dashboard/AddCategory';
import EditProfile from './components/dashboard/EditProfile';
import EditUser from './components/dashboard/EditUser';
import Alert from './components/layout/Alert';
import Footer from './components/layout/Footer';
import PrivateRoute from './components/routing/PrivateRoute';

//Redux
import { Provider } from 'react-redux';
import store from './store';
import { loadUser } from './actions/auth';
import setAuthToken from './utils/setAuthToken';

import './App.css';

if (localStorage.token) {
	setAuthToken(localStorage.token);
}

const App = () => {
	useEffect(() => {
		store.dispatch(loadUser());
	}, []);

	return (
		<Provider store={store}>
			<Router>
				<Fragment>
					<Navbar />
					<Route exact path='/' component={Posts} />
					<section className='container'>
						<Alert />
						<Switch>
							<Route exact path='/register' component={Register} />
							<Route exact path='/login' component={Login} />
							<Route exact path='/forgetpassword' component={ForgetPassword} />
							<Route
								exact
								path='/resetpassword/:token'
								component={ResetPassword}
							/>
							<Route exact path='/posts' component={Posts} />
							<Route exact path='/post/:slug' component={Post} />
							<Route exact path='/search' component={SearchPost} />
							<Route exact path='/category/:slug' component={CatPosts} />
							<Route exact path='/login' component={Login} />
							<PrivateRoute exact path='/dashboard' component={Dashboard} />
							<PrivateRoute
								exact
								path='/posts/pending'
								component={PendingPost}
							/>
							<PrivateRoute exact path='/posts/draft' component={DraftPost} />
							<PrivateRoute exact path='/dashboard/users' component={Users} />
							<PrivateRoute
								exact
								path='/dashboard/changepassword'
								component={ChangePassword}
							/>
							<PrivateRoute exact path='/all/category' component={Categories} />
							<PrivateRoute
								exact
								path='/add/category'
								component={AddCategory}
							/>
							<PrivateRoute exact path='/posts/create' component={CreatePost} />
							<PrivateRoute
								exact
								path='/posts/edit/:slug'
								component={EditPost}
							/>
							<PrivateRoute exact path='/user/:id/edit' component={EditUser} />

							<PrivateRoute
								exact
								path='/dashboard/edit-profile'
								component={EditProfile}
							/>
						</Switch>
					</section>
					<Footer />
				</Fragment>
			</Router>
		</Provider>
	);
};

export default App;
