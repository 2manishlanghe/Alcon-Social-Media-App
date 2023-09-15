package com.alcon.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.alcon.model.Hashtag;
import com.alcon.repository.HashtagRepository;

@Service
public class HashtagServiceImplementation implements HashtagService {
		
	@Autowired
	private HashtagRepository hashtagRepository;
	
	@Override
    public List<Hashtag> findHashtagsByPrefix(String prefix) {
        return hashtagRepository.findByNameStartingWith(prefix);
    }
}
