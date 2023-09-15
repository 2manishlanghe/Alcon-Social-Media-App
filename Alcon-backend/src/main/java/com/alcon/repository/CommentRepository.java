package com.alcon.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.alcon.model.Comments;

@Repository
public interface CommentRepository extends JpaRepository<Comments, Integer> {

}
