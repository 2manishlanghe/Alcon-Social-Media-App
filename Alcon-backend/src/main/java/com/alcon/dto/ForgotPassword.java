package com.alcon.dto;

public class ForgotPassword {

    private String newPassword;

    private String conformPassword;


    public ForgotPassword() {
        super();
    }


    public String getNewPassword() {
        return this.newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }

    public String getConformPassword() {
        return this.conformPassword;
    }

    public void setConformPassword(String conformPassword) {
        this.conformPassword = conformPassword;
    }

    @Override
    public String toString() {
        return "ForgetPassword{"
                + "newPassword='" + newPassword + "', "
                + "conformPassword='" + conformPassword + "'}";
    }

}