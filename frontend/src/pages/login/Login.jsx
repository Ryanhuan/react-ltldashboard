import './login.css'
import { useState } from 'react'
import Form from 'react-bootstrap/Form'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import Button from 'react-bootstrap/Button'
import PropTypes from 'prop-types';

import { postLoginUser} from "../../api";


export default function Login({ setToken }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


    const Login = async e => {
        e.preventDefault();
        if (email === "" || password === "") {
            alert("Email or password is not entered!");
        }
        else {
            const loginData = await postLoginUser({ email, password });
            if (loginData.msg === 'OK_LOGIN_SUCCESSFULLY') {
                console.log(loginData);
                setToken(loginData.token);
                localStorage.setItem('userId', JSON.stringify(loginData.userId));
                window.location.reload(false);
            } else {
                alert(loginData.msg);
            }
        }
    }

    return (
        <div className="login">
            <div className="loginWrapper">
                <div className="loginWrapperTop">
                    <span className="Title">Login</span>
                </div>
                <div className="loginWrapperBody">
                    <Form onSubmit={Login}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <div className="row">
                                <div className="loginWrapperBodyItem col-md-8 offset-md-2">
                                    <FloatingLabel
                                        controlId="floatingInput"
                                        label="Email"
                                        className="mb-3 ">
                                            <Form.Control 
                                                type="email" 
                                                placeholder="name@example.com" 
                                                onChange={e => setEmail(e.target.value)} 
                                            />
                                    </FloatingLabel>
                                </div>
                            </div>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <div className="row">
                                <div className="loginWrapperBodyItem col-md-8 offset-md-2 ">
                                    <FloatingLabel controlId="floatingPassword" label="Password" className="mb-3">
                                        <Form.Control type="password" placeholder="Password" 
                                            onChange={e => setPassword(e.target.value)}
                                        />
                                    </FloatingLabel>
                                </div>
                            </div>
                        </Form.Group>

                        <div className="row">
                            <div className="loginWrapperBodyItem loginWrapperBodyItemBtn">
                                <Button className="btn btn-main" type="submit"  >
                                    Login
                                </Button>
                            </div>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    )
}


Login.propTypes = {
    setToken: PropTypes.func.isRequired
  }