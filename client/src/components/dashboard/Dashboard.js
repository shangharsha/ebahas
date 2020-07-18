import React, { Fragment, useEffect, useState } from 'react';
import DashNav from './DashNav';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import PropTypes from 'prop-types';
import {
	publishPosts,
	deletePost,
	draftPost,
	getCount,
	dashboardSearch,
} from '../../actions/post';
import { Link } from 'react-router-dom';
import Pagination from '../layout/Pagination';

const Dashboard = ({
	publishPosts,
	dashboardSearch,
	post: { posts, loading },
	deletePost,
	draftPost,
	getCount,
	count,
	auth: { user },
}) => {
	useEffect(() => {
		publishPosts();
		getCount();
	}, [publishPosts, getCount]);

	const [search, setsearch] = useState('');
	const [showPerPage] = useState(50);

	const [pagination, setPagination] = useState({
		start: 0,
		end: showPerPage,
	});

	const onPaginationChange = (start, end) => {
		setPagination({ start: start, end: end });
	};

	const onClick = e => {
		deletePost(e);
	};

	const onSubmitSearch = e => {
		e.preventDefault();
		dashboardSearch(search);
	};

	return loading ? (
		<Spinner />
	) : (
		<Fragment>
			<div className=' main-content'>
				<div className='container-fluid'>
					<div className='row'>
						<DashNav />
						<main role='main' className='col-md-9 ml-sm-auto col-lg-10 px-md-4'>
							<div className='d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom'>
								<h1 className='h2'>Dashboard</h1>
							</div>

							<div className='container'>
								<div className='card-deck mb-3 text-center'>
									{loading || !user || !user.isAdmin ? (
										''
									) : (
										<div className='card mb-4 shadow-sm'>
											<div className='card-header'>
												<h4 className='my-0 font-weight-normal'>Total</h4>
											</div>
											<div className='card-body'>
												<h1 className='card-title pricing-card-title'>
													<Link to='/dashboard/users'> {count.totaluser}</Link>{' '}
													<small className='text-muted'>Users</small>
												</h1>
											</div>
										</div>
									)}

									<div className='card mb-4 shadow-sm'>
										<div className='card-header'>
											<h4 className='my-0 font-weight-normal'>Published</h4>
										</div>
										<div className='card-body'>
											<h1 className='card-title pricing-card-title'>
												<Link to='#!'> {posts.length}</Link>{' '}
												<small className='text-muted'>Posts</small>
											</h1>
										</div>
									</div>

									<div className='card mb-4 shadow-sm'>
										<div className='card-header'>
											<h4 className='my-0 font-weight-normal'>Draft</h4>
										</div>
										<div className='card-body'>
											<h1 className='card-title pricing-card-title'>
												<Link to='/posts/draft'> {count.draft}</Link>{' '}
												<small className='text-muted'>Posts</small>
											</h1>
										</div>
									</div>

									<div className='card mb-4 shadow-sm'>
										<div className='card-header'>
											<h4 className='my-0 font-weight-normal'>Pending</h4>
										</div>
										<div className='card-body'>
											<h1 className='card-title pricing-card-title'>
												<Link to='/posts/pending'> {count.pending} </Link>{' '}
												<small className='text-muted'>Posts</small>
											</h1>
										</div>
									</div>
								</div>
							</div>

							<div className='d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3'>
								<h1 className='h2'>Published Posts</h1>

								<div className='mb-2 mb-md-0'>
									<form onSubmit={e => onSubmitSearch(e)}>
										<input
											type='text'
											className='form-input'
											placeholder='search...'
											value={search}
											onChange={e => setsearch(e.target.value)}
										/>
									</form>
								</div>
							</div>
							<div className='table-responsive'>
								<table className='table table-striped table-sm'>
									<thead>
										<tr>
											<th>Title</th>
											<th>Category</th>
											<th>Post by</th>
											<th>Actions</th>
										</tr>
									</thead>
									<tbody>
										{posts.length > 0 ? (
											posts
												.slice(pagination.start, pagination.end)
												.map(post => (
													<tr key={post._id}>
														<td>{post.title}</td>
														<td>{post.categorytitle}</td>
														<td>{post.name}</td>
														<td>
															<a
																className='btn btn-primary text-white'
																href={`posts/edit/${post.slug}`}
															>
																{' '}
																Edit{' '}
															</a>{' '}
															<Link
																onClick={() => draftPost(post._id)}
																className='btn btn-success text-white'
															>
																{' '}
																Move to Draft{' '}
															</Link>{' '}
															<Link
																className='btn btn-danger text-white'
																onClick={() => onClick(post._id)}
															>
																{' '}
																Delete{' '}
															</Link>
														</td>
													</tr>
												))
										) : (
											<h4>No posts found</h4>
										)}
									</tbody>
								</table>
							</div>
							{posts.length > 50 ? (
								<Pagination
									showPerPage={showPerPage}
									onPaginationChange={onPaginationChange}
									total={posts.length}
								/>
							) : (
								''
							)}
						</main>
					</div>
				</div>
			</div>
		</Fragment>
	);
};

Dashboard.propTypes = {
	publishPosts: PropTypes.func.isRequired,
	dashboardSearch: PropTypes.func.isRequired,
	deletePost: PropTypes.func.isRequired,
	draftPost: PropTypes.func.isRequired,
	getCount: PropTypes.func.isRequired,
	post: PropTypes.object.isRequired,
	count: PropTypes.object.isRequired,
	auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
	post: state.post,
	count: state.count,
	auth: state.auth,
});

export default connect(mapStateToProps, {
	publishPosts,
	dashboardSearch,
	deletePost,
	draftPost,
	getCount,
})(Dashboard);
