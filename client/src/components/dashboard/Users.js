import React, { useEffect, Fragment, useState } from 'react';
import DashNav from './DashNav';
import { getUsers, deleteUser, dashboardSearch } from '../../actions/user';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import PropTypes from 'prop-types';
import Pagination from '../layout/Pagination';
import { Link } from 'react-router-dom';

const GetUsers = ({
	getUsers,
	deleteUser,
	dashboardSearch,
	profile: { profiles, loading },
}) => {
	useEffect(() => {
		getUsers();
	}, [getUsers]);

	const [search, setsearch] = useState('');

	const [showPerPage] = useState(50);

	const [pagination, setPagination] = useState({
		start: 0,
		end: showPerPage,
	});

	const onPaginationChange = (start, end) => {
		setPagination({ start: start, end: end });
	};

	const onSubmitSearch = e => {
		e.preventDefault();
		dashboardSearch(search);
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
							<div className='d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3'>
								<h1 className='h2'>Users List</h1>

								<div className='mb-2 mb-md-0'>
									<form onSubmit={e => onSubmitSearch(e)}>
										<input
											type='text'
											className='form-input'
											placeholder='search...'
											value={search}
											onChange={e => setsearch(e.target.value)}
										/>
									</form>
								</div>
							</div>
							<div className='table-responsive'>
								<table className='table table-striped table-sm'>
									<thead>
										<tr>
											<th>Name</th>
											<th>Email</th>
											<th>Address</th>
											<th>Actions</th>
										</tr>
									</thead>
									<tbody>
										{profiles.length > 0 ? (
											profiles
												.slice(pagination.start, pagination.end)
												.map(profile => (
													<tr>
														<td>{profile.name}</td>
														<td>{profile.email}</td>
														<td>{profile.address}</td>
														<td>
															<a
																href={`/user/${profile._id}/edit`}
																className='btn btn-primary text-white'
															>
																{' '}
																Edit{' '}
															</a>{' '}
															<Link
																onClick={() => deleteUser(profile._id)}
																className='btn btn-danger text-white'
															>
																{' '}
																Delete{' '}
															</Link>
														</td>
													</tr>
												))
										) : (
											<h4>No users found</h4>
										)}
									</tbody>
								</table>
							</div>
							{profiles.length > 50 ? (
								<Pagination
									showPerPage={showPerPage}
									onPaginationChange={onPaginationChange}
									total={profiles.length}
								/>
							) : (
								''
							)}
						</main>
					</Fragment>
				)}
			</div>
		</div>
	);
};

GetUsers.propTypes = {
	getUsers: PropTypes.func.isRequired,
	deleteUser: PropTypes.func.isRequired,
	dashboardSearch: PropTypes.func.isRequired,
	profile: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
	profile: state.profile,
});

export default connect(mapStateToProps, {
	getUsers,
	deleteUser,
	dashboardSearch,
})(GetUsers);
