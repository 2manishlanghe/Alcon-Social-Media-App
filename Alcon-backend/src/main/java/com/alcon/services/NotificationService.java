
package com.alcon.services;

import com.alcon.exception.PostException;
import com.alcon.exception.UserException;
import com.alcon.model.Notification;
import com.alcon.repository.NotificationRepository;
import com.alcon.repository.PostRepository;
import com.alcon.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {


    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
   private UserRepository userRepository;
    


    public void sendNotification(Integer userId, Integer postId, String msg, String notificationType) throws UserException, PostException {

        var userById = userRepository.findById(userId).get();
        var findePostById = postRepository.findById(postId).get();
        var post = postRepository.findUserById(postId).get();

        String message = userById.getName() +" " +msg;
        Notification notification = new Notification();
        notification.setNotificationType(notificationType);
        notification.setPostId(findePostById.getId());
        notification.setMessage(message);
        notification.setSenderId(post.getUser().getId());
        notification.setCreateAt(LocalDateTime.now());

        notification.setUserId(userById.getId());
        
        
        notificationRepository.save(notification);

    }

//    public void sendCommentNotification(Integer userId, Integer postId) throws UserException, PostException {
//
//        var userById = userService.findUserById(userId);
//        var findePostById = postService.findePostById(postId);
//        var post = postRepository.findUserById(postId).get();
//
//        String message = userById.getName() +" comment on your post " + findePostById.getId();
//        Notification notification = new Notification();
//        notification.setNotificationType("COMMENT");
//        notification.setPostId(findePostById.getId());
//        notification.setMessage(message);
//        notification.setSenderId(post.getUser().getId());
//        notification.setCreateAt(LocalDateTime.now());
//
//        notificationRepository.save(notification);
//    }

    public List<Notification> findAllNotificationByUserId(Integer userId) {
       return notificationRepository.findBySenderId(userId);
    }
    
    

}
