import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import { Link } from 'react-router-dom';

const ListItem = ({
	post: { slug, title, detail, name, image, categorytitle, updatedAt, user },
}) => {
	return (
		<div className='col-lg-4 mb-4'>
			<div className='entry2'>
				<Link to={`/post/${slug}`}>
					<img
						src={`../../${image}`}
						alt='alternative text'
						className='img-fluid rounded'
					/>
				</Link>
				<div className='excerpt'>
					<span className='post-category text-white bg-secondary mb-3'>
						{categorytitle}
					</span>

					<h2>
						<Link to={`/post/${slug}`}>{title}</Link>
					</h2>
					<div className='post-meta align-items-center text-left clearfix'>
						<figure className='author-figure mb-0 mr-3 float-left'>
							{user ? (
								<img src={`../../${user.image}`} alt='' className='img-fluid' />
							) : (
								<img
									src={`../../images/users/default-image.png`}
									alt=''
									className='img-fluid'
								/>
							)}
						</figure>
						<span className='d-inline-block mt-1'>By {name}</span>
						<span>
							&nbsp;-&nbsp; <Moment format='D MMM YYYY'>{updatedAt}</Moment>
						</span>
					</div>

					<p>{detail.slice(0, 100)}</p>
					<p>
						<Link to={`/post/${slug}`}>Read More</Link>
					</p>
				</div>
			</div>
		</div>
	);
};

ListItem.propTypes = {
	post: PropTypes.object.isRequired,
};

export default ListItem;
