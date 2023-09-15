package com.alcon;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.fail;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.alcon.exception.UserException;
import com.alcon.model.User;
import com.alcon.model.VerificationCode;
import com.alcon.repository.UserRepository;
import com.alcon.repository.VerificationRepository;
import com.alcon.services.UserServiceImplementation;

import jakarta.mail.internet.MimeMessage;
import jakarta.servlet.http.HttpServletRequest;

//@RunWith(MockitoJUnitRunner.class)
@SpringBootTest
public class UserServiceImplementationTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private VerificationRepository verificationRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JavaMailSender mailSender;

    @Mock
    private HttpServletRequest httpServletRequest;

    @Mock
    private MimeMessage mimeMessage;

    @InjectMocks
    private UserServiceImplementation userService;

    @Test
    public void testRegisterUser() throws UserException {
        // Prepare test data
        User user = new User();
        user.setEmail("test@example.com");
        user.setPassword("password");
        user.setUsername("testuser");
        user.setName("Test User");

        // Mock repository method calls
        when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.empty());
        when(userRepository.findByUsername(user.getUsername())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(user.getPassword())).thenReturn("encodedPassword");

        // Perform the registration
        User registeredUser = userService.registerUser(user);

        // Verify the result
        assertNotNull(registeredUser);
        assertEquals(user.getEmail(), registeredUser.getEmail());
        assertEquals("encodedPassword", registeredUser.getPassword());
        assertEquals(user.getUsername(), registeredUser.getUsername());
        assertEquals(user.getName(), registeredUser.getName());

        // Verify that save method is called on the repository
        verify(userRepository).save(user);
    }

    @Test
	public void testRegisterUserWithExistingEmail() throws UserException {
		// Mock input data
		User user = new User();
		user.setEmail("existing@example.com");
		
		// Mock repository behavior
		when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));
		
		// Perform the registration
		try {
			userService.registerUser(user);
			fail("Expected UserException to be thrown");
		} catch (UserException e) {
			// Verify that the expected exception is thrown
			assertEquals("Email Already Exist Try With Another Email", e.getMessage());
		}
		
		// Verify repository interactions
		verify(userRepository, times(1)).findByEmail(user.getEmail());
		verify(userRepository, never()).save(any(User.class));
		verify(verificationRepository, never()).save(any(VerificationCode.class));
	}


    @Test
    public void testRegisterUserWithExistingUsername() throws UserException {
        // Prepare test data
        User user = new User();
        user.setUsername("testuser");

        // Mock repository method call to return a user with the same username
        when(userRepository.findByUsername(user.getUsername())).thenReturn(Optional.of(user));

        // Perform the registration (expecting UserException)
        userService.registerUser(user);
    }

    // Add more test cases for other methods in UserServiceImplementation class

}
