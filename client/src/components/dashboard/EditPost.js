import React, { useState, useEffect, Fragment } from 'react';
import DashNav from './DashNav';
import { getPostBySlug, updatePost } from '../../actions/post';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';

import PropTypes from 'prop-types';

const EditPost = ({
	updatePost,
	getPostBySlug,
	post: { post, loading },
	match,
	category: { categories },
}) => {
	const [formData, setFormData] = useState({
		title: '',
		detail: '',
		image: '',
		approval: '',
		publish: '',
		category: '',
	});

	useEffect(() => {
		getPostBySlug(match.params.slug);

		setFormData({
			title: loading || !post.title ? '' : post.title,
			detail: loading || !post.detail ? '' : post.detail,
			image: loading || !post.image ? '' : post.image,
			approval: loading || !post.approval ? '' : post.approval,
			publish: loading || !post.publish ? '' : post.publish,
			category: loading || !post.categorytitle ? '' : post.categorytitle,
		});
	}, [getPostBySlug, loading]);

	const [file, setFile] = useState('');

	const { title, detail, image, category } = formData;

	const onChange = e => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const fileHandle = e => {
		setFile(e.target.files[0]);
	};

	const onSubmit = e => {
		e.preventDefault();
		const fd = new FormData();
		fd.append('postImage', file);
		fd.append('title', title);
		fd.append('detail', detail);
		fd.append('category', category);
		updatePost(post._id, fd);
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

									<img
										src={`../../${image}`}
										alt=''
										className='img-thumbnail'
									/>

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
											<label htmlFor='title'>Post Title</label>
											<div className='input-group'>
												<input
													type='text'
													className='form-control'
													name='title'
													value={title}
													onChange={e => onChange(e)}
													placeholder='Title of the post'
													required
												/>
											</div>
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

										<label className='card-title text-center'>
											Change Thumbnail
										</label>

										<input
											type='file'
											className='form-control-file'
											onChange={fileHandle}
										/>

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
	getPostBySlug: PropTypes.func.isRequired,
	updatePost: PropTypes.func.isRequired,
	post: PropTypes.object.isRequired,
	category: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
	post: state.post,
	category: state.category,
});

export default connect(mapStateToProps, { getPostBySlug, updatePost })(
	EditPost
);
