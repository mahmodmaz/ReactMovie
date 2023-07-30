
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { auth, firestore } from '../config/firebase';
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { connect } from "react-redux";
import actions from "../store/actions"
import { useNavigate } from "react-router-dom";

function LoginPage(props) {
    const navigate = useNavigate()
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [passwordError, setpasswordError] = useState("");
    const [emailError, setemailError] = useState("");

    const handleValidation = (event) => {
        let formIsValid = true;

        if (!email.match(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/)) {
            formIsValid = false;
            setemailError("Email Not Valid");
            return false;
        } else {
            setemailError("");
            formIsValid = true;
        }



        return formIsValid;
    };
    useEffect(() => {
        console.log(props.user, 'useruser');
    }, [])


    const loginSubmit = async (e) => {
        e.preventDefault();
        const valid = await handleValidation();
        if (valid) {
            signInWithEmail()
        } else {
            alert("Email/Password is Incorrect")
        }
    };
    const signInWithEmail = async () => {

        try {

            const res = await signInWithEmailAndPassword(auth, email, password);
            // console.log("logged user", res)
            const userId = res?.user?.uid;
            const userRef = doc(firestore, "Users", userId)
            const userDoc = await getDoc(userRef)
            const user = userDoc?.data()
            if (user) {
                props._login(user)
                console.log(user, 'user');
                alert("User Logged In")
                navigate('/home')
            }
            else {
                alert('Something went wrong')
            }
        } catch (error) {
            alert(error);
        }


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
                                <label>Email address</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="EmailInput"
                                    name="EmailInput"
                                    aria-describedby="emailHelp"
                                    placeholder="Enter email"
                                    onChange={(event) => setEmail(event.target.value)}
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
                                    id="exampleInputPassword1"
                                    placeholder="Password"
                                    onChange={(event) => setPassword(event.target.value)}
                                />
                                <small id="passworderror" className="text-danger form-text">
                                    {passwordError}
                                </small>
                            </div>
                            <button type="submit" className="btn btn-primary">
                                Submit
                            </button>
                            <button onClick={() => navigate('/signup')} type="button" className="btn btn-primary ml-4">
                                Create Account
                            </button>
                        </form>

                    </div>


                </div>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        user: state.user,
        logged: state.logged,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        _login: data => dispatch(actions.loginUser(data)),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);