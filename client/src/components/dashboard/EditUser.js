import React, { useEffect, useState, Fragment } from 'react';
import DashNav from './DashNav';
import { getProfile, updateUserProfile } from '../../actions/user';
import Moment from 'react-moment';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Spinner from '../layout/Spinner';

const EditProfile = ({
	getProfile,
	updateUserProfile,
	profile: { profile, loading },
	match,
}) => {
	const [formData, setFormData] = useState({
		name: '',
		address: '',
		phone: '',
		email: '',
		dob: '',
		image: '',
		Admin: '',
	});

	useEffect(() => {
		getProfile(match.params.id);

		setFormData({
			name: loading || !profile.name ? '' : profile.name,
			address: loading || !profile.address ? '' : profile.address,
			phone: loading || !profile.phone ? '' : profile.phone,
			email: loading || !profile.email ? '' : profile.email,
			dob: loading || !profile.dob ? '' : profile.dob,
			image: loading || !profile.image ? '' : profile.image,
			Admin: loading || !profile.isAdmin ? '' : profile.isAdmin,
		});
	}, [getProfile, loading]);

	const { name, address, email, phone, dob, image, Admin } = formData;

	const onChange = e => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const onCheckChange = e => {
		setFormData({ ...formData, Admin: !Admin });
	};

	const onSubmit = e => {
		e.preventDefault();
		updateUserProfile(profile._id, formData);
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
									<h4 className='mb-3'>Edit User Profile</h4>
									<div className='bio text-center'>
										<img
											src={`../../${image}`}
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
											<label htmlFor='dob'>Birth Date: </label>{' '}
											{dob ? <Moment format='D MMM YYYY'>{dob}</Moment> : ''}
										</div>

										<div className='mb-3'>
											<label htmlFor='Admin'>Admin: </label>{' '}
											<input
												type='checkbox'
												name='Admin'
												checked={Admin}
												onChange={e => onCheckChange(e)}
											/>
										</div>

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
	getProfile: PropTypes.func.isRequired,
	updateUserProfile: PropTypes.func.isRequired,
	profile: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
	profile: state.profile,
});

export default connect(mapStateToProps, { getProfile, updateUserProfile })(
	EditProfile
);
