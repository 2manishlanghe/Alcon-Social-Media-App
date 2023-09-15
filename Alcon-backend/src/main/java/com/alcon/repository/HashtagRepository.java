package com.alcon.repository;


import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.alcon.model.Hashtag;


public interface HashtagRepository extends JpaRepository<Hashtag, Long> {
		
	 public Hashtag findByName(String name);

	//public List<Hashtag> findByNameContaining(String name);

	public List<Hashtag> findByNameStartingWith(String prefix);

}
