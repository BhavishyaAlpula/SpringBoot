package com.springboot.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.springboot.model.Tasks;
import com.springboot.model.Users;
import com.springboot.service.TaskService;
import com.springboot.service.UserService;


@Controller
public class HomeController {

	@Autowired
	private UserService userService;
	
	@Autowired
	private TaskService taskService;
	
	@Autowired
	private BaseController baseController;
	
	@GetMapping("/home")
	public String getHome(@RequestParam(defaultValue = "0")int page,@RequestParam(defaultValue = "5")int size,Model model)
	{
		Integer userId = baseController.commonAttributes(model);
		
		baseController.commonTaskAttributes(userId, model, page, size);
		return "home";
	}
	
}
