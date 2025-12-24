package com.example.tracker;

import jakarta.persistence.*;

@Entity
@Table(name = "settings")
public class Settings {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String clinicName;
    
    @Column
    private String clinicPhone;
    
    @Column
    private String clinicEmail;
    
    @Column
    private Integer defaultReminderDays;
    
    public Settings() {
        this.clinicName = "Health Care Clinic";
        this.clinicPhone = "555-1234";
        this.clinicEmail = "clinic@healthcare.com";
        this.defaultReminderDays = 7;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getClinicName() { return clinicName; }
    public void setClinicName(String clinicName) { this.clinicName = clinicName; }
    
    public String getClinicPhone() { return clinicPhone; }
    public void setClinicPhone(String clinicPhone) { this.clinicPhone = clinicPhone; }
    
    public String getClinicEmail() { return clinicEmail; }
    public void setClinicEmail(String clinicEmail) { this.clinicEmail = clinicEmail; }
    
    public Integer getDefaultReminderDays() { return defaultReminderDays; }
    public void setDefaultReminderDays(Integer defaultReminderDays) { this.defaultReminderDays = defaultReminderDays; }
}
