import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import ListItem from './ListItem';
import { getPosts } from '../../actions/post';
import Pagination from '../layout/Pagination';

const Posts = ({
	getPosts,
	post: { posts, loading },
	category: { categories },
}) => {
	useEffect(() => {
		getPosts();
	}, [getPosts]);

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
			{loading ? (
				<Spinner />
			) : (
				<Fragment>
					<div class='container'>
						<div class='row'>
							<div class='col-12 col-lg-4 mb-4'>
								<h4 className='text-center'>राजनैतिक बहस</h4>
								{posts.length > 0
									? posts
											.filter(post => post.categorytitle === 'राजनैतिक')
											.slice(0, 3)
											.map(p => <ListItem key={p._id} post={p} />)
									: 'No posts found'}
							</div>
							<div class='col-12 col-lg-4 mb-4'>
								<h4 className='text-center'> आर्थिक बहस</h4>
								{posts.length > 0
									? posts
											.filter(post => post.categorytitle === 'आर्थिक')
											.slice(0, 3)
											.map(p => <ListItem key={p._id} post={p} />)
									: 'No posts found'}
							</div>
							<div class='col-12 col-lg-4'>
								<h4 className='text-center'>खेलकुद बहस</h4>

								{posts.length > 0
									? posts
											.filter(post => post.categorytitle === 'खेलकुद')
											.slice(0, 3)
											.map(p => <ListItem key={p._id} post={p} />)
									: 'No posts found'}
							</div>
						</div>
					</div>
					<div className='container bg-light'>
						<h4 className='text-center'>ताजा बहस</h4>
						<div className='site-section '>
							<div className='container'>
								<div className='row'>
									{posts.length > 0 ? (
										posts.slice(pagination.start, pagination.end).map(p => (
											<div className='col-lg-6 mb-4'>
												<ListItem key={p._id} post={p} />
											</div>
										))
									) : (
										<h4>No posts found</h4>
									)}
								</div>
							</div>
						</div>
						{posts.length > 12 ? (
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
	);
};

Posts.propTypes = {
	getPosts: PropTypes.func.isRequired,
	post: PropTypes.object.isRequired,
	category: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
	post: state.post,
	category: state.category,
});

export default connect(mapStateToProps, { getPosts })(Posts);
