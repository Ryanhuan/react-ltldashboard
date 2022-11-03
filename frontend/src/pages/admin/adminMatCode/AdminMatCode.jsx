import './adminMatCode.scss'
import { Component } from 'react'
import { DataGrid } from '@mui/x-data-grid';
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import { DeleteOutline, Edit, Eject } from '@material-ui/icons';
import { postData } from "../../../api";
import Button from '../../../components/button/Button'
import { getSelectOption } from '../../../utility.ts'
import { CustomModal } from '../../../components/modal/customModal';
import { customAlert } from '../../../components/customAlert/customAlert';

export class AdminMatCode extends Component {
    constructor(props) {
        super(props);
        this.state = {
            wrapperOpen: {
                isInsertWrapper: false,
            },
            searchTypeCode: '',
            selectOption: [],
            insertData: {
                type: '', label: '',
            },
            gridData: [],
            modal: {
                isShow: false, title: '', data: {},
            },
            isLoadingInsert: false,
        };
        // #region [bind]
        this.insertData = this.insertData.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.wrapperOpen = this.wrapperOpen.bind(this);
        this.dataClear = this.dataClear.bind(this);
        this.modalOpen = this.modalOpen.bind(this);
        this.modalOnHide = this.modalOnHide.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.handleGridDelete = this.handleGridDelete.bind(this);
        // #endregion
    }

    componentDidMount() {
        this._getSelectOption();
    }

    //get query select option
    async _getSelectOption() {
        let _selectOption = await getSelectOption('ma');
        this.setState({ selectOption: _selectOption })
    }

    //材料新增材料
    async insertData(event) {
        event.preventDefault();
        this.setState({ isLoadingInsert: !this.state.isLoadingInsert });
        if (this.state.insertData.label === '') {
            customAlert.fire({
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
                customAlert.fire({
                    position: 'bottom-end',
                    width: 400,
                    icon: 'success',
                    title: '新增材料成功!',
                    showConfirmButton: false,
                    timer: 1500
                })
                this._getGridData([this.state.searchTypeCode]);
            } else if (_res.msg === 'code_ChkRepeated') {
                //失敗 代碼重複
                customAlert.fire({
                    position: 'bottom-end',
                    width: 400,
                    icon: 'error',
                    title: '代碼或代碼描述 重複!',
                    showConfirmButton: false,
                    timer: 1500
                })
            } else {
                //失敗 其他錯誤
                customAlert.fire({
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
        if (_name === 'searchTypeCode') { this._getGridData(event.target.value); }
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
                customAlert.fire({
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
    wrapperOpen(event) {
        event.preventDefault();
        this.setState((prev) => ({
            wrapperOpen: { ...prev.wrapperOpen, [event.target.name]: !prev.wrapperOpen[event.target.name] }
        }));
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


    // #region [Modal]
    modalOpen(event, data) {
        event.preventDefault();
        this.setState((prev) => ({
            modal: {
                ...prev.modal,
                data: JSON.parse(JSON.stringify(data)),
                title: '修改',
                isShow: !prev.modal.isShow
            }
        }));
    }

    modalOnHide() {
        this.setState((prev) => ({
            modal: { ...prev.modal, isShow: !prev.modal.isShow }
        }));
    }

    async submitForm(event, data) {
        event.preventDefault();
        customAlert.fire({
            title: '確定要修改?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: '取消',
            confirmButtonText: '確定',
        }).then(async (result) => {
            if (result.isConfirmed) {
                let _res = await postData("/api/editCodeData", data);
                if (_res.status === 'editCodeData_OK') {
                    customAlert.fire('完成修改!', '修改成功.', 'success')
                    this._getGridData([this.state.searchTypeCode]);
                } else {
                    customAlert.fire('Fail!', _res.msg, 'error')
                }
            }
        })
        this.modalOnHide();
    }

    // #endregion

    // #region [Grid]
    // delete
    async handleGridDelete(event, data) {
        event.preventDefault();
        customAlert.fire({
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
                    customAlert.fire('完成刪除!', '刪除成功.', 'success')
                    this._getGridData([this.state.searchTypeCode]);
                } else {
                    customAlert.fire('Fail!', _res.msg, 'error')
                }
            }
        })
    }

    // #endregion

    render() {
        const { modal, selectOption, wrapperOpen, insertData, isLoadingInsert, searchTypeCode, gridData } = this.state;

        // #region [Grid]
        //grid 
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
                            <Button variant="text" startIcon={<Edit />} themeColor='success' onClick={(e) => this.modalOpen(e, params.row)} />
                            <Button variant="text" startIcon={<DeleteOutline />} themeColor='error' onClick={(e) => this.handleGridDelete(e, params.row)} />
                            {this.state.modal.isShow ?
                                <CustomModal isShow={modal.isShow} onHide={this.modalOnHide} modalData={modal}
                                    modalCols={modalCols} submitForm={(e, data) => { this.submitForm(e, data) }} /> : null
                            }
                        </>
                    )
                }
            },
        ];

        // #endregion

        return (
            <div className="adminMatCode">
                <div className="adminWrapper">
                    <div className="adminItems">
                        <a href="/#" className="itemTitle" name="isInsertWrapper" onClick={this.wrapperOpen}>
                            代碼新增
                            <Eject className={wrapperOpen.isInsertWrapper ? 'itemIconRotate active' : 'itemIconRotate noActive'} /></a>
                        <div className={wrapperOpen.isInsertWrapper ? 'adminItemWrapper active' : 'adminItemWrapper'}>
                            <Container>
                                <Row className="justify-content-md-center">
                                    <Col xs={12} md={4}>
                                        <FloatingLabel controlId="floatingSelectType" label="類別">
                                            <Form.Select aria-label="Floating label select" name='type' value={insertData.type} onChange={(e) => { this.handleDataChange(e, "insertData") }} >
                                                {selectOption.map(({ value, label }, index) => <option key={index} value={value} >{label}</option>)}
                                            </Form.Select>
                                        </FloatingLabel>
                                    </Col>
                                    <Col xs={12} md={4}>
                                        <FloatingLabel controlId="floatingInputLabel" label="項目" className="mb-1 ">
                                            <Form.Control type="text" placeholder="項目" name='label' value={insertData.label} onChange={(e) => { this.handleDataChange(e, "insertData") }} />
                                        </FloatingLabel>
                                    </Col>
                                </Row>
                                <Row className="justify-content-md-center">
                                    <Col xs={12} md={{ span: 6, offset: 3 }} className="btnGroup">
                                        <Button variant="contained" onClick={this.insertData} isLoading={isLoadingInsert} >新增</Button>
                                        <Button variant="contained" themeColor="success" onClick={this.dataClear} >清除新增</Button>
                                    </Col>
                                </Row>
                            </Container>
                        </div>
                    </div>

                    <div className="adminItems">
                        <div className="adminItemsTitle">
                            <span className="itemTitle">代碼查詢</span>
                        </div>
                        <div className="adminItemsContainer">
                            <Container>
                                <Row>
                                    <Col xs={12} md={3}>
                                        <FloatingLabel controlId="floatingSelectSearch" label="Search">
                                            <Form.Select aria-label="Floating label select" name='searchTypeCode' value={searchTypeCode} onChange={this.handleChange} >
                                                {selectOption.map(({ value, label }, index) => <option key={index} value={value} >{label}</option>)}
                                            </Form.Select>
                                        </FloatingLabel>
                                    </Col>
                                </Row>
                            </Container>
                        </div>

                        <div className="adminItemsContainer">
                            <div className="matCodeDataList">
                                <DataGrid
                                    rows={gridData}
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
        )
    }
}

