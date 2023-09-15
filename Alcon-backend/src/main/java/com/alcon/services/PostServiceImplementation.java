package com.alcon.services;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.alcon.controller.PostController;
import com.alcon.dto.PostRequestDTO;
import com.alcon.dto.UserDto;
import com.alcon.exception.PostException;
import com.alcon.exception.UserException;
import com.alcon.model.Hashtag;
import com.alcon.model.Post;
import com.alcon.model.User;
import com.alcon.model.VisibilityMode;
import com.alcon.repository.HashtagRepository;
import com.alcon.repository.PostRepository;
import com.alcon.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class PostServiceImplementation implements PostService {
	
	private static final Logger LOGGER = LoggerFactory.getLogger(PostController.class);
	
	@Autowired
	private UserService userService;
	
	@Autowired
	private PostRepository postRepo;
	
	@Autowired
	private UserRepository userRepo;
	
	@Autowired
	private NotificationService notificationService;
	

	@Autowired
	private HashtagRepository hashtagRepository;
    
	
	
	public Post createPost(Post post, Integer userId, PostRequestDTO postDto) throws UserException {
	    User user = userService.findUserById(userId);
	    UserDto userDto = new UserDto();

	    userDto.setEmail(user.getEmail());
	    userDto.setUsername(user.getUsername());
	    userDto.setId(user.getId());
	    userDto.setName(user.getName());
	    userDto.setUserImage(user.getImage());

	    post.setUser(userDto);

	    Set<Hashtag> hashtags = extractHashtags(postDto.getCaption());

	    // Remove the hashtags from the caption to avoid duplication
	    String captionWithoutHashtags = postDto.getCaption().replaceAll("#\\w+", "").trim();
	    post.setCaption(captionWithoutHashtags);

	    post.setImage(postDto.getImage());
	    post.setLocation(postDto.getLocation());
	    post.setVisibility(postDto.getVisibility());
	    post.setCreatedAt(LocalDateTime.now());

	    // Append the extracted hashtags to the post caption
	    String updatedCaption = captionWithoutHashtags + " " + getHashtagsString(hashtags);
	    post.setCaption(updatedCaption.trim());

	    post.setHashtags(hashtags);

//	    if (post.getVisibility() == null) {
//	        post.setVisibility("public");
//	    }
//
//	    Post createdPost = postRepo.save(post);
	    
	    if (post.getVisibility() != null) {
			post.setVisibility(post.getVisibility());
		} else {
			post.setVisibility("Public");
		}
       Post createdPost =postRepo.save(post);
			
	    

	    return createdPost;
	}

	
    
	private Set<Hashtag> extractHashtags(String caption) {

        Set<Hashtag> hashtags = new HashSet<>();
        Pattern pattern = Pattern.compile("#\\w+");
        Matcher matcher = pattern.matcher(caption);
        
        while (matcher.find()) {
            String hashtagName = matcher.group().substring(1); // Remove the '#' symbol
            Hashtag hashtag = hashtagRepository.findByName(hashtagName);
            
            if (hashtag == null) {
                hashtag = new Hashtag();
                hashtag.setName(hashtagName);
                hashtagRepository.save(hashtag);
            }
            
            hashtags.add(hashtag);
        }
        
        return hashtags;
    }

    private String getHashtagsString(Set<Hashtag> hashtags) {
        StringBuilder hashtagsString = new StringBuilder();
        for (Hashtag hashtag : hashtags) {
            hashtagsString.append("#").append(hashtag.getName()).append(" ");
        }
        return hashtagsString.toString().trim();
    }
		

	
	@Override
	public List<Post> findPostByUserId(Integer userId) throws UserException {
		
		List<Post> posts=postRepo.findByUserId(userId);
		
		if(posts.size()>0) {
			return posts;
		}
		
		throw new UserException("This user don't have any post");
	}


	@Override
	public Post findePostById(Integer postId) throws PostException {
		Optional<Post> opt = postRepo.findById(postId);
		if(opt.isPresent()) {
			return opt.get();
		}
		throw new PostException("Post not exist with id: "+postId);
	}



	@Override
	public List<Post> findAllPost() {
		User currentUser = userService.getCurrentUser();

		List<Post> publicPosts = postRepo.findAllByVisibility();
		List<Post> allPosts = new ArrayList<>();
		if (currentUser != null) {

			List<Post> toFriendsPosts = postRepo.findAllByVisibilityAndUserIn("To-friends",currentUser.getFollowing());

			List<Post> currentUserfriends = postRepo.findByVisibilityAndUser_Id("To-friends",currentUser.getId());

			List<Post> onlyMePosts = postRepo.findPrivatePostsByUserEmail(currentUser.getEmail());

			allPosts.addAll(publicPosts);
			allPosts.addAll(toFriendsPosts);
			allPosts.addAll(onlyMePosts);
			allPosts.addAll(currentUserfriends);
		} else {
			allPosts.addAll(publicPosts);
		}
		return allPosts;
	}
	

	@Override
	public Post likePost(Integer postId, Integer userId) throws UserException, PostException  {
		
		User user= userService.findUserById(userId);
		
		UserDto userDto=new UserDto();
		
		userDto.setEmail(user.getEmail());
		userDto.setUsername(user.getUsername());
		userDto.setId(user.getId());
		userDto.setName(user.getName());
		userDto.setUserImage(user.getImage());
		
		Post post=findePostById(postId);
		post.getLikedByUsers().add(userDto);
	
		String msg = "liked your post";
		String ntype = "LIKE";
		
		notificationService.sendNotification(user.getId(), post.getId(),msg,ntype);
	
		return postRepo.save(post);
		
		
	}

	@Override
	public Post unLikePost(Integer postId, Integer userId) throws UserException, PostException  {
		
		User user= userService.findUserById(userId);
		UserDto userDto=new UserDto();
		
		userDto.setEmail(user.getEmail());
		userDto.setUsername(user.getUsername());
		userDto.setId(user.getId());
		userDto.setName(user.getName());
		userDto.setUserImage(user.getImage());
		
		Post post=findePostById(postId);
		post.getLikedByUsers().remove(userDto);
	
	
		
		return postRepo.save(post);
	}


	@Override
	public String deletePost(Integer postId, Integer userId) throws UserException, PostException {

		Post post =findePostById(postId);
		
		User user=userService.findUserById(userId);
		LOGGER.info(post.getUser().getId()+" ------ "+user.getId());
		if(post.getUser().getId().equals(user.getId())) {
			LOGGER.info("inside delete");
			postRepo.deleteById(postId);
		
		return "Post Deleted Successfully";
		}
		
		
		throw new PostException("You Dont have access to delete this post");
		
	}


//	@Override
//	public List<Post> findAllPostByUserIds(List<Integer> userIds) throws PostException, UserException {
//		
//		
//		List<Post> posts= postRepo.findAllPostByUserIds(userIds);
//		
//		if(posts.size()==0) {
//			throw new PostException("No Post Available of your followings");
//		}
//		
//		
//		return posts;
//	}
	

	
	public List<Post> findAllPostByUserIds(List<Integer> userIds) throws PostException, UserException {
		
		User currentUser = userService.getCurrentUser();
	    List<Post> posts = postRepo.findAllPostByUserIds(userIds);
	    List<Post> filteredPosts = new ArrayList<>();

	    if (posts.size() == 0) {
	        throw new PostException("No Post Available of your followings");
	    }

	    for (Post post : posts) {
	    	if (post.getUser().getId().equals(currentUser.getId())) {
	    	    filteredPosts.add(post);
	    	} else if (!post.getVisibility().equals("Only-me")) {
	    	    filteredPosts.add(post);
	    	}

	    }

	    return filteredPosts;
	}



	@Override
	public String savedPost(Integer postId, Integer userId) throws PostException, UserException {
		
		Post post=findePostById(postId);
		User user=userService.findUserById(userId);
		if(!user.getSavedPost().contains(post)) {
			user.getSavedPost().add(post);
			userRepo.save(user);
		}	
		
		return "Post Saved Successfully";
	}


	@Override
	public String unSavePost(Integer postId, Integer userId) throws PostException, UserException {
		Post post=findePostById(postId);
		User user=userService.findUserById(userId);
		
		if(user.getSavedPost().contains(post)) {
			user.getSavedPost().remove(post);
			userRepo.save(user);
		}
		
		return "Post Remove Successfully";
	}


	@Override
	public Post editPost(Post updatedPost) throws PostException {
		
			Post existingPost = postRepo.findById(updatedPost.getId()).orElseThrow(()-> new PostException("Post not found"));
			 existingPost.setCaption(updatedPost.getCaption());
			Post editedPost = postRepo.save(existingPost);
			
		 return editedPost ;
	}

	

}