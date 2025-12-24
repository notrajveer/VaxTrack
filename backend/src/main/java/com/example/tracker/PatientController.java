package com.example.tracker;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/patients")
@CrossOrigin(origins = "*")
public class PatientController {
    
    @Autowired
    private PatientRepository patientRepository;
    
    @Autowired
    private VaccineRepository vaccineRepository;
    
    @GetMapping
    public ResponseEntity<List<Patient>> getAllPatients() {
        List<Patient> patients = patientRepository.findAll();
        patients.sort(Comparator.comparing(Patient::getRegistrationDate).reversed());
        return ResponseEntity.ok(patients);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Patient> getPatientById(@PathVariable Long id) {
        Optional<Patient> patient = patientRepository.findById(id);
        return patient.map(ResponseEntity::ok)
                     .orElseGet(() -> ResponseEntity.notFound().build());
    }
    
    @GetMapping("/by-patient-id/{patientId}")
    public ResponseEntity<Map<String, Object>> getPatientByPatientId(@PathVariable String patientId) {
        Optional<Patient> patient = patientRepository.findByPatientId(patientId);
        if (patient.isPresent()) {
            // Get all vaccines for this patient
            List<Vaccine> vaccines = vaccineRepository.findAll().stream()
                .filter(v -> patientId.equals(v.getPatientId()))
                .sorted(Comparator.comparing(Vaccine::getId).reversed())
                .toList();
            
            Map<String, Object> response = new HashMap<>();
            response.put("patient", patient.get());
            response.put("vaccines", vaccines);
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.notFound().build();
    }
    
    @GetMapping("/by-card-id/{cardId}")
    public ResponseEntity<Map<String, Object>> getPatientByCardId(@PathVariable String cardId) {
        Optional<Patient> patient = patientRepository.findByCardId(cardId);
        if (patient.isPresent()) {
            Patient p = patient.get();
            // Get all vaccines for this patient
            List<Vaccine> vaccines = vaccineRepository.findAll().stream()
                .filter(v -> p.getPatientId().equals(v.getPatientId()))
                .sorted(Comparator.comparing(Vaccine::getId).reversed())
                .toList();
            
            Map<String, Object> response = new HashMap<>();
            response.put("patient", p);
            response.put("vaccines", vaccines);
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.notFound().build();
    }
    
    @PostMapping
    public ResponseEntity<Patient> createPatient(@RequestBody Patient patient) {
        patient.setId(null); // Let database generate ID
        Patient savedPatient = patientRepository.save(patient);
        System.out.println("✓ Created new patient: " + savedPatient.getPatientName() + " (ID: " + savedPatient.getPatientId() + ")");
        return ResponseEntity.ok(savedPatient);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Patient> updatePatient(@PathVariable Long id, @RequestBody Patient patient) {
        if (patientRepository.existsById(id)) {
            patient.setId(id);
            Patient updatedPatient = patientRepository.save(patient);
            System.out.println("✓ Updated patient ID: " + id);
            return ResponseEntity.ok(updatedPatient);
        }
        return ResponseEntity.notFound().build();
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePatient(@PathVariable Long id) {
        if (patientRepository.existsById(id)) {
            patientRepository.deleteById(id);
            System.out.println("✓ Deleted patient ID: " + id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
