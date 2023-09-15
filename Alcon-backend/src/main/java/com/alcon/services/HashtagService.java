package com.alcon.services;

import java.util.List;

import com.alcon.model.Hashtag;

public interface HashtagService {
	List<Hashtag> findHashtagsByPrefix(String prefix);

}
