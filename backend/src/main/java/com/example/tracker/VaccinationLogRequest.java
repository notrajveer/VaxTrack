package com.example.tracker;

public class VaccinationLogRequest {
    private String childId;
    private String vaccine;
    
    public VaccinationLogRequest() {}
    
    public VaccinationLogRequest(String childId, String vaccine) {
        this.childId = childId;
        this.vaccine = vaccine;
    }
    
    public String getChildId() {
        return childId;
    }
    
    public void setChildId(String childId) {
        this.childId = childId;
    }
    
    public String getVaccine() {
        return vaccine;
    }
    
    public void setVaccine(String vaccine) {
        this.vaccine = vaccine;
    }
}
