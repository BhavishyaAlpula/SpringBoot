	package com.springboot.model;
	
	import java.util.List;
	
	import jakarta.persistence.CascadeType;
	import jakarta.persistence.Entity;
	import jakarta.persistence.GeneratedValue;
	import jakarta.persistence.GenerationType;
	import jakarta.persistence.Id;
	import jakarta.persistence.JoinColumn;
	import jakarta.persistence.ManyToOne;
	import jakarta.persistence.OneToMany;
	import jakarta.persistence.Table;
	
	@Entity
	@Table(name="users")
	public class Users {
	
		@Id
		@GeneratedValue(strategy = GenerationType.IDENTITY)
		private Integer id;
		private String name;
		private String username;
		private String password;
		private String email;
		private Long phno;
		
		@ManyToOne
		@JoinColumn(name="role_id")
		private Roles role;
		
		@OneToMany(mappedBy = "users", cascade = CascadeType.ALL)
		private List<Tasks> tasks;
		
		public Integer getId() {
			return id;
		}
		public void setId(Integer id) {
			this.id = id;
		}
		public String getName() {
			return name;
		}
		public void setName(String name) {
			this.name = name;
		}
		public String getUsername() {
			return username;
		}
		public void setUsername(String username) {
			this.username = username;
		}
		public String getPassword() {
			return password;
		}
		public void setPassword(String password) {
			this.password = password;
		}
		public String getEmail() {
			return email;
		}
		public void setEmail(String email) {
			this.email = email;
		}
		public Long getPhno() {
			return phno;
		}
		public void setPhno(Long phno) {
			this.phno = phno;
		}
		public Roles getRole() {
			return role;
		}
		public void setRole(Roles role) {
			this.role = role;
		}
		public List<Tasks> getTasks() {
			return tasks;
		}
		public void setTasks(List<Tasks> tasks) {
			this.tasks = tasks;
		}
		
	}
