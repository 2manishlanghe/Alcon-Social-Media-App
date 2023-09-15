
package com.alcon.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String message;

    private String notificationType;

    private Integer userId;

    private Integer postId;

    private Integer senderId;

    private LocalDateTime createAt;

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public String getNotificationType() {
		return notificationType;
	}

	public void setNotificationType(String notificationType) {
		this.notificationType = notificationType;
	}

	public Integer getUserId() {
		return userId;
	}

	public void setUserId(Integer userId) {
		this.userId = userId;
	}

	public Integer getPostId() {
		return postId;
	}

	public void setPostId(Integer postId) {
		this.postId = postId;
	}

	public Integer getSenderId() {
		return senderId;
	}

	public void setSenderId(Integer senderId) {
		this.senderId = senderId;
	}

	public LocalDateTime getCreateAt() {
		return createAt;
	}

	public void setCreateAt(LocalDateTime createAt) {
		this.createAt = createAt;
	}

	@Override
	public String toString() {
		return "Notification [id=" + id + ", message=" + message + ", notificationType=" + notificationType
				+ ", userId=" + userId + ", postId=" + postId + ", senderId=" + senderId + ", createAt=" + createAt
				+ "]";
	}

	public Notification(Integer id, String message, String notificationType, Integer userId, Integer postId,
			Integer senderId, LocalDateTime createAt) {
		super();
		this.id = id;
		this.message = message;
		this.notificationType = notificationType;
		this.userId = userId;
		this.postId = postId;
		this.senderId = senderId;
		this.createAt = createAt;
	}

	public Notification() {
		super();
		// TODO Auto-generated constructor stub
	}




}