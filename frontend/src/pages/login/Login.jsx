import './login.css'
import { useState } from 'react'
import Form from 'react-bootstrap/Form'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import Button from 'react-bootstrap/Button'

import { postData } from "../../api";



export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


    const Login = async e => {
        e.preventDefault();
        if (email === "" || password === "") {
            alert("Email or password is not entered!");
        }
        else {
            const loginData = await postData("/auth/signin", { email, password });
            if (loginData.ack === 'OK') {
                customToastTopEnd.fire('OK!', 'Login success!', 'success');
                localStorage.setItem('token', JSON.stringify(loginData.token));
                localStorage.setItem('userId', JSON.stringify(loginData.userId));
                window.location.reload(false);
            } else {
                customToastTopEnd.fire('NO NO!', loginData.ackDesc, 'error');
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
                                    <FloatingLabel controlId="floatingInput" label="Email" className="mb-3 ">
                                        <Form.Control type="email" placeholder="name@example.com" onChange={e => setEmail(e.target.value)} />
                                    </FloatingLabel>
                                </div>
                            </div>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <div className="row">
                                <div className="loginWrapperBodyItem col-md-8 offset-md-2 ">
                                    <FloatingLabel controlId="floatingPassword" label="Password" className="mb-3">
                                        <Form.Control type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
                                    </FloatingLabel>
                                </div>
                            </div>
                        </Form.Group>

                        <div className="row">
                            <div className="loginWrapperBodyItem loginWrapperBodyItemBtn">
                                <Button className="btn btnMain" type="submit">Login</Button>
                            </div>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    )
}
