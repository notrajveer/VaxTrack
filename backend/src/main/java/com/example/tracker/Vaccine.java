package com.example.tracker;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "vaccines")
public class Vaccine {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String patientName;
    
    @Column(nullable = false)
    private String vaccineName;
    
    @Column
    private String cardId;
    
    @Column(unique = true)
    private String patientId;
    
    @Column
    private LocalDate dueDate;
    
    @Column
    private LocalDate administeredDate;
    
    @Column
    private String status;
    
    @Column
    private String dosage;
    
    @Column
    private String batchNumber;
    
    @Column(length = 1000)
    private String notes;
    
    @Column
    private int reminderDays;
    
    @Column
    private String patientPhoneNumber;
    
    @Column
    private String parentName;
    
    public Vaccine() {}
    
    public Vaccine(Long id, String patientName, String vaccineName, String cardId) {
        this.id = id;
        this.patientName = patientName;
        this.vaccineName = vaccineName;
        this.cardId = cardId;
        this.dueDate = LocalDate.now();
        this.administeredDate = LocalDate.now();
        this.status = "completed";
        this.dosage = "Standard";
        this.batchNumber = "AUTO-" + System.currentTimeMillis();
        this.notes = "Automatically generated record";
        this.reminderDays = 0;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }
    
    public String getVaccineName() { return vaccineName; }
    public void setVaccineName(String vaccineName) { this.vaccineName = vaccineName; }
    
    public String getCardId() { return cardId; }
    public void setCardId(String cardId) { this.cardId = cardId; }
    
    public String getPatientId() { return patientId; }
    public void setPatientId(String patientId) { this.patientId = patientId; }
    
    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }
    
    public LocalDate getAdministeredDate() { return administeredDate; }
    public void setAdministeredDate(LocalDate administeredDate) { this.administeredDate = administeredDate; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public String getDosage() { return dosage; }
    public void setDosage(String dosage) { this.dosage = dosage; }
    
    public String getBatchNumber() { return batchNumber; }
    public void setBatchNumber(String batchNumber) { this.batchNumber = batchNumber; }
    
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    
    public int getReminderDays() { return reminderDays; }
    public void setReminderDays(int reminderDays) { this.reminderDays = reminderDays; }
    
    public String getPatientPhoneNumber() { return patientPhoneNumber; }
    public void setPatientPhoneNumber(String patientPhoneNumber) { this.patientPhoneNumber = patientPhoneNumber; }
    
    public String getParentName() { return parentName; }
    public void setParentName(String parentName) { this.parentName = parentName; }
}
