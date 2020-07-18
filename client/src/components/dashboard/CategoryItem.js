import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { deleteCategory } from '../../actions/category';

const CategoryItem = ({
	categoryId,
	deleteCategory,
	category: { title },
	count,
}) => {
	return (
		<tr>
			<td>{count}</td>
			<td>{title}</td>
			<td>
				<Link
					onClick={() => deleteCategory(categoryId)}
					className='btn btn-danger text-white'
				>
					{' '}
					Delete{' '}
				</Link>
			</td>
		</tr>
	);
};

CategoryItem.propTypes = {
	deleteCategory: PropTypes.func.isRequired,
};

export default connect(null, { deleteCategory })(CategoryItem);
