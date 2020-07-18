import React, { useState, useEffect } from 'react';

const Pagination = ({ showPerPage, onPaginationChange, total }) => {
	const [counter, setCounter] = useState(1);

	useEffect(() => {
		const value = showPerPage * counter;
		onPaginationChange(value - showPerPage, value);
	}, [counter, onPaginationChange, showPerPage]);

	const onButtonClick = type => {
		if (type === 'prev') {
			if (counter === 1) {
				setCounter(1);
			} else {
				setCounter(counter - 1);
			}
		}
		if (type === 'next') {
			if (Math.ceil(total / showPerPage) === counter) {
				setCounter(counter);
			} else {
				setCounter(counter + 1);
			}
		}
	};
	return (
		<div className='row flex-nowrap justify-content-between align-items-center'>
			<div className='col-4 pt-1'>
				<button
					className='btn btn-primary'
					onClick={() => onButtonClick('prev')}
				>
					Previous
				</button>
			</div>

			<div className='col-4 d-flex justify-content-end align-items-center'>
				<button
					className='btn btn-primary'
					onClick={() => onButtonClick('next')}
				>
					Next
				</button>
			</div>
		</div>
	);
};

export default Pagination;
