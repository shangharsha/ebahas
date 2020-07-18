import React, { useEffect, useState, Fragment } from 'react';
import DashNav from './DashNav';
import Moment from 'react-moment';
import { subYears } from 'date-fns';
import { updateProfile } from '../../actions/user';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Spinner from '../layout/Spinner';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const EditProfile = ({ updateProfile, auth: { user, loading } }) => {
	const [formData, setFormData] = useState({
		name: '',
		address: '',
		phone: '',
		email: '',
		dob: '',
		image: '',
		admin: null,
	});

	const [file, setFile] = useState('');

	useEffect(() => {
		setFormData({
			name: loading || !user.name ? '' : user.name,
			address: loading || !user.address ? '' : user.address,
			phone: loading || !user.phone ? '' : user.phone,
			email: loading || !user.email ? '' : user.email,
			dob: loading || !user.dob ? '' : user.dob,
			image: loading || !user.image ? '' : user.image,
			admin: loading || !user.isAdmin ? '' : user.isAdmin,
		});
	}, [loading]);

	const { name, address, email, phone, dob, image, admin } = formData;

	const [startDate, setStartDate] = useState('');
	console.log(startDate);

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
		fd.append('name', name);
		fd.append('address', address);
		fd.append('phone', phone);
		fd.append('dob', startDate);
		fd.append('Admin', admin);
		updateProfile(user._id, fd);
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
									<h4 className='mb-3'>Edit Profile</h4>
									<div className='bio text-center'>
										<img
											src={`../${image}`}
											alt=''
											className='img-fluid mb-5'
										/>
									</div>
									<form
										className='needs-validation'
										onSubmit={e => onSubmit(e)}
									>
										<div className='mb-3'>
											<label htmlFor='fullname'>Full Name</label>
											<div className='input-group'>
												<input
													type='text'
													className='form-control'
													name='name'
													value={name}
													onChange={e => onChange(e)}
													placeholder='Full Name'
													required
												/>
											</div>
										</div>

										<div className='mb-3'>
											<label htmlFor='address'>Address</label>
											<div className='input-group'>
												<input
													type='text'
													className='form-control'
													name='address'
													value={address}
													onChange={e => onChange(e)}
													placeholder='Address'
													required
												/>
											</div>
										</div>

										<div className='mb-3'>
											<label htmlFor='email'>Email</label>
											<input
												type='email'
												className='form-control'
												name='email'
												value={email}
												onChange={e => onChange(e)}
												placeholder='you@example.com'
												disabled
											/>
										</div>

										<div className='mb-3'>
											<label htmlFor='phone'>Phone</label>
											<input
												type='text'
												className='form-control'
												name='phone'
												value={phone}
												onChange={e => onChange(e)}
												placeholder='Phone Number'
											/>
										</div>

										<div className='mb-3'>
											<label htmlFor='dob'>Birth Date</label> {'-'}
											{dob ? <Moment format='D MMM YYYY'>{dob}</Moment> : ''}
											{'\n'}
											<DatePicker
												selected={startDate}
												dateFormat='MMMM d, yyyy'
												onChange={date => setStartDate(date)}
												maxDate={subYears(new Date(), 13)}
												showYearDropdown
												dateFormatCalendar='MMMM'
												yearDropdownItemNumber={15}
												scrollableYearDropdown
											/>
										</div>

										<label className='card-title text-center'>
											Change Profile Picture
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
											Update
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

EditProfile.propTypes = {
	updateProfile: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
	auth: state.auth,
});

export default connect(mapStateToProps, { updateProfile })(EditProfile);
