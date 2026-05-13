package com.springboot.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.springboot.model.Tasks;
import com.springboot.model.Users;

public interface TasksRepository extends JpaRepository<Tasks, Integer>{

	Page<Tasks> findByUsers(Users userId,Pageable page);

	int countByUsers(Users user);
}
