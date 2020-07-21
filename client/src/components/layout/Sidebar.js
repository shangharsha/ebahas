import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const Sidebar = ({ sidebar, closes, category: { categories } }) => {
	const [sidebarClass, setsidebarClass] = useState(sidebar);

	const closeHandler = e => {
		e.preventDefault();
		setsidebarClass('category-sidebar close');
		setTimeout(() => {
			closes();
		}, 1000);
	};
	return (
		<div className={sidebarClass}>
			<div className='d-flex justify-content-end'>
				<a onClick={closeHandler}>
					<i class='far fa-times-circle'></i>
				</a>
			</div>
			<div className='container'>
				<h2 className='mb-3'>Categories</h2>
				<div className='row'>
					{categories.length > 0
						? categories.map(c => (
								<div className='col-lg-6 mb-4'>
									<a href={`/category/${c.slug}`}>{c.title}</a>
								</div>
						  ))
						: 'Categories not found'}
				</div>
			</div>
		</div>
	);
};

Sidebar.propTypes = {
	category: PropTypes.object.isRequired,
	sidebar: PropTypes.string.isRequired,
	closes: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
	category: state.category,
});

export default connect(mapStateToProps, {})(Sidebar);
