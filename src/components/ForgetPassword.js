import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signInWithEmailAndPassword,sendPasswordResetEmail } from "firebase/auth";

export default function ForgetPassword() {
  const navigate = useNavigate();
  // useEffect(() => {
  //   auth.onAuthStateChanged((user) => {
  //     if (user) {
  //       navigate("/");
  //     }
  //   });
  // }, []);
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmitButton = async () => {
    if (values.email) {
      setErrorMsg("");
      try {
        await sendPasswordResetEmail(auth,'shahzainsohail29@gmail.com')
        alert('check your email')
        navigate('/login')
      } catch (err) {
        alert(err.message)
        setErrorMsg(err.message)
      }
    } else {
      setErrorMsg("Please fill all the required fields!");
    }
  };

  return (
    <>
      <div className="d-flex h-100">
        <div className="card container col-10 col-sm-10 col-md-9 col-lg-8 mt-5 p-0 align-self-center border-primary">
          <div className="card-header border-darks">
            <div className="mt-2 text-center">
              <h3>MediCare</h3>
              <h4>Update your Password!</h4>
            </div>
          </div>
          <div className="card-body">
            <div className="container align-self-center">
              <div className="form-group">
                <label htmlFor="exampleInputEmail1">Email Address</label>
                <input
                  type="email"
                  onChange={(event) => {
                    setValues((prev) => ({ ...prev, email: event.target.value }));
                  }}
                  className="form-control"
                  id="exampleInputEmail1"
                  aria-describedby="emailHelp"
                  placeholder="Email Address"
                />
              </div>
              <div className="form-group mt-4">
                <button
                  id="submit"
                  type="submit"
                  className="btn btn-primary btn-block"
                  onClick={handleSubmitButton}>
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
