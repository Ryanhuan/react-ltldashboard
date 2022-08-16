import './adminMatCode.css'
import { Component } from 'react'
import { DataGrid } from '@mui/x-data-grid';
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { DeleteOutline, Edit, Eject } from '@material-ui/icons';
import { CustomModal } from '../../../components/modal/customModal';
import { postData } from "../../../api";
import Swal from 'sweetalert2';

export class AdminMatCode extends Component {
    constructor(props) {
        super(props);
        //declare
        this.state = {
            WrapperOpen: {
                insertWrapper: false,
            },
            SearchTypeCode: '',
            SelectOption: [],
            insertData: {
                type: '', label: '',
            },
            gridData: [],
            modal: {
                show: false,
                title: '',
                data: {},
            }
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
        let _SelectOption = [{ value: '', label: '==請選擇==' },];
        let _res = await postData("/api/getCodeTypeKind/ma");
        if (_res.msg === "getCodeTypeKind_OK") {
            _res.data.forEach(ele => {
                _SelectOption.push(ele);
            })
        }
        this.setState({ SelectOption: _SelectOption })
    }

    //材料新增材料
    async insertData(event) {
        event.preventDefault();
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
        else {
            let _res = await postData("/api/insertCodeData", this.state.insertData);
            if (_res.status === 'insertCodeData_OK') {
                //成功
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
                //失敗 代碼重複
                Swal.fire({
                    position: 'bottom-end',
                    width: 400,
                    icon: 'error',
                    title: '代碼或代碼描述 重複!',
                    showConfirmButton: false,
                    timer: 1500
                })
            } else {
                //失敗 其他錯誤
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
    }

    handleChange(event) {
        event.preventDefault();
        let _name = event.target.name;
        this.setState({ [_name]: event.target.value });
        if (_name === 'SearchTypeCode') { this._getGridData(event.target.value); }
    }

    // insert & search data onchange
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
            let _data = JSON.parse(JSON.stringify(data));
            let _modal = this.state.modal;
            _modal.data = _data;
            _modal.title = "修改";
            _modal.show = !_modal.show;
            this.setState({ modal: _modal });
        }

        const modalOnHide = () => {
            let _modal = this.state.modal;
            _modal.show = !_modal.show;
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
                        Swal.fire(
                            '完成修改!',
                            '修改成功.',
                            'success'
                        )
                        this._getGridData([this.state.SearchTypeCode]);
                    } else {
                        Swal.fire(
                            'Fail!',
                            _res.msg,
                            'error'
                        )
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
                        Swal.fire(
                            '完成刪除!',
                            '刪除成功.',
                            'success'
                        )
                        this._getGridData([this.state.SearchTypeCode]);
                    } else {
                        Swal.fire(
                            'Fail!',
                            _res.msg,
                            'error'
                        )
                    }
                }
            })
        }

        const modalCols = [
            { field: 'label', headerName: '項目', type: 'text', className: 'mb-6 col-6' },
        ]

        const columns = [
            { field: 'seq', headerName: '序', flex: 1 },
            { field: 'label', headerName: '項目', flex: 2 },
            {
                field: 'actions', headerName: 'Actions', flex: 1,
                renderCell: (params) => {
                    return (
                        <>
                            <Edit className="matGridEdit" onClick={(e) => modalOpen(e, params.row)} />
                            <DeleteOutline className="matGridDelete" onClick={(e) => handleDelete(e, params.row)} />
                            {this.state.modal.show ?
                                <CustomModal show={this.state.modal.show} onHide={modalOnHide} modalData={this.state.modal}
                                    modalCols={modalCols} submitForm={(e, data) => { submitForm(e, data) }}
                                /> : ''
                            }
                        </>
                    )
                }
            },
        ];

        return (
            <div className="adminMatCode">
                <div className="adminMatCodeWrapper">
                    <div className="adminMatCodeBody">
                        <div className="adminMatCodeItem">
                            <a href="/#" className="itemTitle" name="insertWrapper" onClick={this.WrapperOpen}>
                                代碼新增
                                <Eject className={this.state.WrapperOpen.insertWrapper ? 'itemIconRotate active' : 'itemIconRotate noActive'} /></a>
                            <div className={this.state.WrapperOpen.insertWrapper ? 'adminMatCodeItemWrapper active' : 'adminMatCodeItemWrapper'}>
                                <Container>
                                    <Row className="justify-content-md-center">
                                        <Col xs={12} md={4}>
                                            <FloatingLabel controlId="floatingSelectType" label="類別">
                                                <Form.Select aria-label="Floating label select" name='type' value={this.state.insertData.type} onChange={(e) => { this.handleDataChange(e, "insertData") }} >
                                                    {this.state.SelectOption.map(({ value, label }, index) => <option key={index} value={value} >{label}</option>)}
                                                </Form.Select>
                                            </FloatingLabel>
                                        </Col>
                                        <Col xs={12} md={4}>
                                            <FloatingLabel controlId="floatingInputLabel" label="項目" className="mb-1 ">
                                                <Form.Control type="text" placeholder="項目" name='label' value={this.state.insertData.label} onChange={(e) => { this.handleDataChange(e, "insertData") }} />
                                            </FloatingLabel>
                                        </Col>
                                    </Row>
                                    <Row className="justify-content-md-center">
                                        <Col xs={3} md={3}>
                                            <Button className="btn" variant="outline-primary" onClick={this.insertData}>新增</Button>
                                            <Button className="btn" variant="outline-secondary" name="insertData" onClick={this.dataClear}>清除新增</Button>
                                        </Col>
                                    </Row>
                                </Container>
                            </div>
                        </div>

                        <div className="adminMatCodeItem">
                            <div className="adminMatCodeItemTitle">
                                <span className="adminMatCodeItemTitle">代碼查詢</span>
                            </div>
                            <div className="adminMatCodeItemContainer">
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

                            <div className="adminMatCodeItemContainer">
                                <div className="matCodeDataList">
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

