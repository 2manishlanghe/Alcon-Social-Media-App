import { Form } from "formik";
import React from "react";
import "./Register.css";

const Register = () => {
  return (
    <div>
      <div class="flex">
        <div>
            <img
            className="h-[80vh]"
          src=""
          alt="Alcon Homepage"
        />
        </div>
        
        <div class="">
          <img
            src=""
            alt="Alcon"
          />

          <form>
            <input type="text" placeholder="Username" />
            <input type="password" placeholder="Password" />
            <button type="submit">Log In</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
