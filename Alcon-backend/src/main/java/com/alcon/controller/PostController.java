package com.alcon.controller;

import java.util.Arrays;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.alcon.dto.PostRequestDTO;
import com.alcon.exception.PostException;
import com.alcon.exception.UserException;
import com.alcon.model.Hashtag;
import com.alcon.model.Post;
import com.alcon.model.User;
import com.alcon.repository.PostRepository;
import com.alcon.repository.UserRepository;
import com.alcon.response.MessageResponse;
import com.alcon.services.HashtagService;
import com.alcon.services.PostService;
import com.alcon.services.PostServiceImplementation;
import com.alcon.services.UserService;


@RestController
@RequestMapping("/api/posts")
public class PostController {
	
	private static final Logger LOGGER = LoggerFactory.getLogger(PostController.class);
	
	@Autowired
	private PostService postService;
	
	@Autowired
	private PostServiceImplementation impl;
	
	@Autowired
	private UserService userService;
	
	@Autowired
	private PostRepository postRepository;
	
	@Autowired
	private HashtagService hashtagService;
	
	
	@PostMapping("/create")
	public ResponseEntity<Post> createPostHandler(@RequestBody PostRequestDTO postDto,@RequestHeader("Authorization") String token) throws UserException{
		
		
		LOGGER.info("Post caption - " + postDto.getCaption());
	    LOGGER.info("Image - " + postDto.getImage());
	    LOGGER.info("location - " + postDto.getLocation());
	    LOGGER.info("visibility - " + postDto.getVisibility());

	    User user = userService.findUserProfile(token);

	    Post post = new Post();
	    post.setCaption(postDto.getCaption());
	    post.setImage(postDto.getImage());
	    post.setLocation(postDto.getLocation());
	    post.setVisibility(postDto.getVisibility());

	    Post createdPost = postService.createPost(post, user.getId(), postDto);

	    LOGGER.info("created post - id - " + createdPost.getId());
	    LOGGER.info("image - " + createdPost.getImage());
	    LOGGER.info("caption - " + createdPost.getCaption());
	    LOGGER.info("location - " + createdPost.getLocation());
	    LOGGER.info("visibility - " + createdPost.getVisibility());

	    return new ResponseEntity<Post>(createdPost, HttpStatus.CREATED);
		

	}
	
	//serach hashtag using post
	@GetMapping("/search/hashtag")
    public ResponseEntity<List<Post>> searchPostsByHashtag(@RequestParam("h") String hashtag) {
		LOGGER.info("starting search...");
		List<Post> posts = postRepository.findByCaptionContaining("#" + hashtag);
		LOGGER.info("ending search...");
        return ResponseEntity.ok(posts);
    }
	
	//list of hashtag according to character
	@GetMapping("/search")
    public ResponseEntity<List<Hashtag>> findHashtagsByPrefix(@RequestParam String prefix) {
        List<Hashtag> hashtags = hashtagService.findHashtagsByPrefix(prefix);
        return new ResponseEntity<>(hashtags, HttpStatus.OK);
    }
	
	@GetMapping("/all/{userId}")
	public ResponseEntity<List<Post>> findPostByUserIdHandler(@PathVariable("userId") Integer userId) throws UserException{
		
		List<Post> posts=postService.findPostByUserId(userId);
		
		return new ResponseEntity<List<Post>>(posts,HttpStatus.OK);
	}
	
	
	
//	@GetMapping("/following/{userIds}")
//	public ResponseEntity<List<Post>> findAllPostByUserIds(@PathVariable("userIds") List<Integer> userIds) throws PostException, UserException {
//		
//		LOGGER.info("post userIds ----- "+userIds);
//		List<Post> posts=postService.findAllPostByUserIds(userIds);
//		
//		return new ResponseEntity<List<Post>>(posts,HttpStatus.OK);
//	}
	
	
	@GetMapping("/following/{userIds}")
	public ResponseEntity<List<Post>> findAllPostByUserIds(@PathVariable("userIds") String userIdsString) throws PostException, UserException {
	    LOGGER.info("post userIds ----- " + userIdsString);
	    
	    User currentUserId = userService.getCurrentUser(); // Ensure it returns the current user's ID as an integer.

	    List<Integer> userIds = Arrays.stream(userIdsString.split(","))
	                                    .map(Integer::valueOf)
	                                    .collect(Collectors.toList());

	    List<Post> posts = postService.findAllPostByUserIds(userIds);

	    return new ResponseEntity<>(posts, HttpStatus.OK);
	}


