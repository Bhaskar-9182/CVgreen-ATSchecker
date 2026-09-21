package com.ats.resumeanalyzer.repository;

import com.ats.resumeanalyzer.model.AnalysisReport;
import com.ats.resumeanalyzer.model.Resume;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AnalysisReportRepository extends JpaRepository<AnalysisReport, Long> {
    List<AnalysisReport> findByResumeOrderByAnalyzedAtDesc(Resume resume);
    Optional<AnalysisReport> findTopByResumeOrderByAnalyzedAtDesc(Resume resume);
    List<AnalysisReport> findAllByOrderByAnalyzedAtDesc();
}
