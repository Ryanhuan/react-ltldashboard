import './adminProductCode.css'
import { Component } from 'react'
import { DataGrid } from '@mui/x-data-grid';
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import { DeleteOutline, Edit, Eject } from '@material-ui/icons';
import { CustomModal } from '../../../components/modal/customModal';
import { postData } from "../../../api";
import { getSelectOption } from '../../../utility.ts'
import Button from '../../../components/button/Button'

import Swal from 'sweetalert2';

export class AdminProductCode extends Component {
    constructor(props) {
        super(props);
        //declare
        this.state = {
            WrapperOpen: {
                isInsertWrapper: false,
            },
            SearchTypeCode: '',
            SelectOption: [],
            insertData: {
                type: '', label: '',
            },
            gridData: [],
            modal: {
                isShow: false,
                title: '',
                data: {},
            },
            isLoadingInsert: false,
        };
        //bind
        this.insertData = this.insertData.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.WrapperOpen = this.WrapperOpen.bind(this);
        this.dataClear = this.dataClear.bind(this);
    }

    componentDidMount() {
        this._getSelectOption();
    }

    //get query select option
    async _getSelectOption() {
        let _SelectOption = await getSelectOption('product');
        this.setState({ SelectOption: _SelectOption })
    }

    //材料新增材料
    async insertData(event) {
        event.preventDefault();
        this.setState({ isLoadingInsert: !this.state.isLoadingInsert });
        if (this.state.insertData.label === '') {
            Swal.fire({
                position: 'bottom-end',
                width: 400,
                icon: 'error',
                title: '項目欄位 必填!',
                showConfirmButton: false,
                timer: 1500
            })
        }
        // else if (this.state.insertData.value.match("^[a-zA-Z0-9 ]*$") == null) {
        //     //check 
        //     Swal.fire({
        //         position: 'bottom-end',
        //         width: 400,
        //         icon: 'error',
        //         title: '代碼請輸入英文或數字!',
        //         showConfirmButton: false,
        //         timer: 1500
        //     })
        // } 
        else {
            let _res = await postData("/api/insertCodeData", this.state.insertData);
            if (_res.status === 'insertCodeData_OK') {
                Swal.fire({
                    position: 'bottom-end',
                    width: 400,
                    icon: 'success',
                    title: '新增材料成功!',
                    showConfirmButton: false,
                    timer: 1500
                })
                this._getGridData([this.state.SearchTypeCode]);
            } else if (_res.msg === 'code_ChkRepeated') {
                Swal.fire({
                    position: 'bottom-end',
                    width: 400,
                    icon: 'error',
                    title: '代碼或代碼描述 重複!',
                    showConfirmButton: false,
                    timer: 1500
                })
            } else {
                Swal.fire({
                    position: 'bottom-end',
                    width: 400,
                    icon: 'error',
                    title: _res.msg,
                    showConfirmButton: false,
                    timer: 1500
                })
            }
        }
        this.setState({ isLoadingInsert: !this.state.isLoadingInsert });
    }


    handleChange(event) {
        event.preventDefault();
        let _name = event.target.name;
        this.setState({ [_name]: event.target.value });
        if (_name === 'SearchTypeCode') { this._getGridData(event.target.value); }
    }

    // insert data onchange
    handleDataChange(event, action) {
        let _action = this.state[action];
        let _name = event.target.name;
        // input type change (if type == number && value !=='' then string => number)
        _action[_name] = (event.target.type === 'number' && event.target.value !== '') ? parseInt(event.target.value) : event.target.value;
        this.setState({ [action]: _action });
    }

    //get grid data
    async _getGridData(data) {
        if (data === '') {
            this.setState({ gridData: [] });
        } else {
            let qryTmp = [data];
            let _res = await postData("/api/getSelectOption", qryTmp);
            if (_res.msg === 'getSelectOption_OK') {
                let _gridData = [];
                //排除'**'
                for (let ele in _res.data[data]) {
                    if (_res.data[data][ele].value !== '**') { _gridData.push(_res.data[data][ele]) }
                }
                //create seq
                for (let i = 0; i < _gridData.length; i++) {
                    _gridData[i].seq = (i + 1);
                }
                this.setState({ gridData: _gridData });
            } else {
                Swal.fire({
                    position: 'bottom-end',
                    width: 400,
                    icon: 'error',
                    title: 'Search fail',
                    showConfirmButton: false,
                    timer: 1500
                })
                this.setState({ gridData: [] });
            }
        }
    }

