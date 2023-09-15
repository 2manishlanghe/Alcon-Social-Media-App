package com.alcon.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {
	
	@GetMapping("/")
	public String homeControllerHandler() {
		
		return "welcome to alcon backend api";
		
	}

}
