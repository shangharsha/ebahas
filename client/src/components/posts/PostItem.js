import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import { Link } from 'react-router-dom';

const PostItem = ({ post: { slug, title, image, updatedAt } }) => {
	return (
		<div className='col-md-4'>
			<Link
				to={`/post/${slug}`}
				className='h-entry mb-30 v-height gradient'
				style={{ backgroundImage: `url(${image})` }}
			>
				<div className='text'>
					<h2>{title}</h2>
					<span className='date'>
						<Moment format='D MMM YYYY'>{updatedAt}</Moment>
					</span>
				</div>
			</Link>
		</div>
	);
};

PostItem.propTypes = {
	post: PropTypes.object.isRequired,
};

export default PostItem;
