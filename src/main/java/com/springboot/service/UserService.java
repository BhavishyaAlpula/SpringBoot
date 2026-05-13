package com.springboot.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import com.springboot.dto.UserDto;
import com.springboot.model.Users;

@Service
public interface UserService {

	void addUser(UserDto userDto);

	Integer getId(String username);

	Users getUserDetails(Integer userId);

	void updateUser(UserDto userDto, Integer userId);

	void deleteUser(Integer userId);

	Page<Users> getUsers(int page, int size);

	
}
