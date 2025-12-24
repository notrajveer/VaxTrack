package com.example.tracker;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VaccineRepository extends JpaRepository<Vaccine, Long> {
    // JpaRepository provides built-in methods:
    // - findAll() - get all vaccines
    // - findById(Long id) - get vaccine by ID
    // - save(Vaccine vaccine) - create or update vaccine
    // - deleteById(Long id) - delete vaccine by ID
    // - count() - count all vaccines
    
    // You can add custom queries here if needed, for example:
    // List<Vaccine> findByCardId(String cardId);
    // List<Vaccine> findByStatus(String status);
}
