import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addComment } from '../../actions/post';

const CommentForm = ({ postId, addComment }) => {
	const [text, setText] = useState('');

	return (
		<div className='comment-form-wrap pt-5'>
			<h3 className='mb-5'>Leave a comment</h3>
			<form
				onSubmit={e => {
					e.preventDefault();
					addComment(postId, { text });
					setText('');
				}}
				className='p-5 '
			>
				<div className='form-group'>
					<label htmlFor='text'>Enter your comment here</label>
					<textarea
						name='text'
						value={text}
						onChange={e => setText(e.target.value)}
						cols='30'
						rows='5'
						className='form-control'
					></textarea>
				</div>
				<div className='form-group'>
					<input type='submit' className='btn btn-primary' />
				</div>
			</form>
		</div>
	);
};

CommentForm.propTypes = {
	addComment: PropTypes.func.isRequired,
};

export default connect(null, { addComment })(CommentForm);
