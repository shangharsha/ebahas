import React, { Fragment, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { login } from '../../actions/auth';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const Login = ({ login, isAuthenticated }) => {
	const [formData, setFormData] = useState({
		email: '',
		password: '',
	});

	const { email, password } = formData;

	const onChange = e =>
		setFormData({ ...formData, [e.target.name]: e.target.value });

	const onSubmit = async e => {
		e.preventDefault();
		login(email, password);
	};

	//Redirect if logged in
	if (isAuthenticated) {
		return <Redirect to='/dashboard' />;
	}

	return (
		<Fragment>
			<form className='form-login' onSubmit={e => onSubmit(e)}>
				<div className='text-center mb-4'>
					<h1 className='h3 mb-3 font-weight-normal'>Login Form</h1>
					<small> * - fields are required</small>
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

					<div className='form-label-group'>
						<input
							type='password'
							name='password'
							value={password}
							onChange={e => onChange(e)}
							className='form-control'
							placeholder='Password'
							required
							autoFocus
						/>
						<label htmlFor='inputPassword'>Password *</label>
					</div>

					{/* <div className='checkbox mb-3'>
						<label>
							<input type='checkbox' value='remember-me' /> Remember me
						</label>
					</div> */}

					<button className='btn btn-lg btn-primary btn-block' type='submit'>
						Login
					</button>
				</div>
				<div className='checkbox mb-3 text-center'>
					<label>
						Don't have an account ? | <Link to='/register'>Register Here</Link>
					</label>
				</div>
				<div className='checkbox mb-3 text-center'>
					<label>
						Forget Password ? | <Link to='/forgetpassword'>Reset Here</Link>
					</label>
				</div>
			</form>
		</Fragment>
	);
};

Login.propTypes = {
	login: PropTypes.func.isRequired,
	isAuthenticated: PropTypes.bool,
};

const mapStateToProps = state => ({
	isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { login })(Login);
