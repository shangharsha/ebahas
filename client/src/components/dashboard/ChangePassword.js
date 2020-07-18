import React, { useState, Fragment } from 'react';
import DashNav from './DashNav';
import { changePassword } from '../../actions/user';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { setAlert } from '../../actions/alert';
const ChangePassword = ({ setAlert, changePassword }) => {
	const [formData, setFormData] = useState({
		oldpassword: '',
		newpassword: '',
		confirmpassword: '',
	});

	const { oldpassword, newpassword, confirmpassword } = formData;

	const onChange = e => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const onSubmit = e => {
		e.preventDefault();

		if (newpassword !== confirmpassword) {
			setAlert('New Password doesnot match', 'danger');
		} else {
			changePassword(formData);
		}
		setFormData({
			oldpassword: '',
			newpassword: '',
			confirmpassword: '',
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
								<h4 className='mb-3'>Change Password</h4>
								<form className='needs-validation' onSubmit={e => onSubmit(e)}>
									<div className='mb-3'>
										<label htmlFor='oldpassword'>Old Password</label>
										<div className='input-group'>
											<input
												type='text'
												className='form-control'
												name='oldpassword'
												value={oldpassword}
												onChange={e => onChange(e)}
												placeholder='Enter your old password'
												required
											/>
										</div>
									</div>

									<div className='mb-3'>
										<label htmlFor='newpassword'>New Password</label>
										<div className='input-group'>
											<input
												type='text'
												className='form-control'
												name='newpassword'
												value={newpassword}
												onChange={e => onChange(e)}
												placeholder='Enter new Password'
												required
											/>
										</div>
									</div>

									<div className='mb-3'>
										<label htmlFor='confirmpassword'>
											Confirm New Password
										</label>
										<input
											type='text'
											className='form-control'
											name='confirmpassword'
											value={confirmpassword}
											onChange={e => onChange(e)}
											placeholder='Re-type your new password'
											required
										/>
									</div>
									<hr className='mb-4' />

									<button className='btn btn-primary  btn-block' type='submit'>
										Change Password
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

ChangePassword.propTypes = {
	changePassword: PropTypes.func.isRequired,
	setAlert: PropTypes.func.isRequired,
};

export default connect(null, { setAlert, changePassword })(ChangePassword);
