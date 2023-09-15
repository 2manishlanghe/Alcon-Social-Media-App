package com.alcon.dto;

import com.alcon.model.Post;

public class CreatePostRequest {

	private PostRequestDTO postRequest;
	private Post post;

	public PostRequestDTO getPostRequest() {
		return postRequest;
	}
	public void setPostRequest(PostRequestDTO postRequest) {
		this.postRequest = postRequest;
	}
	public Post getPost() {
		return post;
	}
	public void setPost(Post post) {
		this.post = post;
	}
    
}
