import React, { useState, Fragment } from 'react';
import DashNav from './DashNav';
import { createPost } from '../../actions/post';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import PropTypes from 'prop-types';

const CreatePost = ({ createPost, history, category: { categories } }) => {
	const [formData, setFormData] = useState({
		detail: '',
		title: '',
		category: '',
	});

	const { detail, category, title } = formData;

	const onChange = e => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const onSubmit = e => {
		e.preventDefault();
		createPost(formData, history);
		setFormData({
			title: '',
			detail: '',
			category: '',
		});
	};

	return (
		<div className='container-fluid'>
			<div className='row'>
				<DashNav />

				<Fragment>
					<main role='main' className='col-md-9 ml-sm-auto col-lg-10 px-md-4'>
						<div className='row'>
							<div className='col-md-8 order-md-1'>
								<h4 className='mb-3'>Create Post</h4>
								<form className='needs-validation' onSubmit={e => onSubmit(e)}>
									<label htmlFor='category'>Select a category</label>
									<div className='input-group'>
										<select
											required
											name='category'
											onChange={e => onChange(e)}
										>
											<option selected value={category}>
												Select Category
											</option>
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
										<label htmlFor='title'>Post Title(Optional)</label>
										<div className='input-group'>
											<input
												type='text'
												className='form-control'
												name='title'
												value={title}
												onChange={e => onChange(e)}
												placeholder='Title for your post'
											></input>
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
									<hr className='mb-4' />

									<button className='btn btn-primary  btn-block' type='submit'>
										Create Post
									</button>
								</form>
							</div>
						</div>
					</main>
				</Fragment>
			</div>
		</div>
	);
};

CreatePost.propTypes = {
	createPost: PropTypes.func.isRequired,
	category: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
	category: state.category,
});

export default connect(mapStateToProps, { createPost })(withRouter(CreatePost));
