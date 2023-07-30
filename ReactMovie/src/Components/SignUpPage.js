
import React, { useState } from "react";
import { auth, firestore } from '../config/firebase';
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { getDoc, doc, setDoc } from "firebase/firestore";

function SignUpPage(props) {
    const navigate = useNavigate()

    const [signUpInputs, setSignUpInputs] = useState({
        email: '',
        password: '',
        confirm_password: "",
        age: 0,
        first_name: "",
        last_name: '',
    });
    const [passwordError, setpasswordError] = useState("");
    const [passwordConfirmError, setpasswordConfirmError] = useState("");
    const [ageError, setAgeError] = useState("");
    const [emailError, setemailError] = useState("");

    const handleValidation = (event) => {
        const { password, email, confirm_password, age, first_name, last_name } = signUpInputs
        let formIsValid = true;
        console.log(signUpInputs, 'signUpInputs');
        if (!email.match(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/)) {
            formIsValid = false;
            setemailError("Email Not Valid");
            return false;
        } else {
            setemailError("");
            formIsValid = true;
        }

        if (password !== confirm_password) {
            formIsValid = false;
            setpasswordConfirmError(
                "Password and Confirm Password does not matched"
            );
        } else if (age < 18) {
            setAgeError(
                "Your age should be 18 or above to register"
            );
            formIsValid = false;
        } else {
            setpasswordError("");
            formIsValid = true;
        }

        return formIsValid;
    };

    const loginSubmit = async (e) => {
        e.preventDefault();
        const valid = await handleValidation();
        if (valid) {
            console.log(signInWithEmail, 'crend');
            signInWithEmail()
        } else {
            alert("Please Enter Valid Information")
        }
    };
    const signInWithEmail = async () => {
        const { password, email, confirm_password, age, first_name, last_name } = signUpInputs
        const isUserCreated = await createUserWithEmailAndPassword(auth, email, password);
        const user = isUserCreated.user;
        // await sendEmailVerification(user)
        const userDocRef = doc(firestore, "Users", user.uid)
        let body = {
            "username": first_name + ' ' + last_name,
            "email": isUserCreated.user.email,
            // "emailVerified": isUserCreated.user.emailVerified,
            "uid": isUserCreated.user.uid,
        }
        await setDoc(userDocRef, body)
        alert("Signed up successfully")
        navigate("/login")
      


    }

    // method to handle forgot password using firebase auth
    // const handleForgetPassByEmail = async () => {
    //     onInputChange(true, 'loading')
    //     try {
    //         if (inputs.email.length > 0) {
    //             const res = sendPasswordResetEmail(auth, inputs.email)
    //                 .then((user) => {
    //                     Alert.alert('Forget Password', "An email with instructions to reset your password has been sent to your email address. Please check your inbox.")
    //                 }).catch((e) => {
    //                     console.log(e)
    //                     Alert.alert("Error", "We couldn't find an account associated with this email address.")
    //                 })
    //             console.log(res)
    //         } else {
    //             Alert.alert("Forgot Password", "Provide a valid email address")
    //         }
    //     } catch (error) {
    //         alert(error);
    //     }
    //     onInputChange(false, 'loading')

    // }

    return (
        <div className="App">
            <div className="container">
                <div className="row d-flex justify-content-center">
                    <div className="col-md-8">
                        <form id="loginform" onSubmit={loginSubmit}>
                            <div className="form-group">
                                <label>First Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="first_name"
                                    name="EmailInput"
                                    aria-describedby="emailHelp"
                                    placeholder="Enter First Name"
                                    onChange={(event) => setSignUpInputs({ ...signUpInputs, [event?.target?.id]: event.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Last Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="last_name"
                                    name="EmailInput"
                                    aria-describedby="emailHelp"
                                    placeholder="Enter Last Name"
                                    onChange={(event) => setSignUpInputs({ ...signUpInputs, [event?.target?.id]: event.target.value })}
                                />

                            </div>
                            <div className="form-group">
                                <label>Age</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="age"
                                    name="EmailInput"
                                    aria-describedby="emailHelp"
                                    placeholder="Enter Age"
                                    onChange={(event) => setSignUpInputs({ ...signUpInputs, [event?.target?.id]: event.target.value })}
                                />
                                <small id="emailHelp" className="text-danger form-text">
                                    {ageError}
                                </small>
                            </div>
                            <div className="form-group">
                                <label>Email address</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="email"
                                    name="EmailInput"
                                    aria-describedby="emailHelp"
                                    placeholder="Enter Email"
                                    onChange={(event) => setSignUpInputs({ ...signUpInputs, [event?.target?.id]: event.target.value })}
                                />
                                <small id="emailHelp" className="text-danger form-text">
                                    {emailError}
                                </small>
                            </div>
                            <div className="form-group">
                                <label>Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="password"
                                    placeholder="Password"
                                    onChange={(event) => setSignUpInputs({ ...signUpInputs, [event?.target?.id]: event.target.value })}
                                />
                                <small id="passworderror" className="text-danger form-text">
                                    {passwordError}
                                </small>
                            </div>
                            <div className="form-group">
                                <label>Confirm Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="confirm_password"
                                    placeholder="Confirm Password"
                                    onChange={(event) => setSignUpInputs({ ...signUpInputs, [event?.target?.id]: event.target.value })}
                                />
                                <small id="passworderror" className="text-danger form-text">
                                    {passwordConfirmError}
                                </small>
                            </div>
                            <div style={{ display: "flex", alignItems: 'center' }}>
                                <button type="submit" className="btn btn-primary ">
                                    Create Account
                                </button>
                                <div style={{ marginLeft: '20px' }}>
                                    <a href="/login" className="link-info">Have account? login </a>
                                </div>
                            </div>
                        </form>

                    </div>


                </div>
            </div>
        </div>
    )
}

export default connect(null, null)(SignUpPage);
