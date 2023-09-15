package com.alcon.controller;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.view.RedirectView;


import com.alcon.dto.ForgotPassword;
import com.alcon.exception.UserException;
import com.alcon.model.User;
import com.alcon.repository.UserRepository;
import com.alcon.services.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

@RestController
public class AuthController {
	
	@Autowired
	private UserRepository userRepo;
	
	@Autowired
	private UserService userService;
	
	@Autowired
	private UserRepository userRepository;
	
	final String  PASSWORD ="zxcvlkjhgfdsabnm";
	@GetMapping("/signin")
	public ResponseEntity<User> signinHandler(Authentication auth) throws UserException{
		


		System.out.println("Auth data ......."+auth);

		
		 try {
		        User user = userRepo.findByEmail(auth.getName()).get();
		        if(user.getIsEnable()==false) {
		        	 throw new UserException("User account does not verified");
		        }
		         //   .orElseThrow(() -> new BadCredentialsException("Invalid Username or password"));
		       
		        		return new ResponseEntity<>(user, HttpStatus.ACCEPTED);
		    } catch (UserException ex) {
		        throw new UserException("Invalid username or password");
		    }
	
	}
	
	
	
	@PostMapping("/signup")
	public ResponseEntity<User> registerUserHandler(@RequestBody User user,HttpServletRequest request) throws Exception {

		User createdUser=userService.registerUser(user);
		String siteUrl = userService.getSiteURL(request);
		if (createdUser != null){
			userService.sendVerificationEmail(createdUser, siteUrl);
		}
		System.out.println("createdUser --- "+createdUser);
		
		return new ResponseEntity<User>(createdUser,HttpStatus.CREATED);
	}
	
	@PostMapping("/signup/ms")
	public ResponseEntity<?> registerMsLoginUserHandler(@RequestBody User user, HttpServletRequest request) throws Exception {

		System.out.println("user......."+user);
		Optional<User> existingUser = userRepository.findByEmail(user.getUsername());
		System.out.println("existingUser......."+existingUser);
		User createdUser = null;
		if (existingUser.isPresent()) {            
            HttpHeaders headers = new HttpHeaders();
            headers.setBasicAuth(user.getUsername(), PASSWORD);
            
            RestTemplate restTemplate = new RestTemplate();
            
            ResponseEntity<String> response = restTemplate.exchange(
                    "http://localhost:5454/signin",  // Replace with the actual URL
                    HttpMethod.GET,
                    new HttpEntity<>(headers),
                    String.class  // Replace with the expected response type
                );
            
            String responseBody = response.getBody();
            ObjectMapper objectMapper = new ObjectMapper(); // You need to import the ObjectMapper class
            User signedInUser = objectMapper.readValue(responseBody, User.class);

            
            HttpHeaders responseHeaders = new HttpHeaders();
            responseHeaders.addAll("Authorization", response.getHeaders().get("Authorization"));
            responseHeaders.addAll("X-Content-Type-Options", response.getHeaders().get("X-Content-Type-Options"));
            responseHeaders.addAll("X-XSS-Protection", response.getHeaders().get("X-XSS-Protection"));
            
            return ResponseEntity.status(HttpStatus.ACCEPTED)
                    .headers(responseHeaders)
                    .body(signedInUser);

        } else {
		
		 createdUser=userService.registerMsLoginUser(user);
		 
//		String siteUrl = userService.getSiteURL(request);
		if (createdUser != null){
//			userService.sendVerificationEmail(createdUser, siteUrl);
			
			 HttpHeaders headers = new HttpHeaders();
	            headers.setBasicAuth(user.getUsername(), PASSWORD);
	            
	            RestTemplate restTemplate = new RestTemplate();
	            
	            ResponseEntity<String> response = restTemplate.exchange(
	                    "http://localhost:5454/signin",  // Replace with the actual URL
	                    HttpMethod.GET,
	                    new HttpEntity<>(headers),
	                    String.class  // Replace with the expected response type
	                );
	            
	            String responseBody = response.getBody();
	            ObjectMapper objectMapper = new ObjectMapper(); // You need to import the ObjectMapper class
	            User signedInUser = objectMapper.readValue(responseBody, User.class);

	            
	            HttpHeaders responseHeaders = new HttpHeaders();
	            responseHeaders.addAll("Authorization", response.getHeaders().get("Authorization"));
	            responseHeaders.addAll("X-Content-Type-Options", response.getHeaders().get("X-Content-Type-Options"));
	            responseHeaders.addAll("X-XSS-Protection", response.getHeaders().get("X-XSS-Protection"));
	            
	            return ResponseEntity.status(HttpStatus.ACCEPTED)
	                    .headers(responseHeaders)
	                    .body(signedInUser);
			
			
		}
		System.out.println("createdUser --- "+createdUser);
		
        }
//		System.out.println("createdUser --- "+createdUser);
		
		 return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
	}
	
	
	
	@GetMapping("/verify")
	public RedirectView varifyAccount(@RequestParam String username,@RequestParam String verificationCode) throws UserException {
		userService.verifyUser(username,verificationCode);
		return new RedirectView("http://localhost:3000/login");
	}
	
	
	@PutMapping("/forgotPassword")
	public ResponseEntity<String> forgotPassword(@RequestParam String email){
		return new ResponseEntity<>(userService.forgotPassword(email), HttpStatus.OK);
	}
	

	@PostMapping("/resetPassword/{token}")
	public ResponseEntity<String> resetPassword(@PathVariable String token , @RequestBody ForgotPassword password){
		System.out.println("Forgot password called");
		
		if (!password.getNewPassword().equals(password.getConformPassword())) {
			return ResponseEntity.badRequest().body("Passwords do not match");
		}
		return new ResponseEntity<>(userService.resetPassword(token,password), HttpStatus.OK);
	}
	
	 @GetMapping("/logout")
	    public ModelAndView logout(Authentication auth) {
	        if (auth != null) {
	           
	            SecurityContextHolder.clearContext();
	            HttpServletRequest request = null;
				// You might also want to invalidate the session:
	            HttpSession session = getSession();
	            if (session != null) {
	                session.invalidate();
	            }
	        }
	        // Redirect the user to a logged-out page or back to the homepage.
	        RedirectView redirectView = new RedirectView("/login", true);
	        return new ModelAndView(redirectView);
	    }
	 private HttpSession getSession() {
	        ServletRequestAttributes attrs = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
	        if (attrs != null) {
	            return attrs.getRequest().getSession(false);
	        }
	        return null;
	    }

	

}
