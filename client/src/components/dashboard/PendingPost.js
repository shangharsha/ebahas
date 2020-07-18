import React, { useEffect, Fragment, useState } from 'react';
import DashNav from './DashNav';
import { pendingPosts, approvePost } from '../../actions/post';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import PropTypes from 'prop-types';
import Pagination from '../layout/Pagination';
import { Link } from 'react-router-dom';

const PendingPost = ({
	pendingPosts,
	approvePost,
	auth: { user },
	post: { posts, loading },
}) => {
	useEffect(() => {
		pendingPosts();
	}, [pendingPosts]);

	const [showPerPage] = useState(50);

	const [pagination, setPagination] = useState({
		start: 0,
		end: showPerPage,
	});

	const onPaginationChange = (start, end) => {
		setPagination({ start: start, end: end });
	};

	const onClick = (postId, approval) => {
		approvePost(postId, approval);
	};

	return (
		<div className='container-fluid'>
			<div className='row'>
				<DashNav />
				{loading ? (
					<Spinner />
				) : (
					<Fragment>
						<main role='main' className='col-md-9 ml-sm-auto col-lg-10 px-md-4'>
							<h2>Pending Posts</h2>
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

														{!loading && user.isAdmin === true ? (
															<td>
																<Link
																	onClick={() => onClick(post._id, true)}
																	className='btn btn-primary text-white'
																>
																	{' '}
																	Approve{' '}
																</Link>{' '}
																<Link
																	onClick={() => onClick(post._id, false)}
																	className='btn btn-danger text-white'
																>
																	{' '}
																	Reject{' '}
																</Link>
															</td>
														) : (
															<td></td>
														)}
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
					</Fragment>
				)}
			</div>
		</div>
	);
};

PendingPost.propTypes = {
	pendingPosts: PropTypes.func.isRequired,
	approvePost: PropTypes.func.isRequired,
	post: PropTypes.object.isRequired,
	auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
	post: state.post,
	auth: state.auth,
});

export default connect(mapStateToProps, { pendingPosts, approvePost })(
	PendingPost
);
