package com.alcon.dto;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.Column;

public class PostRequestDTO {
	
	
	private String image;
	private String location;
	private LocalDateTime createdAt;
	
	private String visibility;
	 private String caption;
	 private List<String> hashtags;
	 
	 	 
	public PostRequestDTO() {
		super();
		// TODO Auto-generated constructor stub
	}


	

	public PostRequestDTO(String image, String location, LocalDateTime createdAt, String visibility, String caption,
			List<String> hashtags) {
		super();
		this.image = image;
		this.location = location;
		this.createdAt = createdAt;
		this.visibility = visibility;
		this.caption = caption;
		this.hashtags = hashtags;
	}




	public String getImage() {
		return image;
	}




	public void setImage(String image) {
		this.image = image;
	}




	public String getLocation() {
		return location;
	}




	public void setLocation(String location) {
		this.location = location;
	}




	public LocalDateTime getCreatedAt() {
		return createdAt;
	}




	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}




	public String getVisibility() {
		return visibility;
	}




	public void setVisibility(String visibility) {
		this.visibility = visibility;
	}




	public String getCaption() {
		return caption;
	}


	public void setCaption(String caption) {
		this.caption = caption;
	}


	public List<String> getHashtags() {
		return hashtags;
	}


	public void setHashtags(List<String> hashtags) {
		this.hashtags = hashtags;
	}


	@Override
	public String toString() {
		return "PostRequestDTO [caption=" + caption + ", hashtags=" + hashtags + "]";
	}
	 
	 

}