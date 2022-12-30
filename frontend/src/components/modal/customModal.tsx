import { Component } from "react";
import styles from "./customModal.module.scss";

import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import Button from '../button/Button'
import { type } from "os";

import { Product } from '@/components/dashboard/product/Product';


export class CustomModal extends Component<PropType, StateType> {
  constructor(props) {
    super(props)
    this.state = {
      ...this.props
    };
    this.handleDataChange = this.handleDataChange.bind(this)
  }

  handleDataChange(event) {
    event.preventDefault();
    let _name = event.target.name;
    let _modalData = this.state.modalData;
    // _modalData[_name] = event.target.value;

    //計算單價
    if ((_name === 'price' && _modalData.num !== '') || _name === 'num') {
      let tmpPrice = _modalData.price / _modalData.num;
      _modalData.price_per = Math.round(tmpPrice * 10) / 10;
    }

    this.setState({ modalData: _modalData })
  }

  render() {
    const { title, modalCols, modalData, isShow, onHide, submitForm } = this.state;
    let body ;
    if (modalCols !== undefined) {
      body = modalCols.map((ele, index) => (
        <div key={index} className={ele.className}>
          {ele.type === 'dropDown' ?
            <FloatingLabel controlId={"floatingSelect" + ele.field} label={ele.headerName}>
              <Form.Select aria-label="Floating label select"
                name={ele.field}
                value={modalData[ele.field]}
                onChange={this.handleDataChange}
                disabled={ele.disabled}>
                {ele.selectOption.map(({ value, label }, index) => <option key={index} value={value} >{label}</option>)}
              </Form.Select>
            </FloatingLabel>
            : ele.type === 'text' || ele.type === 'number' ?
              <FloatingLabel controlId={"floatingInput" + ele.field} label={ele.headerName} >
                <Form.Control
                  type={ele.type}
                  placeholder={ele.headerName}
                  name={ele.field}
                  value={modalData[ele.field] || ''}
                  onChange={this.handleDataChange}
                  disabled={ele.disabled}
                />
              </FloatingLabel>
              : null
          }
        </div>
      ))
    }

    return (
      <>
        {
          <Modal show={isShow} onHide={onHide} id="1" aria-labelledby="contained-modal-title-vcenter" dialogClassName="modal-90w" >
            <Form>
              <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter" className={styles.modalTitle}>
                  {title || null}
                </Modal.Title>
              </Modal.Header>
              <Modal.Body className="show-grid">
                <div className="row">
                  {body || null}
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="contained" themeColor="primary"
                  onClick={(e) => { submitForm(e, modalData.data) }}>確定</Button>
                <Button variant="contained" themeColor="secondary" onClick={onHide}>取消</Button>
              </Modal.Footer>
            </Form>
          </Modal>
        }
      </>
    );
  }
}

type StateType = {
  modalData?: any;
  title?: string;
  modalCols?: I_modalCols[];
  isShow: boolean;
  onHide(): void;
  submitForm?(e?: any, data?: {}): void;
};

type PropType = {
  onHide(): void;
  isShow: boolean;
  title?: string;
  submitForm?(e?: any, data?: {}): void;
  modalData?: {};
  modalCols?: I_modalCols[];
  editData?: StateType;
}

interface I_modalCols {
  field: string;
  headerName: string;
  className?: string;
  flex?: number;
  renderCell?(): void;
  type?: string;
  disabled?: boolean;
  selectOption?: { value: string, label: string }[];
}