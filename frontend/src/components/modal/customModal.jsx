import { Component } from "react";
import './customModal.css'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import FloatingLabel from 'react-bootstrap/FloatingLabel'


export class CustomModal extends Component {
  constructor(props) {
    super(props)

    this.state = { ...this.props };

    this.handleDataChange = this.handleDataChange.bind(this)
    this.submitForm = this.submitForm.bind(this)
  }

  handleDataChange(event) {
    event.preventDefault();
    let _name = event.target.name;
    let _modalData = this.state.modalData;
    _modalData.data[_name] = event.target.value;

    //計算單價
    if ((_name === 'price' && _modalData.data.num !== '') || _name === 'num') {
        let tmpPrice = _modalData.data.price / _modalData.data.num;
        _modalData.data.price_per = Math.round(tmpPrice * 10) / 10;
        console.log(_modalData.data);
    }

    this.setState({ modalData: _modalData })
  }


  submitForm = async e => {
    e.preventDefault();
    this.props.onHide();//close popup
  }


  render() {

    let body = this.props.modalCols.map((ele, index) => (
      <div key={index} className={ele.className}>
        {ele.type === 'dropDown' ?
          <FloatingLabel controlId={"floatingSelect" + ele.field} label={ele.headerName}>
            <Form.Select aria-label="Floating label select"
              name={ele.field}
              value={this.props.modalData.data[ele.field]}
              onChange={this.handleDataChange}
              disabled={ele.disabled}
            >
              {ele.selectOption.map(({ value, label }, index) => <option key={index} value={value} >{label}</option>)}
            </Form.Select>
          </FloatingLabel>
          : ele.type === 'text' || ele.type === 'number' ?
            <FloatingLabel controlId={"floatingInput" + ele.field} label={ele.headerName} >
              <Form.Control
                type={ele.type}
                placeholder={ele.headerName}
                name={ele.field}
                value={this.props.modalData.data[ele.field] || ''}
                onChange={this.handleDataChange}
                disabled={ele.disabled}
              />
            </FloatingLabel>
            : ''
        }
      </div>
    ))


    return (
      <Modal show={this.props.show} onHide={this.props.onHide} aria-labelledby="contained-modal-title-vcenter" centered>
        <Form onSubmit={(e) => { this.props.submitForm(e, this.props.modalData.data) }}>
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter" className="modalTitle">
              {this.props.modalData.title || ''}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="show-grid">
            <div className="row">
              {body}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button className="btn btn-outline-secondary" onClick={this.props.onHide}>取消</Button>
            <Button className="btn btn-outline-primary" type="submit">確定</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    );
  }
}