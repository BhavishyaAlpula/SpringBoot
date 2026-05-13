package com.springboot.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.springboot.model.Roles;

public interface RolesRepository extends JpaRepository<Roles, Integer> {

	Roles findByRoleName(String roleName);

}
