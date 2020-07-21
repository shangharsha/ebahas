import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import { Link } from 'react-router-dom';
import { addLike, addDislike } from '../../actions/post';
import { connect } from 'react-redux';

const ListItem = ({ post, addLike, addDislike, auth: { isAuthenticated } }) => {
	const onClicklike = e => {
		{
			isAuthenticated ? addLike(e) : window.alert('You must login');
		}
	};

	const onClickDislike = e => {
		{
			isAuthenticated ? addDislike(e) : window.alert('You must login');
		}
	};

	return (
		<div className='entry2'>
			<div className='excerpt'>
				<div className='post-meta align-items-center text-left'>
					<figure className='author-figure mr-3 float-left'>
						{post.user ? (
							<img
								src={`../../${post.user.image}`}
								alt=''
								className='img-fluid'
							/>
						) : (
							<img
								src={`../../images/users/default-image.png`}
								alt=''
								className='img-fluid'
							/>
						)}
					</figure>
					<h6>
						<Link to={`/post/${post._id}`}>{post.name}</Link>
					</h6>
				</div>
				<div className='text-left'>
					<span className='post-category text-white bg-secondary mb-2'>
						{post.categorytitle}
					</span>
					<span>
						&nbsp;-&nbsp; <Moment format='D MMM YYYY'>{post.createdAt}</Moment>
					</span>
				</div>
				<p>
					{post.detail.slice(0, 100)}
					<Link to={`/post/${post._id}`}> Read More</Link>
				</p>
				<div className='text-center'>
					<button
						onClick={e => onClicklike(post._id)}
						type='button'
						className='btn btn-light'
					>
						<i class='fas fa-thumbs-up'></i> <span>{post.likes.length}</span>
					</button>{' '}
					<button
						onClick={e => onClickDislike(post._id)}
						type='button'
						className='btn btn-light'
					>
						<i class='fas fa-thumbs-down'></i>{' '}
						<span>{post.unlikes.length}</span>
					</button>{' '}
					<Link to={`/post/${post._id}`} className='btn btn-light'>
						<i class='fas fa-comments'></i> <span>{post.comments.length}</span>
					</Link>
				</div>
			</div>
			<hr />
		</div>
	);
};

ListItem.propTypes = {
	post: PropTypes.object.isRequired,
	addLike: PropTypes.func.isRequired,
	addDislike: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
	auth: state.auth,
});

export default connect(mapStateToProps, { addLike, addDislike })(ListItem);
