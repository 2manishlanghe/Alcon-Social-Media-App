package com.alcon.services;

import java.util.List;
import java.util.Optional;

import com.alcon.dto.ForgotPassword;
import com.alcon.dto.UserDto;
import com.alcon.exception.PostException;
import com.alcon.exception.UserException;
import com.alcon.model.Post;
import com.alcon.model.User;

import jakarta.servlet.http.HttpServletRequest;

public interface UserService {
	
	public User registerUser(User user) throws UserException;
	
	public User findUserById(Integer userId) throws UserException;
	
	public User findUserProfile(String token) throws UserException;
	
	public User findUserByUsername(String username) throws UserException;
	
	public String followUser(Integer reqUserId,Integer followUserId) throws UserException;
	
	public String unfollowUser(Integer reqUserId, Integer unfollowUserId) throws UserException; 
	
	public List<User> findUsersByUserIds(List<Integer> userIds);
	
	public List<User> searchUser(String query) throws UserException;
	
	public User updateUserDetails(User updatedUser, User existingUser) throws UserException;
	
	public void sendVerificationEmail(User user, String siteUrl) throws Exception;
	
	public void verifyUser(String username, String verificationCode) throws UserException;
	
	public String getSiteURL(HttpServletRequest request);

	public String forgotPassword(String email);

	public String setPassword(String email, String newPassword);

	public String resetPassword(String token, ForgotPassword password);
	public User getCurrentUser();
	
	public void saveUser(User user);
	
	public User registerMsLoginUser(User user) throws UserException;
	
	public User loginUser(User user) throws UserException;
	
	
	//public User getUserById(Integer userId);
	
	
	
}