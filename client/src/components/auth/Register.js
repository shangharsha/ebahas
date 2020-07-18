import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { setAlert } from '../../actions/alert';
import { register } from '../../actions/auth';
import PropTypes from 'prop-types';

const Register = ({ setAlert, register, isAuthenticated }) => {
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		address: '',
		password: '',
		password2: '',
		phone: '',
	});

	const { name, email, password, password2, address, phone } = formData;

	const onChange = e =>
		setFormData({ ...formData, [e.target.name]: e.target.value });

	const onSubmit = e => {
		e.preventDefault();
		if (password !== password2) {
			setAlert('Password doesnot match', 'danger');
		} else {
			if (
				(phone && phone.length !== 10) ||
				(phone && !phone.startsWith('98'))
			) {
				setAlert('Please enter a valid phone number', 'danger');
			} else {
				register(formData);
			}
		}
	};

	//Redirect if logged in
	if (isAuthenticated) {
		return <Redirect to='/dashboard' />;
	}

	return (
		<Fragment>
			<form className='form-register' onSubmit={e => onSubmit(e)}>
				<div className='text-center mb-4'>
					<h1 className='h3 mb-3 font-weight-normal'>Register User</h1>
					<small> * - fields are required</small>
					<div className='form-label-group'>
						<input
							type='text'
							name='name'
							value={name}
							onChange={e => onChange(e)}
							className='form-control'
							placeholder='Full Name'
							required
							autoFocus
						/>
						<label htmlFor='name'>Full Name *</label>
					</div>

					<div className='form-label-group'>
						<input
							type='text'
							name='address'
							value={address}
							onChange={e => onChange(e)}
							className='form-control'
							placeholder='Address'
							required
							autoFocus
						/>
						<label htmlFor='address'>Address *</label>
					</div>

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
						<label htmlFor='email'>Email Id *</label>
					</div>

					<div className='form-label-group'>
						<input
							type='number'
							name='phone'
							value={phone}
							onChange={e => onChange(e)}
							className='form-control'
							placeholder='Phone'
							autoFocus
						/>
						<label htmlFor='phone'>Phone number </label>
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
						/>
						<label htmlFor='password'>Password *</label>
					</div>

					<div className='form-label-group'>
						<input
							type='password'
							name='password2'
							value={password2}
							onChange={e => onChange(e)}
							className='form-control'
							placeholder='Password'
							required
						/>
						<label htmlFor='password2'>Re-enter Password *</label>
					</div>
					<button className='btn btn-lg btn-primary btn-block' type='submit'>
						Register
					</button>
				</div>
				<div className='checkbox mb-3 text-center'>
					<label>
						Already have an account ? | <Link to='/login'>Login Here</Link>
					</label>
				</div>
			</form>
		</Fragment>
	);
};

Register.propTypes = {
	setAlert: PropTypes.func.isRequired,
	register: PropTypes.func.isRequired,
	isAuthenticated: PropTypes.bool,
};

const mapStateToProps = state => ({
	isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { setAlert, register })(Register);
