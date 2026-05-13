package com.springboot.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import com.springboot.dto.TasksDto;
import com.springboot.model.Tasks;

@Service
public interface TaskService {

	Page<Tasks> getTasksOfUser(Integer userId,int page, int size);

	void addTasks(TasksDto tasksDto);

	Tasks getTaskDetails(Integer taskId);

	void updateTasks(TasksDto tasksDto,Integer taskId);

	void deleteTask(Integer taskId);
	
	int getTaskCountForUser(Integer userId);

}
