package com.springboot.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;

import com.springboot.model.Tasks;
import com.springboot.model.Users;
import com.springboot.service.TaskService;
import com.springboot.service.UserService;

@Controller
public class BaseController {

	@Autowired
	private TaskService taskService;
	
	@Autowired
	private UserService userService;
	
	
	public Integer commonAttributes(Model model) {
		
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String username = authentication.getName();
		
		Integer userId = userService.getId(username);
		Users userDetails = userService.getUserDetails(userId);
		
		model.addAttribute("username", username);
		model.addAttribute("userDetails",userDetails);
		return userId;
	}
	
	public void commonTaskAttributes(Integer userId,Model model,int page,int size)
	{
		Page<Tasks> tasks = taskService.getTasksOfUser(userId,page,size);
		
		model.addAttribute("tasks", tasks.getContent()); //this will give only List not Page
		model.addAttribute("currentPage", page);
		model.addAttribute("totalPages", tasks.getTotalPages());
	}
}
