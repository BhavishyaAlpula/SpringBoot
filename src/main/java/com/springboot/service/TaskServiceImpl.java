package com.springboot.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.springboot.dto.TasksDto;
import com.springboot.model.Tasks;
import com.springboot.model.Users;
import com.springboot.repository.TasksRepository;
import com.springboot.repository.UserRepository;

@Service
public class TaskServiceImpl implements TaskService {
	
	@Autowired
	private TasksRepository tasksRepo;
	
	@Autowired
	private UserRepository userRepo;

	@Override
	public Page<Tasks> getTasksOfUser(Integer userId,int page,int size) {
		Pageable pageable = PageRequest.of(page, size);
		
		Page<Tasks> tasks = tasksRepo.findByUsers(userRepo.getById(userId),pageable);
		
		return tasks;
	}
	
	@Override
	public int getTaskCountForUser(Integer userId) {
		
		Users user=userRepo.getById(userId);
		
		int tasks = tasksRepo.countByUsers(user);
		
		return tasks;
	}
	@Override
	public void addTasks(TasksDto tasksDto) {
		
		tasksRepo.save(convertToTasks(tasksDto));
	}
	
	@Override
	public Tasks getTaskDetails(Integer taskId) {
		
		Tasks task=tasksRepo.getById(taskId);
		
		return task;
	}
	
	@Override
	public void updateTasks(TasksDto tasksDto,Integer taskId) {
		Tasks task=tasksRepo.getById(taskId);
		
		task.setTaskName(tasksDto.getTaskName());
		task.setDescription(tasksDto.getDescription());
		task.setDueDate(tasksDto.getDueDate());
		
		tasksRepo.save(task);
	}
	public Tasks convertToTasks(TasksDto tasksDto)
	{
		Tasks tasks=new Tasks();
		tasks.setTaskName(tasksDto.getTaskName());
		tasks.setDescription(tasksDto.getDescription());
		tasks.setDueDate(tasksDto.getDueDate());
		
		tasks.setUsers(userRepo.getById(tasksDto.getUserId()));
		
		return tasks;
	}
	
	@Override
	public void deleteTask(Integer taskId) {
		tasksRepo.deleteById(taskId);
	}
}
