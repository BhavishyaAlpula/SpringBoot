package com.springboot.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import com.springboot.dto.UserDto;
import com.springboot.model.Users;
import com.springboot.service.TaskService;
import com.springboot.service.UserService;

@Controller
public class UserController {

	@Autowired
	private UserService userService;
	
	@Autowired
	private TaskService taskService;
	
	@Autowired
	private BaseController baseController;
	
	@GetMapping("/getUsers")
	public String getUsers(Model model,@RequestParam(defaultValue = "0")int page,@RequestParam(defaultValue = "5")int size)
	{
		
		Integer userId = baseController.commonAttributes(model);
		baseController.commonTaskAttributes(userId, model, page, size);
		Page<Users> users = userService.getUsers(page,size);

		Map<Integer, Integer>taskCounts=new HashMap<>();
		for (Users user : users) {
		    int count = taskService.getTaskCountForUser(user.getId());
		    taskCounts.put(user.getId(), count);
		}
		
		model.addAttribute("tasksCount", taskCounts);
		model.addAttribute("users", users.getContent());

		model.addAttribute("totalPages", users.getTotalPages());
		model.addAttribute("currentPage", page);

		return "users";
	}
	
	@GetMapping("/editUser")
	public String editUser(Model model)
	{
//		model.addAttribute("userDetails", userDetails);
		return "editUser";
	}
	
	@PostMapping("/updateUser")
	public ResponseEntity<?> updateUser(@RequestParam("userId") Integer userId,@RequestBody UserDto userDto)
	{

		userService.updateUser(userDto,userId);
		
		return ResponseEntity.ok("User updated successfully");
	}
	
	@PostMapping("/deleteUser")
	public ResponseEntity<?> deleteUser(@RequestBody Integer userId)
	{
		userService.deleteUser(userId);
		return ResponseEntity.ok().build();
	}
}
