import React, { Fragment } from 'react';
import DashNav from './DashNav';
import { connect } from 'react-redux';
import CategoryItem from './CategoryItem';
import Spinner from '../layout/Spinner';
import PropTypes from 'prop-types';

const Categories = ({ category: { categories, loading } }) => {
	var count = 0;
	return (
		<div className='container-fluid'>
			<div className='row'>
				<DashNav />
				{loading ? (
					<Spinner />
				) : (
					<Fragment>
						<main role='main' className='col-md-9 ml-sm-auto col-lg-10 px-md-4'>
							<h2>Categories List</h2>
							<div className='table-responsive'>
								<table className='table table-striped table-sm'>
									<thead>
										<tr>
											<th>SN</th>
											<th>Title</th>
											<th>Actions</th>
										</tr>
									</thead>
									<tbody>
										{categories.length > 0 ? (
											categories.map(category => (
												<CategoryItem
													key={category._id}
													category={category}
													categoryId={category._id}
													count={++count}
												/>
											))
										) : (
											<h4>No Categories found</h4>
										)}
									</tbody>
								</table>
							</div>
						</main>
					</Fragment>
				)}
			</div>
		</div>
	);
};

Categories.propTypes = {
	category: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
	category: state.category,
});

export default connect(mapStateToProps, {})(Categories);
