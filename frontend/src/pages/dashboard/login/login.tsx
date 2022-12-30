
import styles from "./login.module.scss";
import { useState } from "react";
import { clsx } from 'clsx';
import Form from 'react-bootstrap/Form'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import Button from 'react-bootstrap/Button'

import { postData } from "@/api";
import { customToastTopEnd } from "@/components/customAlert/customAlert"


export default function login(props: any) {
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
        window.location.reload();
      } else {
        customToastTopEnd.fire('NO NO!', loginData.ackDesc, 'error');
      }
    }
  }

  return (
    <div className={styles.login}>
      <div className={styles.wrapper}>
        <div className={styles.wrapperTop}>
          <span className={styles.wrapperTitle}>Login</span>
        </div>
        <div className={styles.wrapperBody}>
          <Form onSubmit={Login}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <div className="row">
                <div className={clsx(styles.wrapperBodyItem, 'col-md-8', 'offset-md-2')}>
                  <FloatingLabel controlId="floatingInput" label="Email" className="mb-3 ">
                    <Form.Control type="email" placeholder="name@example.com" onChange={e => setEmail(e.target.value)} />
                  </FloatingLabel>
                </div>
              </div>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <div className="row">
                <div className={clsx(styles.wrapperBodyItem, 'col-md-8', 'offset-md-2')}>
                  <FloatingLabel controlId="floatingPassword" label="Password" className="mb-3">
                    <Form.Control type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
                  </FloatingLabel>
                </div>
              </div>
            </Form.Group>

            <div className="row">
              <div className={styles.wrapperBodyItem}>
                <Button className="btn btnMain" type="submit">Login</Button>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
