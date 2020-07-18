import React, { useState, Fragment } from 'react';
import DashNav from './DashNav';
import { addCategory } from '../../actions/category';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';

const AddCategory = ({ addCategory }) => {
	const [formData, setFormData] = useState({
		title: '',
	});

	const [file, setFile] = useState('');

	const { title } = formData;

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
		addCategory(fd);
		setFormData({
			title: '',
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
								<h4 className='mb-3'>Add Category</h4>
								<form
									className='needs-validation'
									encType='multipart/form-data'
									onSubmit={e => onSubmit(e)}
								>
									<div className='mb-3'>
										<label htmlFor='title'>Category Name</label>
										<div className='input-group'>
											<input
												type='text'
												className='form-control'
												name='title'
												value={title}
												onChange={e => onChange(e)}
												placeholder='Name of the category'
												required
											/>
										</div>
									</div>
									<label className='card-title text-center'>
										Choose Thumbnail
									</label>

									<input
										type='file'
										className='form-control-file'
										onChange={fileHandle}
										required
									/>

									<hr className='mb-4' />

									<button className='btn btn-primary  btn-block' type='submit'>
										Add Category
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

AddCategory.propTypes = {
	addCategory: PropTypes.func.isRequired,
};

export default connect(null, { addCategory })(AddCategory);
