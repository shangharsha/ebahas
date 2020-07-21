import React, { useEffect, Fragment } from 'react';
import DashNav from './DashNav';
import { getPostById, approvePost } from '../../actions/post';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';

const ViewPendingPost = ({
	getPostById,
	approvePost,
	auth: { user },
	post: { post, loading },
	match,
	history,
}) => {
	useEffect(() => {
		getPostById(match.params.id);
	}, [getPostById, match.params.id]);

	const onClick = (postId, approval) => {
		approvePost(postId, approval, history);
	};

	return (
		<div className='container-fluid'>
			<div className='row'>
				<DashNav />
				{loading || post == null ? (
					<Spinner />
				) : (
					<Fragment>
						<main
							role='main'
							className='col-md-9 ml-sm-auto col-lg-10 px-md-4 mb-3'
						>
							<h2>Pending Post</h2>
							<div>
								<h6>Post by : {post.name}</h6>
								<h5> Post Detail:</h5>
								<p> {post.detail}</p>

								{!loading && user.isAdmin === true ? (
									<div className='mb-3'>
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
										</Link>{' '}
									</div>
								) : (
									''
								)}

								<Link to='/posts/pending' className='btn btn-info text-white'>
									{' '}
									Back to Pending List{' '}
								</Link>
							</div>
						</main>
					</Fragment>
				)}
			</div>
		</div>
	);
};

ViewPendingPost.propTypes = {
	getPostById: PropTypes.func.isRequired,
	approvePost: PropTypes.func.isRequired,
	post: PropTypes.object.isRequired,
	auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
	post: state.post,
	auth: state.auth,
});

export default connect(mapStateToProps, { approvePost, getPostById })(
	withRouter(ViewPendingPost)
);
