package com.cly.userservice.controller;

import com.cly.userservice.entity.Patient;
import com.cly.userservice.service.PatientService;
import com.cly.userservice.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("user")
public class UserController {

    UserService userService;
    PatientService patientService;

    @Autowired
    public void setUserService(UserService userService) {
        this.userService = userService;
    }

    @Autowired
    public void setPatientService(PatientService patientService) {
        this.patientService = patientService;
    }

    @PostMapping("register")
    public String register(@RequestBody Map<String, String> body) {
        userService.register(body.get("phone"), body.get("password"));
        return "注册成功";
    }

    @PostMapping("login")
    public String login(@RequestBody Map<String, String> body) {
        return userService.login(body.get("phone"), body.get("password"));
    }

    @PostMapping("patient/insert")
    public String insertPatient(@RequestHeader("X-User-Id") String userId,
                                @RequestBody Patient patient) {
        patientService.insertPatient(userId, patient);
        return "添加成功";
    }

    @GetMapping("patient/list")
    public List<Patient> getPatients(@RequestHeader("X-User-Id") String userId) {
        return patientService.getPatients(userId);
    }
}

