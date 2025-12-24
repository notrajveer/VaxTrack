package com.example.tracker;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "patients")
public class Patient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String patientId;
    
    @Column(nullable = false)
    private String patientName;
    
    @Column
    private String fatherName;
    
    @Column
    private String motherName;
    
    @Column
    private LocalDate dateOfBirth;
    
    @Column
    private String gender;
    
    @Column
    private String bloodGroup;
    
    @Column
    private String phoneNumber;
    
    @Column
    private String emergencyContact;
    
    @Column
    private String emergencyContactRelationship;
    
    @Column
    private String emailAddress;
    
    @Column(length = 500)
    private String address;
    
    @Column(unique = true)
    private String cardId;
    
    @Column
    private String allergies;
    
    @Column(length = 1000)
    private String medicalHistory;
    
    @Column(length = 1000)
    private String currentMedications;
    
    @Column(length = 1000)
    private String previousSurgeriesIllnesses;
    
    @Column
    private String insuranceProvider;
    
    @Column
    private String policyNumber;
    
    @Column
    private String groupNumber;
    
    @Column
    private LocalDateTime registrationDate;
    
    public Patient() {
        this.registrationDate = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getPatientId() { return patientId; }
    public void setPatientId(String patientId) { this.patientId = patientId; }
    
    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }
    
    public String getFatherName() { return fatherName; }
    public void setFatherName(String fatherName) { this.fatherName = fatherName; }
    
    public String getMotherName() { return motherName; }
    public void setMotherName(String motherName) { this.motherName = motherName; }
    
    public LocalDate getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }
    
    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }
    
    public String getBloodGroup() { return bloodGroup; }
    public void setBloodGroup(String bloodGroup) { this.bloodGroup = bloodGroup; }
    
    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
    
    public String getEmergencyContact() { return emergencyContact; }
    public void setEmergencyContact(String emergencyContact) { this.emergencyContact = emergencyContact; }
    
    public String getEmergencyContactRelationship() { return emergencyContactRelationship; }
    public void setEmergencyContactRelationship(String emergencyContactRelationship) { this.emergencyContactRelationship = emergencyContactRelationship; }
    
    public String getEmailAddress() { return emailAddress; }
    public void setEmailAddress(String emailAddress) { this.emailAddress = emailAddress; }
    
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    
    public String getCardId() { return cardId; }
    public void setCardId(String cardId) { this.cardId = cardId; }
    
    public String getAllergies() { return allergies; }
    public void setAllergies(String allergies) { this.allergies = allergies; }
    
    public String getMedicalHistory() { return medicalHistory; }
    public void setMedicalHistory(String medicalHistory) { this.medicalHistory = medicalHistory; }
    
    public String getCurrentMedications() { return currentMedications; }
    public void setCurrentMedications(String currentMedications) { this.currentMedications = currentMedications; }
    
    public String getPreviousSurgeriesIllnesses() { return previousSurgeriesIllnesses; }
    public void setPreviousSurgeriesIllnesses(String previousSurgeriesIllnesses) { this.previousSurgeriesIllnesses = previousSurgeriesIllnesses; }
    
    public String getInsuranceProvider() { return insuranceProvider; }
    public void setInsuranceProvider(String insuranceProvider) { this.insuranceProvider = insuranceProvider; }
    
    public String getPolicyNumber() { return policyNumber; }
    public void setPolicyNumber(String policyNumber) { this.policyNumber = policyNumber; }
    
    public String getGroupNumber() { return groupNumber; }
    public void setGroupNumber(String groupNumber) { this.groupNumber = groupNumber; }
    
    public LocalDateTime getRegistrationDate() { return registrationDate; }
    public void setRegistrationDate(LocalDateTime registrationDate) { this.registrationDate = registrationDate; }
}
