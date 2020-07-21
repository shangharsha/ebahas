import React, { useState, useEffect, Fragment } from 'react';
import DashNav from './DashNav';
import { getPostById, updatePost } from '../../actions/post';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';

import PropTypes from 'prop-types';

const EditPost = ({
	updatePost,
	getPostById,
	post: { post, loading },
	match,
	category: { categories },
}) => {
	const [formData, setFormData] = useState({
		detail: '',
		approval: '',
		publish: '',
		category: '',
	});

	useEffect(() => {
		getPostById(match.params.id);

		setFormData({
			detail: loading || !post.detail ? '' : post.detail,
			approval: loading || !post.approval ? '' : post.approval,
			publish: loading || !post.publish ? '' : post.publish,
			category: loading || !post.categorytitle ? '' : post.categorytitle,
		});
	}, [getPostById, loading]);

	const { title, detail, category } = formData;

	const onChange = e => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const onSubmit = e => {
		e.preventDefault();
		updatePost(post._id, formData);
	};

	return (
		<div className='container-fluid'>
			<div className='row'>
				<DashNav />
				{loading ? (
					<Spinner />
				) : (
					<Fragment>
						<main role='main' className='col-md-9 ml-sm-auto col-lg-10 px-md-4'>
							<div className='row'>
								<div className='col-md-8 order-md-1'>
									<h4 className='mb-3'>Edit Post</h4>
									<form
										className='needs-validation'
										onSubmit={e => onSubmit(e)}
									>
										<label htmlFor='category'>Select a category</label>
										<div className='input-group'>
											<select
												required
												name='category'
												onChange={e => onChange(e)}
												value={category}
											>
												<option>Select Category</option>
												{categories.length > 0 ? (
													categories.map(category => (
														<option key={category._id} value={category.title}>
															{category.title}
														</option>
													))
												) : (
													<h5>"No categories"</h5>
												)}
											</select>
										</div>
										<div className='mb-3'>
											<label htmlFor='detail'>Post Detail</label>
											<div className='input-group'>
												<textarea
													className='form-control'
													name='detail'
													value={detail}
													onChange={e => onChange(e)}
													rows='10'
													placeholder='Enter post Detail'
													required
												></textarea>
											</div>
										</div>

										<hr className='mb-4' />

										<button
											className='btn btn-primary  btn-block'
											type='submit'
										>
											Update Post
										</button>
									</form>
								</div>
							</div>
						</main>
					</Fragment>
				)}
			</div>
		</div>
	);
};

EditPost.propTypes = {
	getPostById: PropTypes.func.isRequired,
	updatePost: PropTypes.func.isRequired,
	post: PropTypes.object.isRequired,
	category: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
	post: state.post,
	category: state.category,
});

export default connect(mapStateToProps, { getPostById, updatePost })(EditPost);
