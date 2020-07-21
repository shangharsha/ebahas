import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const DashNav = ({ auth: { user } }) => {
	const adminLinks = (
		<ul className='nav flex-column'>
			<li className='nav-item'>
				<Link className='nav-link' to='/all/category'>
					Categories
				</Link>
			</li>
			<li className='nav-item'>
				<Link className='nav-link' to='/dashboard/users'>
					Users
				</Link>
			</li>
		</ul>
	);

	return (
		<div className='col-md-4 col-lg-2 sidebar mb-3'>
			<nav id='sidebarMenu' className=' d-md-block bg-light'>
				<div className='sidebar-dashboard sidebar-sticky pt-3'>
					<ul className='nav flex-column'>
						<li className='nav-item'>
							<Link className='nav-link' to='/dashboard'>
								Dashboard
							</Link>
						</li>
						<li className='nav-item'>
							<Link className='nav-link' to='/posts/pending'>
								Pending Posts
							</Link>
						</li>
						<li className='nav-item'>
							<Link className='nav-link' to='/posts/draft'>
								Draft Posts
							</Link>
						</li>
						{!user ? '' : user.isAdmin ? adminLinks : ''}

						<li className='nav-item'>
							<Link className='nav-link' to='/dashboard/edit-profile'>
								Edit profile
							</Link>
						</li>
						<li className='nav-item'>
							<Link className='nav-link' to='/dashboard/changepassword'>
								Change Password
							</Link>
						</li>
					</ul>
				</div>
			</nav>
		</div>
	);
};

DashNav.propTypes = {
	auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
	auth: state.auth,
});

export default connect(mapStateToProps, {})(DashNav);
