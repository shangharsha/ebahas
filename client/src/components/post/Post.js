import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import { getPostBySlug } from '../../actions/post';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';
import LikeandDislikes from './LikeandDislikes';

const Post = ({
	getPostBySlug,
	post: { post, posts, loading },
	auth: { isAuthenticated },
	match,
}) => {
	useEffect(() => {
		getPostBySlug(match.params.slug);
	}, [getPostBySlug, match.params.slug]);

	return loading || post === null ? (
		<Spinner />
	) : (
		<Fragment>
			<div
				className='site-cover site-cover-sm same-height overlay single-page'
				style={{ backgroundImage: `url(../${post.image})` }}
			>
				<div className='container'>
					<div className='row same-height justify-content-center'>
						<div className='col-md-12 col-lg-10'>
							<div className='post-entry text-center'>
								<span className='post-category text-white bg-success mb-3'>
									{post.categorytitle}
								</span>
								<h1 className='mb-4'>{post.title}</h1>
								<div className='post-meta align-items-center text-center'>
									<figure className='author-figure mb-0 mr-3 d-inline-block'>
										{post.user ? (
											<img
												src={`../${post.user.image}`}
												alt=''
												className='img-fluid'
											/>
										) : (
											<img
												src={`../images/users/default-image.png`}
												alt=''
												className='img-fluid'
											/>
										)}
									</figure>
									<span className='d-inline-block mt-1'>By {post.name}</span>
									<span>
										&nbsp;-&nbsp;{' '}
										<Moment format='D MMM YYYY'>{post.updatedAt}</Moment>{' '}
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className='container'>
				<div className='row blog-entries element-animate'>
					<div className='col-md-12 col-lg-8 main-content'>
						<div className='post-content-body'>
							<p>{post.detail}</p>
						</div>

						<div className='pt-5'>
							<p>Category: {post.categorytitle}</p>
						</div>
						<LikeandDislikes
							postId={post._id}
							postLikes={post.likes}
							postDislikes={post.unlikes}
						/>

						<div className='pt-5'>
							<h3 className='mb-5'>{post.comments.length} Comments</h3>
							<ul className='comment-list'>
								{post.comments.map(comment => (
									<li className='comment' key={comment._id}>
										<CommentItem
											key={comment._id}
											comment={comment}
											post={post}
										/>
									</li>
								))}
							</ul>
						</div>
						{isAuthenticated ? (
							<CommentForm postId={post._id} />
						) : (
							<Fragment>
								<div className='comment-form-wrap pt-5'>
									<h3 className='mb-5'>Login to comment on the post</h3>
								</div>
							</Fragment>
						)}
					</div>
				</div>
			</div>
			<div className='site-section'>
				<div className='container'>
					{posts.length > 1 ? (
						<div className='row mb-5'>
							<div className='col-12 text-center'>
								<h2>More Related Posts</h2>
							</div>
						</div>
					) : (
						''
					)}

					<div className='row align-items-stretch retro-layout'>
						{posts.length > 1
							? posts.slice(1, 2).map(p => (
									<div className='col-md-5 order-md-2'>
										<a
											href={`../../post/${p.slug}`}
											className='hentry img-1 h-100 gradient'
											style={{ backgroundImage: `url(../../${p.image})` }}
										>
											<span className='post-category text-white bg-danger'>
												{p.categorytitle}
											</span>
											<div className='text'>
												<h2>{p.title}</h2>
												<span>{p.createdAt}</span>
											</div>
										</a>
									</div>
							  ))
							: ''}
						<div className='col-md-7'>
							{posts.length > 2
								? posts.slice(2, 4).map(p => (
										<a
											href={`../../post/${p.slug}`}
											key={p._id}
											className='hentry img-2 v-height mb30 gradient'
											style={{ backgroundImage: `url(../../${p.image})` }}
										>
											<span className='post-category text-white bg-success'>
												{p.categorytitle}
											</span>
											<div className='text text-sm'>
												<h2>{p.title}</h2>
												<span>{p.createdAt}</span>
											</div>
										</a>
								  ))
								: ''}
						</div>
					</div>
				</div>
			</div>
		</Fragment>
	);
};

Post.propTypes = {
	post: PropTypes.object.isRequired,
	auth: PropTypes.object.isRequired,
	getPostBySlug: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
	auth: state.auth,
	post: state.post,
});

export default connect(mapStateToProps, { getPostBySlug })(Post);
