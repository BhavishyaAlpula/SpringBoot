package com.springboot.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.springboot.dto.RolesDto;
import com.springboot.model.Roles;
import com.springboot.repository.RolesRepository;

@Service
public class RolesServiceImpl implements RolesService{
	
	@Autowired
	private RolesRepository roleRepo;

	@Override
	public boolean isRolePresent(String roleName) {
		
		Roles roles = roleRepo.findByRoleName(roleName);
		if(roles != null)
		{
			return true;
		}
		return false;
	}
	
	@Override
	public void addRole(RolesDto roleDto) {
		
		roleRepo.save(convertToEntity(roleDto));
	}
	
	public Roles convertToEntity(RolesDto roleDto)
	{
		Roles roles=new Roles();
		roles.setRoleName(roleDto.getRoleName());
		
		return roles;
	}
}
