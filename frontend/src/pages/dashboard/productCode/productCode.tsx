import { Component } from 'react'
import styles from './productCode.module.scss'
import { clsx } from 'clsx'

import { postData } from "@/api";
import { getSelectOption } from '@/utility';
import Button from '@/components/button/Button';
import { CustomModal } from '@/components/modal/customModal';
import { customAlert, customToastTopEnd } from '@/components/customAlert/customAlert';

import FloatingLabel from 'react-bootstrap/FloatingLabel'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'

import { DataGrid } from '@mui/x-data-grid';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import EjectIcon from '@mui/icons-material/Eject';


export class productCode extends Component<any, StateType> {
    constructor(props) {
        super(props);
        this.state = {
            wrapperOpen: {
                isInsertWrapper: true,
            },
            searchTypeCode: '',
            selectOption: [],
            insertData: {
                type: '', label: '', value: '', mark: ''
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
        this.handleDelete = this.handleDelete.bind(this);
        // #endregion
    }

    componentDidMount() {
        this._getSelectOption();
    }

    //get query select option
    async _getSelectOption() {
        let _selectOption = await getSelectOption('product');
        this.setState({ selectOption: _selectOption })
    }

    //??????????????????
    async insertData(event) {
        event.preventDefault();
        this.setState({ isLoadingInsert: true });
        if (this.state.insertData.label === '') {
            customToastTopEnd.fire('NO NO!', '???????????? ??????!', 'error')
        }
        // else if (this.state.insertData.value.match("^[a-zA-Z0-9 ]*$") == null) {
        //   //check 
        // customToastTopEnd.fire('NO NO!', '??????????????????????????????!', 'error')
        // } 
        else {
            this.props.setLoading(true);
            let _res = await postData("/api/codeManage/insertCodeData", this.state.insertData);
            this.props.setLoading(false);
            if (_res.ack === 'OK') {
                customToastTopEnd.fire('OK!', '??????????????????!', 'success')
                this._getGridData([this.state.searchTypeCode]);
            } else if (_res.ackDesc === 'code_ChkRepeated') {
                customToastTopEnd.fire('NO NO!', '????????????????????? ??????!', 'error')
            } else {
                customToastTopEnd.fire('NO NO!', _res.ackDesc, 'error')
            }
        }
        this.setState({ isLoadingInsert: false });
    }


    handleChange(event) {
        event.preventDefault();
        let _name = event.target.name;
        this.setState({ [_name]: event.target.value });
        if (_name === 'searchTypeCode') { this._getGridData(event.target.value); }
    }

    // insert data onchange
    handleDataChange(event, action) {
        let _action = this.state[action];
        let _name = event.target.name;
        // input type change (if type == number && value !=='' then string => number)
        _action[_name] = (event.target.type === 'number' && event.target.value !== '') ? Number(event.target.value) : event.target.value;
        this.setState({ [action]: _action });
    }

    //get grid data
    async _getGridData(data) {
        if (data === '') {
            this.setState({ gridData: [] });
        } else {
            let qryTmp = [data];
            this.props.setLoading(true);
            let _res = await postData("/api/codeManage/getSelectOption", qryTmp);
            if (_res.ack === 'OK') {
                let _gridData = [];
                //??????'**'
                for (let ele in _res.data[data]) {
                    if (_res.data[data][ele].value !== '**') { _gridData.push(_res.data[data][ele]) }
                }
                //create seq
                for (let i = 0; i < _gridData.length; i++) {
                    _gridData[i].seq = (i + 1);
                }
                this.setState({ gridData: _gridData });
            } else {
                customToastTopEnd.fire('NO NO!', 'Search fail', 'error');
                this.setState({ gridData: [] });
            }
            this.props.setLoading(false);
        }
    }

    // wrapper switch
    wrapperOpen(actionName: string, event) {
        event.preventDefault();
        this.setState((prev) => ({
            wrapperOpen: { ...prev.wrapperOpen, [actionName]: !prev.wrapperOpen[actionName] }
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
                title: '??????',
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
        customAlert.fire({ title: '????????????????', icon: 'warning' })
            .then(async (result) => {
                if (result.isConfirmed) {
                    this.props.setLoading(true);
                    let _res = await postData("/api/codeManage/editCodeData", data);
                    this.props.setLoading(false);
                    if (_res.ack === 'OK') {
                        customToastTopEnd.fire('????????????!', '????????????.', 'success')
                        this._getGridData([this.state.searchTypeCode]);
                    } else {
                        customToastTopEnd.fire('Fail!', _res.ackDesc, 'error')
                    }
                }
            })
        this.modalOnHide();
    }

    // #endregion

    // #region [Grid]
    // delete
    async handleDelete(event, data) {
        event.preventDefault();
        customAlert.fire({ title: '????????????????', icon: 'warning' })
            .then(async (result) => {
                if (result.isConfirmed) {
                    this.props.setLoading(true);
                    let _res = await postData("/api/codeManage/deleteCodeData", data);
                    this.props.setLoading(false);
                    if (_res.ack === 'OK') {
                        customToastTopEnd.fire('????????????!', '????????????.', 'success')
                        this._getGridData([this.state.searchTypeCode]);
                    } else {
                        customToastTopEnd.fire('Fail!', _res.ackDesc, 'error')
                    }
                }
            })
    }

    // #endregion

    render() {
        const { searchTypeCode, modal, wrapperOpen, selectOption, insertData, isLoadingInsert, gridData } = this.state;

        // #region [Modal]
        const _tmpModalCols_mark = searchTypeCode === 'product_catena' || searchTypeCode === 'product_single' ?
            { field: 'mark', headerName: '??????', type: 'text', className: 'mb-2 col-12' }
            : { field: '', headerName: '', hide: true };

        // const _tmpModalCols_value = searchTypeCode === 'product_catena' || searchTypeCode === 'product_single' ?
        //     { field: 'value', headerName: 'value', type: 'text', className: 'mb-2 col-12' }
        //     : { field: '', headerName: '', hide: true };

        const modalCols = [
            { field: 'label', headerName: '??????', type: 'text', className: 'mb-2 col-4' },
            _tmpModalCols_mark,
        ]

        const _tmpCols_value = searchTypeCode === 'product_catena' || searchTypeCode === 'product_single' ?
            { field: 'value', headerName: '??????', flex: 1 } : { field: 'hide', headerName: '' };

        const _tmpCols_mark = searchTypeCode === 'product_catena' || searchTypeCode === 'product_single' ?
            { field: 'mark', headerName: '??????', flex: 1 } : { field: 'hide', headerName: '' };

        //???????????????????????? 
        const columnVisibilityModel = { hide: false };

        const columns = [
            { field: 'seq', headerName: '???', flex: 1 },
            { field: 'label', headerName: '??????', flex: 2 },
            _tmpCols_value,
            _tmpCols_mark,
            {
                field: 'actions', headerName: 'Actions', flex: 2,
                renderCell: (params) => {
                    return (
                        <>
                            <Button variant="text" startIcon={<EditIcon />} themeColor='success'
                                onClick={(e) => this.modalOpen(e, params.row)} />
                            <Button variant="text" startIcon={<DeleteOutlineIcon />} themeColor='error'
                                onClick={(e) => this.handleDelete(e, params.row)} />
                        </>
                    )
                }
            },
        ];
        // #endregion

        return (
            <div className={styles.productCode}>
                <div className={styles.wrapper}>
                    <div className={styles.items}>
                        <a href="#" className="itemTitle" onClick={(e) => { this.wrapperOpen('isInsertWrapper', e) }}>
                            ????????????
                            <EjectIcon className={clsx('itemIconRotate', wrapperOpen.isInsertWrapper && 'active', !wrapperOpen.isInsertWrapper && 'noActive')} /></a>
                        <div className={clsx(styles.itemWrapper, wrapperOpen.isInsertWrapper && [styles.active, 'neumorphismFlat'])}>
                            <Container>
                                <Row className="justify-content-md-center">
                                    <Col xs={12} md={3}>
                                        <FloatingLabel controlId="floatingSelectType" label="??????">
                                            <Form.Select aria-label="Floating label select" name='type' value={insertData.type} onChange={(e) => { this.handleDataChange(e, "insertData") }} >
                                                {selectOption.map(({ value, label }, index) => <option key={index} value={value} >{label}</option>)}
                                            </Form.Select>
                                        </FloatingLabel>
                                    </Col>
                                    <Col xs={12} md={3}>
                                        <FloatingLabel controlId="floatingInputLabel" label="??????" className="mb-1 ">
                                            <Form.Control type="text" placeholder="??????" name='label' value={insertData.label} onChange={(e) => { this.handleDataChange(e, "insertData") }} />
                                        </FloatingLabel>
                                    </Col>
                                    {insertData.type === 'product_catena' || insertData.type === 'product_single' ?
                                        <>
                                            <Col xs={12} md={3}>
                                                <FloatingLabel controlId="floatingInputMark" label="??????(3???)" className="mb-1 ">
                                                    <Form.Control type="text" placeholder="??????(3???)" name='value' maxLength={3} value={insertData.value} onChange={(e) => { this.handleDataChange(e, "insertData") }} />
                                                </FloatingLabel>
                                            </Col>
                                            <Col xs={12} md={3}>
                                                <FloatingLabel controlId="floatingInputMark" label="??????" className="mb-1 ">
                                                    <Form.Control type="text" placeholder="??????" name='mark' value={insertData.mark} onChange={(e) => { this.handleDataChange(e, "insertData") }} />
                                                </FloatingLabel>
                                            </Col>
                                        </> : null
                                    }
                                </Row>

                                <Row className="justify-content-md-center">
                                    <Col xs={12} md={{ span: 6, offset: 3 }} className="btnGroup">
                                        <Button variant="contained" onClick={this.insertData} isLoading={isLoadingInsert}>??????</Button>
                                        <Button variant="contained" themeColor="success" onClick={this.dataClear}>????????????</Button>
                                    </Col>
                                </Row>
                            </Container>
                        </div>
                    </div>

                    <div className={styles.items}>
                        <a className="itemTitle">????????????</a>
                        <div className={styles.itemContainer}>
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

                        <div className={styles.itemContainer}>
                            <div className={styles.dataList}>
                                <DataGrid
                                    rows={gridData}
                                    columns={columns}
                                    pageSize={10}
                                    rowsPerPageOptions={[10]}
                                    disableSelectionOnClick
                                    columnVisibilityModel={columnVisibilityModel}
                                    getRowId={(row: { seq: number }) => row.seq}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* modal */}
                {modal.isShow ?
                    <CustomModal
                        isShow={modal.isShow}
                        onHide={this.modalOnHide}
                        title={modal.title}
                        modalData={modal.data}
                        modalCols={modalCols}
                        submitForm={(e, data) => { this.submitForm(e, data) }}
                    /> : null
                }

            </div >
        )
    }
}


type StateType = {
    wrapperOpen?: { isInsertWrapper: boolean },
    searchTypeCode?: string,
    insertData?: { type: string, label: string, value: string, mark: string },
    selectOption?: { value: string, label: string, }[],
    gridData?: {}[],
    modal?: { isShow: boolean, title: string, data: {}, },
    isLoadingInsert?: boolean,
}
