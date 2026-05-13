package com.springboot.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.springboot.model.Users;

public interface UserRepository extends JpaRepository<Users, Integer>{

	public Optional<Users> findByUsername(String username);

	@Query("SELECT u FROM Users u WHERE u.role.roleName = :roleName")
	public Page<Users> findUsersByRole(@Param("roleName") String User,Pageable page);

}
	