import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addLike, addDislike } from '../../actions/post';

const LikeandDislikes = ({
	postId,
	postLikes,
	postDislikes,
	auth: { isAuthenticated },
	addLike,
	addDislike,
}) => {
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
		<div className='row flex-nowrap justify-content-between align-items-center'>
			<div className='col-4 pt-1'>
				<button onClick={e => onClicklike(postId)} className='btn btn-primary'>
					Like {postLikes.length > 0 && <span> {postLikes.length}</span>}
				</button>
			</div>

			<div className='col-4 d-flex justify-content-end align-items-center'>
				<button
					onClick={e => onClickDislike(postId)}
					className='btn btn-primary'
				>
					Dislike{' '}
					{postDislikes.length > 0 && <span>{postDislikes.length}</span>}{' '}
				</button>
			</div>
		</div>
	);
};

LikeandDislikes.propTypes = {
	postId: PropTypes.number.isRequired,
	auth: PropTypes.object.isRequired,
	addLike: PropTypes.func.isRequired,
	addDislike: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
	auth: state.auth,
});

export default connect(mapStateToProps, { addLike, addDislike })(
	LikeandDislikes
);
