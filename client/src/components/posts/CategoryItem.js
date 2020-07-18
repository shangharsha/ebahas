import React from 'react';
import PropTypes from 'prop-types';

const CategoryItem = ({ category: { title, image, slug } }) => {
	return (
		<div className='col-md-4'>
			<a
				href={`/category/${slug}`}
				className='h-entry mb-30 v-height'
				style={{ backgroundImage: `url(../../${image})` }}
			>
				<div className='text'>
					<span className='post-category text-white bg-success mb-3'>
						<h2>{title}</h2>
					</span>
				</div>
			</a>
		</div>
	);
};

CategoryItem.propTypes = {
	category: PropTypes.object.isRequired,
};

export default CategoryItem;
