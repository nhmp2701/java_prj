package edu.uth.manga;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class MangaManagementSystemApplication {
	public static void main(String[] args) {
		SpringApplication.run(MangaManagementSystemApplication.class, args);
	}
}