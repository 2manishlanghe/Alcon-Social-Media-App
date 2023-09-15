package com.alcon.services;

import java.util.List;

import com.alcon.dto.PostRequestDTO;
import com.alcon.exception.PostException;
import com.alcon.exception.UserException;
import com.alcon.model.Post;
import com.alcon.model.User;

public interface PostService {

	public Post createPost(Post post,Integer userId, PostRequestDTO postDto) throws UserException;
	
	public String deletePost(Integer postId, Integer userId) throws UserException,PostException;
	
	public List<Post> findPostByUserId(Integer userId) throws UserException;
	
	public Post findePostById(Integer postId) throws PostException;
	
	public List<Post> findAllPost() throws PostException;
	
	public List<Post> findAllPostByUserIds(List<Integer> userIds) throws PostException, UserException;
	
	public String savedPost(Integer postId,Integer userId) throws PostException, UserException;
	
	public String unSavePost(Integer postId,Integer userId) throws PostException, UserException;
		
	public Post likePost(Integer postId ,Integer userId) throws UserException, PostException;
	
	public Post unLikePost(Integer postId ,Integer userId) throws UserException, PostException;

	public Post editPost(Post existingPost) throws PostException;

	
	
}