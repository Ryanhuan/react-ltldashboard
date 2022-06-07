import { Component } from "react";
import './modalEditUser.css'
import Modal from 'react-bootstrap/Modal'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { postData ,getUserId } from "../../../api";

import Swal from 'sweetalert2'

export class ModalEditUser extends Component {
  constructor(props) {
    super(props)

    this.state = {
      email: props.editData.email,
      isenabled: props.editData.isenabled,
      root: props.editData.root,
      rootData: [
        { id: '01', name: '超級管理', value: 'admin', check: false },
        { id: '02', name: '網站管理', value: 'web', check: false },
        { id: '03', name: '文章管理', value: 'blog', check: false },
        { id: '04', name: '產品管理', value: 'product', check: false },
        { id: '05', name: '訂單管理', value: 'list', check: false },
        { id: '06', name: '管理主頁', value: 'manage', check: false }]
    };
    
    //get and set now user root 
    this.state.root.split(',').forEach(ele => {
      for (let i = 0; i < this.state.rootData.length; i++) {
        let x = this.state.rootData[i].value.indexOf(ele)
        if(x!==-1){
          this.state.rootData[i].check=true;
        }
      }
    });

    this.changeState = this.changeState.bind(this)
    this.submitForm = this.submitForm.bind(this)
  }

  changeState(event) {
    let changeName = event.target.name
    if (changeName === 'isenabled') {
      let isenabled_ = !this.state.isenabled;
      this.setState({ isenabled: isenabled_ })
    } else {
      this.setState({ [changeName]: event.target.value })
    }
  }

  changeCheckboxState(index) {
    let arrLists = this.state.rootData
    arrLists[index].check = !arrLists[index].check;
    this.setState({ rootData: arrLists })
  }

  submitForm = async e => {
    e.preventDefault();

   //process data
   const root_tmp=[];
   for(var ele in this.state.rootData) {
       if(this.state.rootData[ele].check) root_tmp.push(this.state.rootData[ele].value)
    }
   let _root=root_tmp.toString();
   let op_user=getUserId()?.email||'user';

    const _postUserEdit = await postData("/api/editUser",{ ...this.state,_root,op_user });
    _postUserEdit.msg === 'Edit_User_OK' ?
      Swal.fire({
        position: 'bottom-end',
        width: 400,
        icon: 'success',
        title: 'Edit user success',
        showConfirmButton: false,
        timer: 1500
      })
      : Swal.fire({
        position: 'bottom-end',
        width: 400,
        icon: 'error',
        title: 'Edit user fail',
        showConfirmButton: false,
        timer: 1500
      })
    this.props.onHide();//close popup
    this.props.getAllUsersInfo();//get parents user grid 
  }


  render() {
    let rootLists = this.state.rootData.map((list, index) => (
      <div key={list.id}>
        <Form.Group className="mb-1" controlId="formBasicIsEnabled">
          <Form.Check type="checkbox"
            checked={list.check}
            onChange={this.changeCheckboxState.bind(this, index)}
            key={list.id}
            label={list.name} />
        </Form.Group>
      </div>
    ));

    return (
      <Modal show={this.props.show} onHide={this.props.onHide} aria-labelledby="contained-modal-title-vcenter" centered>
        <Form onSubmit={this.submitForm}>
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              {this.props.editData.email}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="show-grid">
            <Container>
              <Row>
                <Col xs={12} md={12} className="modalItem">
                  <Form.Check 
                    type="switch"
                    id="custom-switch"
                    label="IsEnabled"
                    name='isenabled'
                    checked={this.state.isenabled}
                    onChange={this.changeState}
                  />
                </Col>
              </Row>
              <Row>
                <Col xs={12} md={12} className="modalItem">
                  <div className="rootListContainer">
                    <span className="rootListTitle">權限</span>
                    <div className="rootList">
                      {rootLists}
                    </div>
                  </div>
                </Col>
              </Row>

            </Container>
          </Modal.Body>
          <Modal.Footer>
            <Button className="btn btn-outline-secondary"onClick={this.props.onHide}>Close</Button>
            <Button className="btn btn-outline-primary"type="submit">Save</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    );
  }
}