    // wrapper switch
    WrapperOpen(event) {
        event.preventDefault();
        let wrapperName = event.target.name;
        let _WrapperOpen = this.state.WrapperOpen;
        _WrapperOpen[wrapperName] = !_WrapperOpen[wrapperName];
        this.setState({ WrapperOpen: _WrapperOpen });
    }

    //clear
    dataClear(event) {
        event.preventDefault();
        let _dataName = this.state[event.target.name];
        for (let ele in _dataName) {
            if (typeof _dataName[ele] === 'string') { _dataName[ele] = '' } else if (typeof _dataName[ele] === 'number') { _dataName[ele] = 0 };
        }
        this.setState({ [_dataName]: _dataName });
    }



    render() {
        const modalOpen = (event, data) => {
            event.preventDefault();
            console.log("open!!!!");
            let _data = JSON.parse(JSON.stringify(data));
            let _modal = this.state.modal;
            _modal.data = _data;
            _modal.title = "修改";
            _modal.isShow = !_modal.isShow;

            console.log(_modal);
            this.setState({ modal: _modal });
        }

        const modalOnHide = () => {
            let _modal = this.state.modal;
            _modal.isShow = !_modal.isShow;
            this.setState({ modal: _modal });
        }

        const submitForm = async (event, data) => {
            event.preventDefault();
            Swal.fire({
                title: '確定要修改?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: '確定',
                cancelButtonText: '取消'
            }).then(async (result) => {
                if (result.isConfirmed) {
                    let _res = await postData("/api/editCodeData", data);
                    if (_res.status === 'editCodeData_OK') {
                        Swal.fire('完成修改!', '修改成功.', 'success')
                        this._getGridData([this.state.SearchTypeCode]);
                    } else {
                        Swal.fire('Fail!', _res.msg, 'error')
                    }
                }
            })
            modalOnHide();
        }

        //grid delete
        const handleDelete = async (event, data) => {
            event.preventDefault();
            Swal.fire({
                title: '確定要刪除?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: '確定',
                cancelButtonText: '取消'
            }).then(async (result) => {
                if (result.isConfirmed) {
                    let _res = await postData("/api/deleteCodeData", data);
                    if (_res.status === 'deleteCodeData_OK') {
                        Swal.fire('完成刪除!', '刪除成功.', 'success')
                        this._getGridData([this.state.SearchTypeCode]);
                    } else {
                        Swal.fire('Fail!', _res.msg, 'error')
                    }
                }
            })
        }

        const _tmpModalCols = this.state.SearchTypeCode === 'product_catena' || this.state.SearchTypeCode === 'product_single' ?
            { field: 'mark', headerName: '描述', type: 'text', className: 'mb-2 col-12' }
            : { field: '', headerName: '', hide: true };

        const modalCols = [
            { field: 'label', headerName: '項目', type: 'text', className: 'mb-2 col-6' },
            _tmpModalCols
        ]

        const _tmpCols = this.state.SearchTypeCode === 'product_catena' || this.state.SearchTypeCode === 'product_single' ?
            { field: 'mark', headerName: '描述', flex: 2 }
            : { field: '', headerName: '', hide: true };

        const columns = [
            { field: 'seq', headerName: '序', flex: 1 },
            { field: 'label', headerName: '項目', flex: 2 },
            _tmpCols,
            {
                field: 'actions', headerName: 'Actions', flex: 2,
                renderCell: (params) => {
                    return (
                        <>
                            <Button
                                variant="text"
                                startIcon={<Edit />}
                                themeColor='success'
                                onClick={(e) => modalOpen(e, params.row)}
                            />
                            <Button
                                variant="text"
                                startIcon={<DeleteOutline />}
                                themeColor='error'
                                onClick={(e) => handleDelete(e, params.row)}
                            />
                            {this.state.modal.isShow ?
                                <CustomModal isShow={this.state.modal.isShow} onHide={modalOnHide} modalData={this.state.modal}
                                    modalCols={modalCols} submitForm={(e, data) => { submitForm(e, data) }}
                                /> : ''
                            }
                            <div>{this.state.modal.isShow}</div>
                            
                        </>
                    )
                }
            },
        ];

        return (
            <div className="adminProductCode">
                <div className="adminProductCodeWrapper">
                    <div className="adminProductCodeBody">
                        <div className="adminProductCodeItem">
                            <a href="/#" className="itemTitle" name="isInsertWrapper" onClick={this.WrapperOpen}>
                                代碼新增
                                <Eject className={this.state.WrapperOpen.isInsertWrapper ? 'itemIconRotate active' : 'itemIconRotate noActive'} /></a>
                            <div className={this.state.WrapperOpen.isInsertWrapper ? 'adminProductCodeItemWrapper active' : 'adminProductCodeItemWrapper'}>
                                <Container>
                                    <Row className="justify-content-md-center">
                                        <Col xs={12} md={3}>
                                            <FloatingLabel controlId="floatingSelectType" label="類別">
                                                <Form.Select aria-label="Floating label select" name='type' value={this.state.insertData.type} onChange={(e) => { this.handleDataChange(e, "insertData") }} >
                                                    {this.state.SelectOption.map(({ value, label }, index) => <option key={index} value={value} >{label}</option>)}
                                                </Form.Select>
                                            </FloatingLabel>
                                        </Col>
                                        <Col xs={12} md={3}>
                                            <FloatingLabel controlId="floatingInputLabel" label="項目" className="mb-1 ">
                                                <Form.Control type="text" placeholder="項目" name='label' value={this.state.insertData.label} onChange={(e) => { this.handleDataChange(e, "insertData") }} />
                                            </FloatingLabel>
                                        </Col>
                                        {this.state.insertData.type === 'product_catena' || this.state.insertData.type === 'product_single' ?
                                            <Col xs={12} md={3}>
                                                <FloatingLabel controlId="floatingInputMark" label="描述" className="mb-1 ">
                                                    <Form.Control type="text" placeholder="描述" name='mark' value={this.state.insertData.mark} onChange={(e) => { this.handleDataChange(e, "insertData") }} />
                                                </FloatingLabel>
                                            </Col> : ''
                                        }
                                        {this.state.insertData.type === 'product_status' ?
                                            <Col xs={12} md={3}>
                                                <div className="checkboxStyle mb-3">
                                                    <Form.Check
                                                        type="checkbox"
                                                        id="checkboxInventory"
                                                        name="isInventory"
                                                        label="庫存設定"
                                                    />
                                                </div>
                                            </Col> : ''
                                        }
                                    </Row>

                                    <Row className="justify-content-md-center">
                                        <Col xs={12} md={{ span: 6, offset: 3 }} className="btnGroup">
                                            <Button
                                                variant="contained"
                                                onClick={this.insertData}
                                                isLoading={this.state.isLoadingInsert}
                                            >
                                                新增
                                            </Button>
                                            <Button
                                                variant="contained"
                                                themeColor="success"
                                                onClick={this.dataClear}
                                            >
                                                清除新增
                                            </Button>
                                        </Col>
                                    </Row>
                                </Container>
                            </div>
                        </div>

                        <div className="adminProductCodeItem">
                            <a className="itemTitle">代碼查詢</a>
                            <div className="adminProductCodeItemContainer">
                                <Container>
                                    <Row>
                                        <Col xs={12} md={3}>
                                            <FloatingLabel controlId="floatingSelectSearch" label="Search">
                                                <Form.Select aria-label="Floating label select" name='SearchTypeCode' value={this.state.SearchTypeCode} onChange={this.handleChange} >
                                                    {this.state.SelectOption.map(({ value, label }, index) => <option key={index} value={value} >{label}</option>)}
                                                </Form.Select>
                                            </FloatingLabel>
                                        </Col>
                                    </Row>
                                </Container>
                            </div>

                            <div className="adminProductCodeItemContainer">
                                <div className="productCodeDataList">
                                    <DataGrid
                                        rows={this.state.gridData}
                                        columns={columns}
                                        pageSize={10}
                                        rowsPerPageOptions={[10]}
                                        disableSelectionOnClick
                                        getRowId={(row) => row.seq}
                                    />
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

