package com.taskmanager.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI taskManagerOpenAPI() {
        return new OpenAPI()
                .info(new Info().title("Task Manager API")
                        .description("Task Manager Application REST API Documentation")
                        .version("v1.0.0")
                        .contact(new Contact().name("Development Team"))
                        .license(new License().name("Apache 2.0").url("http://springdoc.org")));
    }
}
