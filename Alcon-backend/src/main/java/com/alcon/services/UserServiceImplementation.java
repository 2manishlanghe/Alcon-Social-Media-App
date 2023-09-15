package com.alcon.services;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.alcon.dto.ForgotPassword;
import com.alcon.dto.UserDto;
import com.alcon.exception.UserException;
import com.alcon.model.User;
import com.alcon.model.VerificationCode;
import com.alcon.repository.UserRepository;
import com.alcon.repository.VerificationRepository;
import com.alcon.security.JwtTokenClaims;
import com.alcon.security.JwtTokenProvider;

import jakarta.mail.internet.MimeMessage;
import jakarta.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class UserServiceImplementation implements UserService {
	
	@Autowired
	private UserRepository repo;

	@Autowired
	private PasswordEncoder passwordEncoder;
	
	@Autowired
	private JwtTokenProvider jwtTokenProvider;
	
	@Autowired
	private VerificationRepository verificationRepository;

	private final JavaMailSender mailSender;

	public UserServiceImplementation(JavaMailSender mailSender) {
		this.mailSender = mailSender;
	}
	
	final String  PASSWORD ="zxcvlkjhgfdsabnm";
	
	@Override
	public User registerUser(User user) throws UserException {
		
		System.out.println("registered user ------ ");
		
		Optional<User> isEmailExist = repo.findByEmail(user.getEmail());
		
		if (isEmailExist.isPresent()) {
			throw new UserException("Email Already Exist Try With Another Email");
		}
		
		Optional<User> isUsernameTaken=repo.findByUsername(user.getUsername());
		
		if(isUsernameTaken.isPresent()) {
			throw new UserException("Username Already Taken Try With Another Username");
		}
		
		if(user.getEmail()== null || user.getPassword()== null || user.getUsername()==null || user.getName()==null) {
			throw new UserException("email,password and username are required");
			
		}
		
		String encodedPassword=passwordEncoder.encode(user.getPassword());
		
		User newUser=new User();
		
		newUser.setEmail(user.getEmail());
		newUser.setPassword(encodedPassword);
		newUser.setUsername(user.getUsername());
		newUser.setName(user.getName());
		
		newUser.setIsEnable(false);

		VerificationCode verificationCode = new VerificationCode();
		verificationCode.setVerificationToken(generateRandomString());
		verificationCode.setUser(newUser);

		verificationRepository.save(verificationCode);
		
		
		return repo.save(newUser);
		
	}

	
	@Override
	public User findUserById(Integer userId) throws UserException {
		
		Optional<User> opt =repo.findById(userId);
		
		if(opt.isPresent()) {
			return opt.get();
		}
		
		throw new UserException("user not found with userid :"+userId);
	}
	
	


	@Override
	public String followUser(Integer reqUserId, Integer followUserId) throws UserException {
		User followUser=findUserById(followUserId);
		User reqUser=findUserById(reqUserId);
		
		UserDto follower=new UserDto();
		follower.setEmail(reqUser.getEmail());
		follower.setUsername(reqUser.getUsername());
		follower.setId(reqUser.getId());
		follower.setName(reqUser.getName());
		follower.setUserImage(reqUser.getImage());
		
	
		UserDto following=new UserDto();
		following.setEmail(followUser.getEmail());
		following.setUsername(followUser.getUsername());
		following.setId(followUser.getId());
		following.setName(followUser.getName());
		following.setUserImage(followUser.getImage());
		
		
		followUser.getFollower().add(follower);
		reqUser.getFollowing().add(following);
		
		repo.save(followUser);
		repo.save(reqUser);
		
		return "you are following "+followUser.getUsername();
	}


	@Override
	public String unfollowUser(Integer reqUserId, Integer unfollowUserId) throws UserException {

		
		User unfollowUser=findUserById(unfollowUserId);
		
		System.out.println("unfollow user ---- "+unfollowUser.toString());
		System.out.println("unfollow user's follower"+unfollowUser.getFollower().toString());
		
		User reqUser=findUserById(reqUserId);
		
		UserDto unfollow=new UserDto();
		unfollow.setEmail(reqUser.getEmail());
		unfollow.setUsername(reqUser.getUsername());
		unfollow.setId(reqUser.getId());
		unfollow.setName(reqUser.getName());
		unfollow.setUserImage(reqUser.getImage());
		
	
		UserDto following=new UserDto();
		following.setEmail(unfollowUser.getEmail());
		following.setUsername(unfollowUser.getUsername());
		following.setId(unfollowUser.getId());
		following.setName(unfollowUser.getName());
		following.setUserImage(unfollowUser.getImage());
		
		
		unfollowUser.getFollower().remove(unfollow);

		repo.save(reqUser);
		
		return "you have unfollow "+unfollowUser.getUsername();
		

	}


	@Override
	public User findUserProfile(String token) throws UserException {

		token=token.substring(7);
		
	    JwtTokenClaims jwtTokenClaims = jwtTokenProvider.getClaimsFromToken(token);

	    String username = jwtTokenClaims.getUsername();
	    
	    Optional<User> opt = repo.findByEmail(username);
	    
	    if(opt.isPresent()) {

	    	
	    	return opt.get();
	    	
	    }
		
	    throw new UserException("user not exist with email : "+username);


	    
		
	}


	@Override
	public User findUserByUsername(String username) throws UserException {
		
		Optional<User> opt=repo.findByUsername(username);
		
		if(opt.isPresent()) {
			User user=opt.get();
			return user;
		}
		
		throw new UserException("user not exist with username "+username);
	}


	@Override
	public List<User> findUsersByUserIds(List<Integer> userIds) {
		List<User> users= repo.findAllUserByUserIds(userIds);
		
		return users;
	}


	@Override
	public List<User> searchUser(String query) throws UserException {
		List<User> users=repo.findByQuery(query);
		if(users.size()==0) {
			throw new UserException("user not exist");
		}
		return users;
	}


	@Override
	public User updateUserDetails(User updatedUser, User existingUser) throws UserException {
	    if (updatedUser.getUsername() != null) {
	        // Check if the updated username is already taken
//	    	LOGGER.info("..................ExistingUser"+existingUser + "...............");
	        Optional<User> isUsernameTaken = repo.findByUsername(updatedUser.getUsername());
	        if (isUsernameTaken.isPresent() && !isUsernameTaken.get().getId().equals(existingUser.getId())) {
	            throw new UserException("Username already taken. Cannot update details.");
	        }
	        existingUser.setUsername(updatedUser.getUsername());
	    }

		if(updatedUser.getEmail()!= null) {
			existingUser.setEmail(updatedUser.getEmail());	
		}
		if(updatedUser.getBio()!=null) {
			existingUser.setBio(updatedUser.getBio());
		}
		if(updatedUser.getName()!=null) {
			existingUser.setName(updatedUser.getName());
		}
		if(updatedUser.getUsername()!=null) {
			existingUser.setUsername(updatedUser.getUsername());
		}
		if(updatedUser.getMobile()!=null) {
			existingUser.setMobile(updatedUser.getMobile());
		}
		if(updatedUser.getGender()!=null) {
			existingUser.setGender(updatedUser.getGender());
		}
		if(updatedUser.getWebsite()!=null) {
			existingUser.setWebsite(updatedUser.getWebsite());
		}
		if(updatedUser.getImage()!=null) {
			existingUser.setImage(updatedUser.getImage());
		}
		
		
		if(updatedUser.getId()!=existingUser.getId()) {
//			LOGGER.info(" u "+updatedUser.getId()+" e "+existingUser.getId());
			throw new UserException("you can't update another user"); 
		}
		
		

	    return repo.save(existingUser);
	}


	@Override
	public void sendVerificationEmail(User user, String siteUrl) throws Exception {

		String verifyURL = siteUrl + "/verify?username=" + user.getEmail() +"&verificationCode="+ verificationCode(user);


		String senderName = "Alcon";
		String subject = "Hey "+ user.getName() +", Please verify your account";
		String emailContent = "<div style=\"border: 1px solid #e0e0e0; padding: 20px; border-radius: 10px;\">"
				+ "<div style=\"text-align: center; margin-top: 20px;\">"
				+ "<img src=\"https://simg.nicepng.com/png/small/152-1525748_ethereum-logo-png-graphic-transparent-download-ethereum-logo.png\" alt=\"Alcon Logo\" style=\"width: 30px; height: 50px; margin-right: 10px; mix-blend-mode: multiply; filter: contrast(2);\">"
				+ "<h2 style=\"display: inline; font-size: 2rem;\">Alcon</h2>"
				+ "</div>"
				+ "<h2 style=\"color: #007bff;\">Hello " + user.getName() + ",</h2>"
				+ "<p style=\"font-size: 16px;\">Thanks for signing up with Alcon. We're excited to have you on board! To get started, please verify your email address by clicking the button below:</p>"
				+ "<div style=\"text-align: center; margin-top: 20px;\">"
				+ "<a href=\"" + verifyURL + "\" style=\"display: inline-block; background-color: #007bff; color: white; border: none; border-radius: 5px; padding: 10px 20px; font-size: 16px; text-decoration: none;\">Verify</a>"
				+ "</div>"
				+ "<p style=\"font-size: 16px; margin-top: 20px;\">If you encounter any issues while verifying your email, please don't hesitate to reach out to us at <a href=\"mailto:pratikshawakekar94@gmail.com\" style=\"color: #007bff;\">pratikshawakekar94@gmail.com</a>.</p>"
				+ "<p style=\"font-size: 16px;\">Best regards,<br>"
				+ "The Alcon Team</p>"
				+ "</div>";

String content = "<html><body style=\"font-family: Arial, sans-serif;\">" + emailContent + "</body></html>"
		+"<p>Thank you,<br>" + "Alcon.</p>";

		MimeMessage message = mailSender.createMimeMessage();
		MimeMessageHelper helper = new MimeMessageHelper(message);
			helper.setFrom("pratikshawakekar94@gmail.com", senderName);
			helper.setTo(user.getEmail());
			helper.setSubject(subject);
			helper.setText(content, true);
			mailSender.send(message);
	}


	private String verificationCode(User user){
		Optional<VerificationCode> code = verificationRepository.findByUser(user);
		return code.map(VerificationCode::getVerificationToken).orElse(null);
	}

	@Override
	public void verifyUser(String username, String verificationCode) throws UserException {
		Optional<User> userOptional = repo.findByEmail(username);
		if (userOptional.isEmpty()) {
			throw new UserException("Could not find user");
		}

		Optional<VerificationCode> code = verificationRepository.findByUser(userOptional.get());
		if (code.get().getVerificationToken().equals(verificationCode) && code.get().getUser().equals(userOptional.get())) {
			userOptional.get().setIsEnable(true);
			repo.save(userOptional.get());
		} else {
			throw new UserException("Something went wrong");
		}
	}

	private String generateRandomString() {
		SecureRandom secureRandom = new SecureRandom();
		byte[] randomBytes = new byte[50];
		secureRandom.nextBytes(randomBytes);
		return Base64.getUrlEncoder().withoutPadding().encodeToString(randomBytes).substring(0, 50);
	}


	@Override
	public String getSiteURL(HttpServletRequest request) {
		String siteURL = request.getRequestURL().toString();
		return siteURL.replace(request.getServletPath(), "");
	}
	
	 //forgot password email

    @Override
    public String forgotPassword(String email) {

        User user = repo.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with this email: " + email));

        if (user.getIsEnable()) {
            try {
                var generateRandomString = generateRandomString();
                user.setForgetToken(generateRandomString);
                user.setForgetTokenExpiration(LocalDateTime.now().plusHours(1));
                repo.save(user);
                //send email notification
                resetPasswordMail(user);
            } catch (Exception e) {
                throw new UsernameNotFoundException("Unable to send set password email please try again...");
            }
        } else {
            throw new UsernameNotFoundException("Account not verified so cannot send reset password email");
        }
        return "Please check your email to set new Password.";
    }
	


    @Override
    public String setPassword(String email, String newPassword) {

        User user = repo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with this email: " + email));

        String encodedPassword = passwordEncoder.encode(newPassword);

        user.setPassword(encodedPassword);
        repo.save(user);

        return "New Password set successfully, continue login with new password";
    }

    @Override
    public String resetPassword(String token, ForgotPassword password) {
System.out.println("Reset Passn called");
        Optional<User> user = repo.findByForgetToken(token);

        if (user.isPresent()) {
            String encodedPassword = new BCryptPasswordEncoder().encode(password.getNewPassword());
            user.get().setPassword(encodedPassword);
            user.get().setForgetToken(null);
            user.get().setForgetTokenExpiration(null);
            repo.save(user.get());
            return "User password changed successfully";
        } else {
            return "Invalid or expired token";
        }
        }


    public void resetPasswordMail(User user) throws Exception {
        String senderName = "Forget New Password";
        String subject = "Reset Your New Password";

        String resetPassword = "http://localhost:3000/reset/" +user.getForgetToken();

        String content = "Dear " + user.getName() + ",<br>"
                + "We have received a request to reset the password for the Alcon account.<br>"
        		+"You can reset your password by clicking the link below: ";
        content += "<h3><a href=\"" + resetPassword + "\"><button style=\"background-color: blue; color: white;\">Reset your password</button><a></h3>";
        content += "Reset password link will be expired within 1 hrs. <br/>"
        +"If you did not request a password reset, you can ignore this email. Your password will not be changed.<br>"
        +"<p>Thank you,<br>" + "Alcon.</p>";

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message);
        helper.setFrom("pratikshawakekar94@gmail.com", senderName);
        helper.setTo(user.getEmail());
        helper.setSubject(subject);
        helper.setText(content, true);
        mailSender.send(message);
    }

    
    @Override
    public User getCurrentUser() {
    	org.springframework.security.core.Authentication authentication=SecurityContextHolder.getContext().getAuthentication();
		
    	if(authentication == null || !authentication.isAuthenticated() ) {	
    		return null;		
    	}
    	String username = authentication.getName();
    	return repo.findByEmail(username).get();
    }
    
	@Override
	public void saveUser(User user) {
		
		repo.save(user);
		
	}


	@Override
	public User registerMsLoginUser(User user) throws UserException {
	    System.out.printf("registered user ------ ",user);


	    user.setEmail(user.getUsername());


	    
	    System.out.println("Email , Username , Name"+ user.getEmail()+ user.getUsername()+user.getName());



	    String encodedPassword;
	   
	    if (user.getPassword() == null || user.getPassword().isEmpty()) {
	       
			// Generate a random 32-character password
	        String generatedPassword = PASSWORD;
	        System.out.println("generatedPassword....."+generatedPassword);
	        encodedPassword = passwordEncoder.encode(generatedPassword);
	    } else {
	        encodedPassword = passwordEncoder.encode(user.getPassword());
	    }

	    User newUser = new User();

	    newUser.setEmail(user.getUsername());
	    
	    newUser.setPassword(encodedPassword);
	    newUser.setUsername(user.getUsername());
	    newUser.setName(user.getName());

	    newUser.setIsEnable(true);
	    System.out.println(newUser);

	    VerificationCode verificationCode = new VerificationCode();
	    verificationCode.setVerificationToken(generateRandomString());
	    verificationCode.setUser(newUser);

	    verificationRepository.save(verificationCode);

	    return repo.save(newUser);
	}

	private String generateRandomPassword(int length) {
	    String allowedCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	    StringBuilder randomPassword = new StringBuilder();

	    for (int i = 0; i < length; i++) {
	        int randomIndex = (int) (Math.random() * allowedCharacters.length());
	        char randomChar = allowedCharacters.charAt(randomIndex);
	        randomPassword.append(randomChar);
	    }

	    return randomPassword.toString();
	}


	@Override
	public User loginUser(User user) throws UserException {
	    // Check if the user exists in the repository using the provided email
	    Optional<User> existingUser = repo.findByEmail(user.getEmail());
	    User registeredUser;
	    if (existingUser.isPresent()) {
	         registeredUser = existingUser.get();

	    } else {
	        throw new UserException("User not found.");
	    }
		return registeredUser;
	}




}

