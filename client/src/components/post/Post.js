import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import { getPostById, deleteComment } from '../../actions/post';
import CommentForm from './CommentForm';
import { Link } from 'react-router-dom';

const Post = ({
	getPostById,
	deleteComment,
	post: { post, loading },
	auth,
	match,
}) => {
	useEffect(() => {
		getPostById(match.params.id);
	}, [getPostById, match.params.id]);

	return loading || post === null ? (
		<Spinner />
	) : (
		<Fragment>
			<div className='container'>
				<Link to='/' className='btn btn-primary mb-3'>
					<i className='fas fa-arrow-circle-left'></i> Back to Posts
				</Link>

				<div className='row border border-info mb-3'>
					<div className='col-12 col-lg-4 text-center my-auto'>
						<img
							src={`../../${post.user.image}`}
							alt=''
							className='img-fluid rounded rounded-circle'
						/>
						<h5>{post.name}</h5>
					</div>
					<div className='col-12 col-lg-8 mb-4'>
						<h4 className='mt-2 text-center'>{post.title}</h4>
						<p className='text-black text-justify my-auto'>{post.detail}</p>
						<p>
							Posted on <Moment format='D/MMM/YYYY'>{post.createdAt}</Moment>
						</p>
					</div>
				</div>
				<div className='comments bg-info text-white font-weight-bold my-auto'>
					<h4> Comments</h4>
				</div>
				{post.comments.length > 0 ? (
					post.comments.map(comment => (
						<div className='row border border-info mb-3' key={comment._id}>
							<div className='col-12 col-lg-4 my-auto'>
								{comment.user ? (
									<img
										src={`../../${comment.user.image}`}
										alt=''
										className='img-fluid comment-user rounded-circle'
									/>
								) : (
									<img
										src={'../../default-image.png'}
										alt=''
										className='img-fluid comment-user rounded-circle'
									/>
								)}

								<h5>{comment.name}</h5>
							</div>
							<div className='col-12 col-lg-8 mb-4 my-auto'>
								<p className='text-black '>{comment.text}</p>
								<p>
									Posted on{' '}
									<Moment format='D/MMM/YYYY'>{comment.createdAt}</Moment>{' '}
									{!auth.user
										? ''
										: (auth.user.isAdmin ||
												auth.user._id === comment.user._id ||
												auth.user._id === post.user._id) && (
												<button
													onClick={e => deleteComment(post._id, comment._id)}
													class='btn btn-danger'
												>
													<i className='fas fa-times'></i>
												</button>
										  )}
								</p>
							</div>
						</div>
					))
				) : (
					<h5 className='mb-3'>No comments </h5>
				)}

				{auth.isAuthenticated ? (
					<CommentForm postId={post._id} />
				) : (
					<div className='container bg-info  mb-3'>
						<div className='comments text-white font-weight-bold my-auto'>
							<h4> You must login to comment</h4>
						</div>
					</div>
				)}
			</div>
		</Fragment>
	);
};

Post.propTypes = {
	post: PropTypes.object.isRequired,
	auth: PropTypes.object.isRequired,
	getPostById: PropTypes.func.isRequired,
	deleteComment: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
	auth: state.auth,
	post: state.post,
});

export default connect(mapStateToProps, { getPostById, deleteComment })(Post);
