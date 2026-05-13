package com.springboot.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.springboot.dto.RolesDto;
import com.springboot.dto.UserDto;
import com.springboot.service.RolesService;
import com.springboot.service.UserService;

@Controller
public class SignupController {
	
	@Autowired
	private UserService userService;
	
	@Autowired
	private RolesService roleService;

	private static final Logger logger = LoggerFactory.getLogger(SignupController.class);
	
	@GetMapping("/signup")
	public String getSignup()
	{
		return "signup";
	}
	
	@PostMapping("/signup")
	public String addUser(@RequestParam("name")String name, @RequestParam("username")String username,
			@RequestParam("password") String password,@RequestParam("email")String email,@RequestParam("phno")Long phno,
			@RequestParam("roleName")String roleName)
	{
		logger.error("controller entered");
		UserDto userDto=new UserDto();
		
		RolesDto roleDto=new RolesDto();
		
		userDto.setName(name);
		userDto.setUsername(username);
		userDto.setPassword(password);
		userDto.setEmail(email);
		userDto.setPhno(phno);
		
		roleDto.setRoleName(roleName);
		if(!roleService.isRolePresent(roleName)) {
			roleService.addRole(roleDto);
		}
		
		userDto.setRoleName(roleDto.getRoleName());
		
		userService.addUser(userDto);
		
		return "login";
	}
}
