package com.ats.resumeanalyzer.repository;

import com.ats.resumeanalyzer.model.Resume;
import com.ats.resumeanalyzer.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ResumeRepository extends JpaRepository<Resume, Long> {
    List<Resume> findByUserOrderByUploadedAtDesc(User user);
    Optional<Resume> findByIdAndUser_Username(Long id, String username);
}
