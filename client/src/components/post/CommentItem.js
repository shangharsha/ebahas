import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { deleteComment } from '../../actions/post';

const CommentItem = ({
	post,
	comment: { _id, text, name, user, createdAt },
	auth,
	deleteComment,
}) => (
	<div className='comment-body'>
		<h3>{name}</h3>
		<div className='meta'>{createdAt}</div>
		<p>{text}</p>
		{auth.loading || !auth.user
			? ''
			: (auth.user.isAdmin ||
					user === auth.user._id ||
					(post.user && post.user._id === auth.user._id)) && (
					<button
						onClick={e => deleteComment(post._id, _id)}
						type='button'
						className='btn btn-danger'
					>
						<i className='fas fa-times'></i>
					</button>
			  )}
	</div>
);

CommentItem.propTypes = {
	comment: PropTypes.object.isRequired,
	auth: PropTypes.object.isRequired,
	deleteComment: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
	auth: state.auth,
});

export default connect(mapStateToProps, { deleteComment })(CommentItem);
