package com.example.tracker;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/settings")
@CrossOrigin(origins = "*")
public class SettingsController {
    
    @Autowired
    private SettingsRepository settingsRepository;
    
    @GetMapping
    public ResponseEntity<Settings> getSettings() {
        List<Settings> settingsList = settingsRepository.findAll();
        
        if (settingsList.isEmpty()) {
            // Create default settings if none exist
            Settings defaultSettings = new Settings();
            defaultSettings = settingsRepository.save(defaultSettings);
            return ResponseEntity.ok(defaultSettings);
        }
        
        // Return the first (and only) settings record
        return ResponseEntity.ok(settingsList.get(0));
    }
    
    @PutMapping
    public ResponseEntity<Settings> updateSettings(@RequestBody Settings settings) {
        List<Settings> settingsList = settingsRepository.findAll();
        
        Settings settingsToUpdate;
        if (settingsList.isEmpty()) {
            // Create new settings
            settingsToUpdate = new Settings();
        } else {
            // Update existing settings (there should only be one)
            settingsToUpdate = settingsList.get(0);
        }
        
        settingsToUpdate.setClinicName(settings.getClinicName());
        settingsToUpdate.setClinicPhone(settings.getClinicPhone());
        settingsToUpdate.setClinicEmail(settings.getClinicEmail());
        settingsToUpdate.setDefaultReminderDays(settings.getDefaultReminderDays());
        
        Settings savedSettings = settingsRepository.save(settingsToUpdate);
        return ResponseEntity.ok(savedSettings);
    }
}
