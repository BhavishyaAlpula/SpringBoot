package com.springboot.service;

import org.springframework.stereotype.Service;

import com.springboot.dto.RolesDto;

@Service
public interface RolesService {

	boolean isRolePresent(String roleName);

	void addRole(RolesDto roleDto);

}
