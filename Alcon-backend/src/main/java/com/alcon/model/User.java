package com.alcon.model;

import com.alcon.dto.UserDto;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "users")
public class User {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Integer id;
	private String username;
	private String email;
	private String name;
	private String mobile;
	private String website;
	private String bio;
	private String gender;
	private String image;
	private boolean isEnable;
	private String forgetToken;
	private LocalDateTime forgetTokenExpiration;

	@JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
	private String password;

	@ElementCollection
	@Embedded
	private Set<UserDto> follower = new HashSet<UserDto>();

	@ElementCollection
	@Embedded
	private Set<UserDto> following = new HashSet<UserDto>();

	@ManyToMany
	private List<Post> savedPost = new ArrayList<>();
	
	@ManyToMany
    @JoinTable(name = "user_saved_posts",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "post_id"))
    private Set<Post> savedPosts = new HashSet<>();

	@ElementCollection
    private List<Integer> savedPostIds = new ArrayList<>();

	public User() {
		super();
	}


	public User(Integer id, String username, String email, String name, String mobile, String website, String bio, String gender, String image, boolean isEnable, String forgetToken, LocalDateTime forgetTokenExpiration, String password, Set<UserDto> follower, Set<UserDto> following, List<Post> savedPost) {
		this.id = id;
		this.username = username;
		this.email = email;
		this.name = name;
		this.mobile = mobile;
		this.website = website;
		this.bio = bio;
		this.gender = gender;
		this.image = image;
		this.isEnable = isEnable;
		this.forgetToken = forgetToken;
		this.forgetTokenExpiration = forgetTokenExpiration;
		this.password = password;
		this.follower = follower;
		this.following = following;
		this.savedPost = savedPost;
	}

	public Integer getId() {
		return this.id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getUsername() {
		return this.username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getEmail() {
		return this.email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getName() {
		return this.name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getMobile() {
		return this.mobile;
	}

	public void setMobile(String mobile) {
		this.mobile = mobile;
	}

	public String getWebsite() {
		return this.website;
	}

	public void setWebsite(String website) {
		this.website = website;
	}

	public String getBio() {
		return this.bio;
	}

	public void setBio(String bio) {
		this.bio = bio;
	}

	public String getGender() {
		return this.gender;
	}

	public void setGender(String gender) {
		this.gender = gender;
	}

	public String getImage() {
		return this.image;
	}

	public void setImage(String image) {
		this.image = image;
	}

	public boolean getIsEnable() {
		return this.isEnable;
	}

	public void setIsEnable(boolean isEnable) {
		this.isEnable = isEnable;
	}

	public String getForgetToken() {
		return this.forgetToken;
	}

	public void setForgetToken(String forgetToken) {
		this.forgetToken = forgetToken;
	}

	public LocalDateTime getForgetTokenExpiration() {
		return this.forgetTokenExpiration;
	}

	public void setForgetTokenExpiration(LocalDateTime forgetTokenExpiration) {
		this.forgetTokenExpiration = forgetTokenExpiration;
	}

	public String getPassword() {
		return this.password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public Set<UserDto> getFollower() {
		return this.follower;
	}

	public void setFollower(Set<UserDto> follower) {
		this.follower = follower;
	}

	public Set<UserDto> getFollowing() {
		return this.following;
	}

	public void setFollowing(Set<UserDto> following) {
		this.following = following;
	}

	public List<Post> getSavedPost() {
		return this.savedPost;
	}

	public void setSavedPost(List<Post> savedPost) {
		this.savedPost = savedPost;
	}
	
	

	public Set<Post> getSavedPosts() {
		return savedPosts;
	}


	public void setSavedPosts(Set<Post> savedPosts) {
		this.savedPosts = savedPosts;
	}


	public List<Integer> getSavedPostIds() {
		return savedPostIds;
	}


	public void setSavedPostIds(List<Integer> savedPostIds) {
		this.savedPostIds = savedPostIds;
	}


	public void setEnable(boolean isEnable) {
		this.isEnable = isEnable;
	}


	@Override
	public String toString() {
		return "User{"
				+ "id=" + id + ", "
				+ "username='" + username + "', "
				+ "email='" + email + "', "
				+ "name='" + name + "', "
				+ "mobile='" + mobile + "', "
				+ "website='" + website + "', "
				+ "bio='" + bio + "', "
				+ "gender='" + gender + "', "
				+ "image='" + image + "', "
				+ "isEnable=" + isEnable + ", "
				+ "forgetToken='" + forgetToken + "', "
				+ "forgetTokenExpiration=" + forgetTokenExpiration + ", "
				+ "password='" + password + "', "
				+ "follower=" + follower + ", "
				+ "following=" + following + ", "
				+ "savedPost=" + savedPost + "}";
	}




}