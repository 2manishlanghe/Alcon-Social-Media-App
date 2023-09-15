package com.alcon.services;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.alcon.repository.UserRepository;

@Service
public class UserUserDetailService implements UserDetailsService {
	
	@Autowired
	private UserRepository userRepo;
	

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
				
		Optional<com.alcon.model.User> opt=userRepo.findByEmail(username);
		
		if(opt.isPresent() && opt.get().getIsEnable()) {
			com.alcon.model.User user=opt.get();
			
			List<GrantedAuthority> authorities=new ArrayList<>();
			
			System.out.println("errrrr ----------- "+ username);
			
			return new User(user.getEmail(), user.getPassword(), authorities);
		}
		
			
			throw new UsernameNotFoundException("User not verified, please check your email & verify it"+ username);
		
	}

}
