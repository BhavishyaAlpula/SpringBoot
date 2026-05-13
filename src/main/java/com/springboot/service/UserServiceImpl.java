	package com.springboot.service;
	
	import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
	import org.slf4j.LoggerFactory;
	import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
	import org.springframework.stereotype.Service;
	
	import com.springboot.dto.UserDto;
	import com.springboot.model.Roles;
	import com.springboot.model.Users;
	import com.springboot.repository.RolesRepository;
	import com.springboot.repository.UserRepository;
	
	@Service
	public class UserServiceImpl implements UserService {
	
		@Autowired
		private UserRepository userRepo;
		
		@Autowired
		private RolesRepository roleRepo;
		
		@Autowired
		private BCryptPasswordEncoder passwordEncoder;
		
		private static final Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);
		
		@Override
		public Page<Users> getUsers(int page,int size) {
			
			Pageable pageable = PageRequest.of(page, size);
			Page<Users> users = userRepo.findUsersByRole("User",pageable);
			return users;
		}
		
		@Override
		public Users getUserDetails(Integer userId) {
			Optional<Users> userDetails = userRepo.findById(userId);
			
			if(userDetails.isPresent()) {
				Users users = userDetails.get();
				 return users;
			}
			else {
				return null;
			}
		}
		
		@Override
		public void addUser(UserDto userDto) {
			Users user=convertToEntity(userDto);
			user.setPassword(passwordEncoder.encode(userDto.getPassword()));
			userRepo.save(user);
		}
		
		@Override
		public Integer getId(String username) {
			Optional<Users> user = userRepo.findByUsername(username);
			
			if(user.isPresent())
			{
				return user.get().getId();
			}
			return null;
		}
		
		@Override
		public void updateUser(UserDto userDto, Integer userId) {
			Users user = getUserDetails(userId);
			if(userDto.getUsername()!=null){
				user.setUsername(userDto.getUsername());
			}
			if(userDto.getPassword()!=null) {
				user.setPassword(passwordEncoder.encode(userDto.getPassword()));
			}
			if(userDto.getName()!=null) {
				user.setName(userDto.getName());
			}
			if(userDto.getEmail()!=null) {
				user.setEmail(userDto.getEmail());
			}
			if(userDto.getPhno()!=null) {
				user.setPhno(userDto.getPhno());
			}
			userRepo.save(user);
		}
		
		
		@Override
		public void deleteUser(Integer userId) {
			userRepo.deleteById(userId);
		}
		
		public Users convertToEntity(UserDto userDto) {
			
		    Users user = new Users();
		    user.setName(userDto.getName());
		    user.setUsername(userDto.getUsername());
		    user.setPassword(userDto.getPassword());
		    user.setEmail(userDto.getEmail());
		    user.setPhno(userDto.getPhno());
		    
		    Roles role=roleRepo.findByRoleName(userDto.getRoleName());
		    user.setRole(role);
	
		    return user;
		}
	
		
		public UserDto convertToDto(Users user)
		{
			UserDto userDto=new UserDto();
			userDto.setName(user.getName());
			userDto.setUsername(user.getUsername());
			userDto.setPassword(user.getPassword());
			userDto.setEmail(user.getEmail());
			userDto.setPhno(user.getPhno());
			
			return userDto;
		}
	
	}
