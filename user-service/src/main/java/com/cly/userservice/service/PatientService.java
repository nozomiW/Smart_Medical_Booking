package com.cly.userservice.service;

import com.cly.userservice.entity.Patient;

import java.util.List;

public interface PatientService {
    void insertPatient(String userId, Patient patient);
    List<Patient> getPatients(String userId);
}
