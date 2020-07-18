import React, { Fragment, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { forgetPassword } from '../../actions/user';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { setAlert } from '../../actions/alert';

const ForgetPassword = ({ forgetPassword, isAuthenticated }) => {
	const [formData, setFormData] = useState({
		email: '',
	});

	const { email } = formData;

	const onChange = e =>
		setFormData({ ...formData, [e.target.name]: e.target.value });

	const onSubmit = e => {
		e.preventDefault();
		if (email) {
			forgetPassword(email);
			setFormData({ email: '' });
		} else {
			setAlert('Email is required', 'danger');
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
					<h1 className='h3 mb-3 font-weight-normal'>Forget Password</h1>
					<small> * - field is required</small>
					<div className='form-label-group'>
						<input
							type='email'
							name='email'
							value={email}
							onChange={e => onChange(e)}
							className='form-control'
							placeholder='Email address'
							required
							autoFocus
						/>
						<label htmlFor='inputEmail'>Email Id *</label>
					</div>

					<button className='btn btn-lg btn-primary btn-block' type='submit'>
						Forget Password
					</button>
				</div>
				<div className='checkbox mb-3 text-center'>
					<label>
						Don't have an account ? | <Link to='/register'>Register Here</Link>
					</label>
				</div>
				<div className='checkbox mb-3 text-center'>
					<label>
						Go to login ? | <Link to='/login'>Login Here</Link>
					</label>
				</div>
			</form>
		</Fragment>
	);
};

ForgetPassword.propTypes = {
	forgetPassword: PropTypes.func.isRequired,
	isAuthenticated: PropTypes.bool,
};

const mapStateToProps = state => ({
	isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { forgetPassword })(ForgetPassword);
