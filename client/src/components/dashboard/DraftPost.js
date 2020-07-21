import React, { useEffect, Fragment, useState } from 'react';
import DashNav from './DashNav';
import { draftPosts, deletePost, approvalPost } from '../../actions/post';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Pagination from '../layout/Pagination';

const DraftPost = ({
	draftPosts,
	post: { posts, loading },
	deletePost,
	approvalPost,
}) => {
	useEffect(() => {
		draftPosts();
	}, [draftPosts]);

	const [showPerPage] = useState(50);

	const [pagination, setPagination] = useState({
		start: 0,
		end: showPerPage,
	});

	const onPaginationChange = (start, end) => {
		setPagination({ start: start, end: end });
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
							<h2>Draft Posts</h2>
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
														<td>{post.detail.slice(0, 25)}</td>
														<td>{post.categorytitle}</td>
														<td>{post.name}</td>
														<td>
															<Link
																className='btn btn-primary text-white'
																to={`edit/${post._id}`}
															>
																{' '}
																Edit{' '}
															</Link>{' '}
															<Link
																onClick={() => approvalPost(post._id, true)}
																className='btn btn-success text-white'
															>
																{' '}
																Re-Approval{' '}
															</Link>{' '}
															<a
																className='btn btn-danger text-white'
																onClick={() => deletePost(post._id)}
																href='/posts/draft'
															>
																{' '}
																Delete{' '}
															</a>
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
					</Fragment>
				)}
			</div>
		</div>
	);
};

DraftPost.propTypes = {
	draftPosts: PropTypes.func.isRequired,
	approvalPost: PropTypes.func.isRequired,
	deletePost: PropTypes.func.isRequired,
	post: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
	post: state.post,
});

export default connect(mapStateToProps, {
	draftPosts,
	deletePost,
	approvalPost,
})(DraftPost);
