import React, { Fragment, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { resetPassword } from '../../actions/user';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { setAlert } from '../../actions/alert';

const ResetPassword = ({ setAlert, resetPassword, isAuthenticated, match }) => {
	const [formData, setFormData] = useState({
		newpassword: '',
		confirmpassword: '',
	});

	const { newpassword, confirmpassword } = formData;

	const onChange = e =>
		setFormData({ ...formData, [e.target.name]: e.target.value });

	const onSubmit = e => {
		const token = match.params.token;
		e.preventDefault();
		if (newpassword === confirmpassword) {
			resetPassword(newpassword, token);
			setFormData({ newpassword: '', confirmpassword: '' });
		} else {
			setAlert('Password doesnot match', 'danger');
		}
	};

	//Redirect if logged in
	if (isAuthenticated) {
		return <Redirect to='/dashboard' />;
	}

	return (
		<Fragment>
			<form className='form-login' onSubmit={e => onSubmit(e)}>
				<div className='text-center mb-4'>
					<h1 className='h3 mb-3 font-weight-normal'>Reset Your Password</h1>
					<small> * - field is required</small>
					<div className='form-label-group'>
						<input
							type='password'
							name='newpassword'
							value={newpassword}
							onChange={e => onChange(e)}
							className='form-control'
							placeholder='Enter new password'
							required
							autoFocus
						/>
						<label htmlFor='inputEmail'>New Password *</label>
					</div>
					<div className='form-label-group'>
						<input
							type='password'
							name='confirmpassword'
							value={confirmpassword}
							onChange={e => onChange(e)}
							className='form-control'
							placeholder='Re-Enter Your new password'
							required
							autoFocus
						/>
						<label htmlFor='inputEmail'>Re-enter New Password *</label>
					</div>

					<button className='btn btn-lg btn-primary btn-block' type='submit'>
						Reset Password
					</button>
				</div>
			</form>
		</Fragment>
	);
};

ResetPassword.propTypes = {
	resetPassword: PropTypes.func.isRequired,
	setAlert: PropTypes.func.isRequired,
	isAuthenticated: PropTypes.bool,
};

const mapStateToProps = state => ({
	isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { setAlert, resetPassword })(
	ResetPassword
);
