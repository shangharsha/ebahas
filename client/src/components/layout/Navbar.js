import React, { useEffect, Fragment, useState } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { getCategories } from '../../actions/category';
import { searchPost } from '../../actions/post';
import { logout } from '../../actions/auth';

const Navbar = ({
	searchPost,
	getCategories,
	auth: { isAuthenticated, user },
	logout,
	history,
	category: { categories, loading },
	click,
}) => {
	useEffect(() => {
		getCategories();
	}, [getCategories]);

	const [query, setquery] = useState('');

	const onSubmit = e => {
		e.preventDefault();
		searchPost(query, history);
	};

	const adminLinks = (
		<Link className='btn btn-sm btn-outline-secondary' to='/add/category'>
			Add Category
		</Link>
	);

	const authLinks = (
		<div className='row d-flex flex-column flex-md-row align-items-center'>
			<div className='col-4 pt-1'>
				<button
					type='button'
					onClick={click}
					className='btn btn-sm btn-outline-secondary'
				>
					<i className='fas fa-bars'></i>
				</button>{' '}
				<Link className='btn btn-sm btn-outline-secondary' to='/posts/create'>
					Create Post
				</Link>
				{!user ? '' : user.isAdmin ? adminLinks : ''}
			</div>
			<div className='col-4 text-center'>
				<Link className='blog-header-logo text-dark' to='/'>
					Ebahas
				</Link>
			</div>
			<div className='text-center mr-4'>
				<form className='form-inline' onSubmit={e => onSubmit(e)}>
					<input
						type='text'
						placeholder='Search...'
						name='query'
						value={query}
						onChange={e => setquery(e.target.value)}
						aria-label='Search'
					/>
				</form>
			</div>
			<Link className='btn btn-sm btn-outline-secondary' to='/dashboard'>
				Dashboard
			</Link>
			{'   '}
			<Link className='btn btn-sm btn-outline-secondary' onClick={logout}>
				Logout
			</Link>
		</div>
	);

	const guestLinks = (
		<div className='row d-flex flex-column flex-md-row justify-content-between align-items-center'>
			<div className='col-4 pt-1'>
				<button
					type='button'
					onClick={click}
					className='btn btn-sm btn-outline-secondary'
				>
					<i className='fas fa-bars'></i>
				</button>{' '}
				<Link className='btn btn-sm btn-outline-secondary' to='/login'>
					Login
				</Link>
			</div>
			<div className='col-4 text-center'>
				<Link className='blog-header-logo text-dark' to='/'>
					Ebahas
				</Link>
			</div>
			<div className='text-center mr-4'>
				<form className='form-inline' onSubmit={e => onSubmit(e)}>
					<div className='input-group'>
						<input
							type='text'
							placeholder='Search...'
							name='query'
							value={query}
							onChange={e => setquery(e.target.value)}
							aria-label='Search'
						/>
						<div className='input-group-append'>
							<button className='btn btn-sm btn-outline-secondary'>
								<i className='fas fa-search'></i>
							</button>
						</div>
					</div>
				</form>
			</div>
			<Link className='btn btn-sm btn-outline-secondary' to='/register'>
				Sign up
			</Link>
		</div>
	);

	return (
		<div className='container bg-light mb-3'>
			<header className='blog-header py-3'>
				{!loading && (
					<Fragment>{isAuthenticated ? authLinks : guestLinks}</Fragment>
				)}
			</header>

			{/* <div className='nav-scroller py-1 mb-2'>
				<nav className='nav d-flex justify-content-between collapse'>
					{categories.length > 0 ? (
						categories.slice(0, 12).map(category => (
							<a
								className='p-2 text-muted'
								href={`../../category/${category.slug}`}
								key={category._id}
							>
								{category.title}
							</a>
						))
					) : (
						<h4>categories not found</h4>
					)}
				</nav>
			</div> */}
		</div>
	);
};

Navbar.propTypes = {
	getCategories: PropTypes.func.isRequired,
	searchPost: PropTypes.func.isRequired,
	category: PropTypes.object.isRequired,
	logout: PropTypes.func.isRequired,
	click: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
	auth: state.auth,
	category: state.category,
});

export default connect(mapStateToProps, {
	logout,
	getCategories,
	searchPost,
})(withRouter(Navbar));
