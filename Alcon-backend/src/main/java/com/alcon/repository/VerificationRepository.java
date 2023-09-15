package com.alcon.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.alcon.model.User;
import com.alcon.model.VerificationCode;

import java.util.Optional;

@Repository
public interface VerificationRepository  extends JpaRepository<VerificationCode,Integer> {

    Optional<VerificationCode> findByUser(User user);


}
