import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import ListItem from '../posts/ListItem';
import { getPostByCatSlug } from '../../actions/post';
import Pagination from '../layout/Pagination';

const Posts = ({ getPostByCatSlug, post: { posts, loading }, match }) => {
	useEffect(() => {
		getPostByCatSlug(match.params.slug);
	}, [getPostByCatSlug, match.params.slug]);

	const [showPerPage] = useState(12);

	const [pagination, setPagination] = useState({
		start: 0,
		end: showPerPage,
	});

	const onPaginationChange = (start, end) => {
		setPagination({ start: start, end: end });
	};

	return (
		<Fragment>
			<Fragment>
				{loading ? (
					<Spinner />
				) : (
					<Fragment>
						<div className='container'>
							<div className='row align-items-stretch retro-layout-2'>
								{posts.length > 0 ? (
									posts
										.slice(pagination.start, showPerPage)
										.map(post => <ListItem key={post._id} post={post} />)
								) : (
									<h4>No posts found</h4>
								)}
							</div>
							{posts.length > 24 ? (
								<Pagination
									showPerPage={showPerPage}
									onPaginationChange={onPaginationChange}
									total={posts.length}
								/>
							) : (
								''
							)}
						</div>
					</Fragment>
				)}
			</Fragment>
		</Fragment>
	);
};

Posts.propTypes = {
	getPostByCatSlug: PropTypes.func.isRequired,
	post: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
	post: state.post,
});

export default connect(mapStateToProps, { getPostByCatSlug })(Posts);