	@GetMapping("/")
	public ResponseEntity<List<Post>> findAllPostHandler() throws PostException{
		List<Post> posts=postService.findAllPost();
		return new ResponseEntity<>(posts,HttpStatus.OK);
	}
	
	@GetMapping("/{postId}")
	public ResponseEntity<Post> findPostByIdHandler(@PathVariable Integer postId) throws PostException{
		Post post=postService.findePostById(postId);
		
		return new ResponseEntity<Post>(post,HttpStatus.OK);
	}
	
	
	@PutMapping("/like/{postId}")
	public ResponseEntity<Post> likePostHandler(@PathVariable("postId") Integer postId, @RequestHeader("Authorization") String token) throws UserException, PostException{
		
		User user=userService.findUserProfile(token);
		
		Post updatedPost=postService.likePost(postId, user.getId());
		
		return new ResponseEntity<Post>(updatedPost,HttpStatus.OK);
		
	}
	
	
	@PutMapping("/unlike/{postId}")
	public ResponseEntity<Post> unLikePostHandler(@PathVariable("postId") Integer postId, @RequestHeader("Authorization") String token) throws UserException, PostException{
		
		User reqUser=userService.findUserProfile(token);
		
		Post updatedPost=postService.unLikePost(postId, reqUser.getId());
		
		return new ResponseEntity<Post>(updatedPost,HttpStatus.OK);
				
	}
	
	
	@DeleteMapping("/delete/{postId}")
	public ResponseEntity<MessageResponse> deletePostHandler(@PathVariable Integer postId, @RequestHeader("Authorization") String token) throws UserException, PostException{
		
		User reqUser=userService.findUserProfile(token);
		
		String message=postService.deletePost(postId, reqUser.getId());
		
		MessageResponse res=new MessageResponse(message);
		
		return new ResponseEntity<MessageResponse> (res, HttpStatus.OK);
		
	}
	
	
	@PutMapping("/save_post/{postId}")
	public ResponseEntity<MessageResponse> savedPostHandler(@RequestHeader("Authorization")String token,@PathVariable Integer postId) throws UserException, PostException{
		
		User user =userService.findUserProfile(token);
		String message=postService.savedPost(postId, user.getId());
		MessageResponse res=new MessageResponse(message);
		
		return new ResponseEntity<>(res,HttpStatus.OK);
	}
	


	
	
	
	@PutMapping("/unsave_post/{postId}")
	public ResponseEntity<MessageResponse> unSavedPostHandler(@RequestHeader("Authorization")String token,@PathVariable Integer postId) throws UserException, PostException{
		
		User user =userService.findUserProfile(token);
		String message=postService.unSavePost(postId, user.getId());
		MessageResponse res=new MessageResponse(message);
		
		return new ResponseEntity<>(res,HttpStatus.OK);
	}
	@PostMapping("/edit")
	public ResponseEntity<Post> editPostHandler(@RequestBody Post updatedPost, @RequestHeader("Authorization") String token) throws UserException, PostException {
	    User user = userService.findUserProfile(token);

	    
	    Post existingPost = postService.findePostById(updatedPost.getId());

	    if (existingPost.getUser().getId().equals(user.getId())) {
	        
	        existingPost.setCaption(updatedPost.getCaption());
	        existingPost.setLocation(updatedPost.getLocation());

	       
	        Post editedPost = postService.editPost(existingPost);

	        return new ResponseEntity<>(editedPost, HttpStatus.OK);
	    } else {
	        throw new UserException("You do not have permission to edit this post.");
	    }
	}
	

}