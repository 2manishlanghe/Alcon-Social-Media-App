
package com.alcon.controller;

import com.alcon.exception.UserException;
import com.alcon.model.Notification;
import com.alcon.model.Post;
import com.alcon.model.User;
import com.alcon.services.NotificationService;
import com.alcon.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/notifications")
public class NotificationController {

    @Autowired
    private UserService userService;

    @Autowired
    private NotificationService notificationService;

    @GetMapping("/getNotifications")
    public ResponseEntity<List<Notification>> createPostHandler(@RequestHeader("Authorization") String token) throws UserException {

        User user = userService.findUserProfile(token);
        var allNotificationByUser = notificationService.findAllNotificationByUserId(user.getId());
        return new ResponseEntity<>(allNotificationByUser, HttpStatus.OK);
    }
}
