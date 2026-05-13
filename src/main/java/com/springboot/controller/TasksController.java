package com.springboot.controller;

import java.security.Principal;
import java.sql.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.springboot.dto.TasksDto;
import com.springboot.model.Tasks;
import com.springboot.model.Users;
import com.springboot.service.TaskService;
import com.springboot.service.UserService;

@Controller
public class TasksController {
	
	@Autowired
	private TaskService taskService;
	
	@Autowired
	private UserService userService;

	@Autowired
	private BaseController baseController;
	
	@GetMapping("openTasks")
	public String openTasksOfUser(@RequestParam Integer userId,Model model,@RequestParam(defaultValue = "0")int page,@RequestParam(defaultValue = "5")int size)
	{
		baseController.commonAttributes(model);
		System.out.println("Users Id"+userId);
		
		Page<Tasks> tasks = taskService.getTasksOfUser(userId,page,size);
		
		
		model.addAttribute("userId",userId);
		System.out.println("UserId"+userId);
		
		Users userDetails = userService.getUserDetails(userId);
		model.addAttribute("UsersName",userDetails.getName());
		model.addAttribute("tasks", tasks.getContent());
		model.addAttribute("tasksPage", tasks);
		model.addAttribute("currentPage", page);
		model.addAttribute("totalPages", tasks.getTotalPages());
		
		return "usersTasks";
	}
	
	@PostMapping("addTask")
	public ResponseEntity<?> addTasks(@RequestBody TasksDto tasksDto,Principal principal,@RequestParam("userId") Integer id)
	{
		//Integer id = userService.getId(principal.getName());
		
		tasksDto.setUserId(id);
		System.out.println(id);
		taskService.addTasks(tasksDto);
		return ResponseEntity.ok().build();
	}
	
	
	@GetMapping("editTasks")
	public String editTask(@RequestParam Integer taskId,Model model)
	{
		Tasks taskDetails = taskService.getTaskDetails(taskId);
		System.out.println("TaskId: "+taskDetails.getId());
		
		model.addAttribute("taskDetails", taskDetails);
		model.addAttribute("taskOwnerUserId",taskDetails.getUsers().getId());
		return "editTasks";
	}
	
	@PostMapping("updateTask")
	public ResponseEntity<?> updateTask(@RequestBody TasksDto tasksDto)
	{
		taskService.updateTasks(tasksDto,tasksDto.getTaskId());
		System.out.println(ResponseEntity.ok());
		return ResponseEntity.ok().build();
	}
	
	@PostMapping("deleteTask")
	public ResponseEntity<?> deleteTask(@RequestBody Integer taskId)
	{
		taskService.deleteTask(taskId);
		return ResponseEntity.ok().build();
	}
}
