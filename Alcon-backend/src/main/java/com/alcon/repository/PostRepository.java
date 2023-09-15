package com.alcon.repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.alcon.dto.UserDto;
import com.alcon.model.Post;
import com.alcon.model.User;
import com.alcon.model.VisibilityMode;

@Repository
public interface PostRepository extends JpaRepository<Post, Integer> {
	
	@Query("select p from Post p where p.user.id=?1")
	public List<Post> findByUserId (Integer userId);
	
	public Optional<Post> findById(Integer userId);
	
    @Query("SELECT p FROM Post p WHERE p.user.id IN :users ORDER BY p.createdAt DESC")
    public List<Post> findAllPostByUserIds(@Param("users") List<Integer> userIds);

    @Query("SELECT p FROM Post p WHERE p.user.id IN :users ORDER BY p.createdAt DESC")
    public List<Post> findAllPostByUserIdsSortedByDateDesc(@Param("users") List<Integer> userIds);
    
    Optional<Post> findUserById(Integer id);
    //List<Post> findAllByVisibility(String visibility);
   
//    List<Post> findAllByVisibility(String visibility);
//    List<Post> findAllByUserAndVisibility(Set<UserDto> user, String visibility);
    @Query("SELECT p FROM Post p WHERE p.visibility = 'Public'")
    List<Post> findAllByVisibility();
    //List<Post> findAllByUserInAndVisibility(Set<User> users, String visibility);
    
    @Query("select p from Post p where p.visibility = ?1 and p.user in ?2")
    List<Post> findByVisibilityAndUserIn(String visibility, Set<UserDto> users);
    
   // List<Post> findByVisibilityMode(VisibilityMode visibilityMode);
    
    List<Post> findAllByVisibilityAndUserIn(String visibility, Set<UserDto> users);
    
    List<Post> findAllByVisibilityAndUser(String visibility, User user);

    @Query("select distinct p from Post p where p.visibility = ?1 and p.user = ?2")
    List<Post> findDistinctByVisibilityAndUser(String visibility, User user);

    /*@Query("SELECT * FROM posts AS p JOIN users AS u ON p.user_id = u.id WHERE p.visibility = ?1 AND u.email = ?2")
    List<Post> findByVisibilityAndUserEmail(String visibility, String email);*/

    @Query("SELECT p FROM Post p JOIN p.user u WHERE p.visibility = 'Only-me' AND u.email = :email")
    List<Post> findPrivatePostsByUserEmail(@Param("email") String email);

    List<Post> findByVisibilityAndUser(String visibility, UserDto user);

    @Query("select p from Post p where p.visibility = :visibility and p.user.id = :userId")
    List<Post> findByVisibilityAndUser_Id(@Param("visibility") String visibility, @Param("userId") Integer userId);


    List<Post> findByCaptionContaining(String hashtag);

    /*@Query("SELECT p FROM Post p WHERE p.visibility = 'friends' AND p.user.id IN (SELECT uf.following FROM User uf WHERE uf.id = :userId)")
    List<Post> findFriendsPostsByUserId(@Param("userId")Integer userId);*/





}