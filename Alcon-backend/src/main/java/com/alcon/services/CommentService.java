package com.alcon.services;

import com.alcon.exception.CommentException;
import com.alcon.exception.PostException;
import com.alcon.exception.UserException;
import com.alcon.model.Comments;

public interface CommentService {
	
	public Comments createComment(Comments comment,Integer postId,Integer userId) throws PostException, UserException;

	public Comments findCommentById(Integer commentId) throws CommentException;
	public Comments likeComment(Integer CommentId,Integer userId) throws UserException, CommentException;
	public Comments unlikeComment(Integer CommentId,Integer userId) throws UserException, CommentException;
}
