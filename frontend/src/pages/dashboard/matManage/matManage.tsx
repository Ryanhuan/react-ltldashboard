import { Component } from 'react'
import styles from './matManage.module.scss'
import { clsx } from 'clsx';
import { postData } from "@/api";
import Button from '@/components/button/Button';
import { CustomModal } from '@/components/modal/customModal';
import { customAlert, customToastTopEnd } from '@/components/customAlert/customAlert';

import FloatingLabel from 'react-bootstrap/FloatingLabel'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'

import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import EjectIcon from '@mui/icons-material/Eject';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';


export class matManage extends Component<any, StateType> {
    constructor(props: {}) {
        super(props);
        this.state = {
            wrapperOpen: {
                isInsertWrapper: false,
                isSearchWrapper: false,
            },
            insertData: {
                id: '', type: '', name: '', size: '', quality: '', store_name: '', price: 0, num: 0, price_per: 0, memo: '',
            },
            searchData: {
                id: '', type: '', name: '', size: '', quality: '', storeName: '', lowPrice: '', highPrice: '', lowPricePer: '', highPricePer: '', memo: '',
            },
            selectOption: {
                ma_type: [],
                ma_quality: [],
            },
            gridData: [],
            modal: {
                isShow: false, title: '', data: { type: '', quality: '' },
            },
            isLoadingInsert: false,
            isLoadingSearch: false,
        };
        // #region [bind]
        this.insertData = this.insertData.bind(this);
        this.searchData = this.searchData.bind(this);
        this.dataClear = this.dataClear.bind(this);
        this.wrapperOpen = this.wrapperOpen.bind(this);
        this.handleDataChange = this.handleDataChange.bind(this);
        this.selectOptionChange = this.selectOptionChange.bind(this);
        this.modalOpen = this.modalOpen.bind(this);
        this.modalOnHide = this.modalOnHide.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.handleGridDelete = this.handleGridDelete.bind(this);
        // #endregion

        //func
        this._getSelectOption();
    }

    componentDidMount() {
        this._getMatData({});
    }

    //get select Option 
    async _getSelectOption() {
        //copy state.SelectOption
        let _selectOption = this.state.selectOption;
        //qry from state.SelectOption
        let qryTmp = Object.keys(_selectOption);
        //get Select Option res 
        let _res = await postData("/api/codeManage/getSelectOption", qryTmp);
        //update Select Option data
        if (_res.ack === 'OK') {
            qryTmp.forEach(ele => {
                _selectOption[ele].push({ value: '', label: '==?????????==' })
                _res.data[ele].forEach((ele_res: { value: string, label: string }) => {
                    if (ele_res.value !== '**') { _selectOption[ele].push(ele_res) }
                })
            })
        } else {
            customToastTopEnd.fire('NO NO!', _res.ackDesc, 'error');
        }
    }

    //get mat data for grid
    async _getMatData(qryData: {}) {
        let _res = await postData("/api/mat/getMatData", qryData);
        if (_res.ack === 'OK') {
            let _gridData = _res.data;
            delete _gridData.guid;
            for (let i = 0; i < _gridData.length; i++) {
                _gridData[i].seq = (i + 1);
            }
            this.setState({ gridData: [..._gridData] });
        } else {
            customToastTopEnd.fire('NO NO!', _res.ackDesc, 'error');
        }
    }

    //??????????????????
    async insertData(event) {
        event.preventDefault();
        this.setState({ isLoadingInsert: true });
        this.props.setLoading(true);
        // console.log(this.state.insertData);
        if (this.state.insertData.id === '' || this.state.insertData.id === null) {
            customToastTopEnd.fire('NO NO!', 'ID ??????!', 'error')
        } else {
            let _insertData: I_insertData = this.state.insertData;
            let _res = await postData("/api/mat/insertMatData", this.state.insertData);
            this.props.setLoading(false);
            if (_res.ack === 'OK') {
                customToastTopEnd.fire('OK!', '??????????????????!', 'success')
                this._getMatData({});
            } else if (_res.ackDesc === 'ID_Repeated') {
                customToastTopEnd.fire('NO NO!', 'ID ??????!', 'error')
            } else {
                customToastTopEnd.fire('NO NO!', JSON.stringify(_res.ackDesc), 'error')
            }
        }
        this.setState({ isLoadingInsert: false });
    }

    //??????????????????
    async searchData(event) {
        event.preventDefault();
        this.setState({ isLoadingSearch: true });
        if (this.state.searchData.lowPricePer > this.state.searchData.highPrice) {
            customToastTopEnd.fire('NO NO!', '????????????????????????????????????', 'error')
        } else {
            this._getMatData(this.state.searchData);
        }
        this.setState({ isLoadingSearch: false });
    }

    // insert & search data onchange
    handleDataChange(event, action: string) {
        action = action + 'Data';
        let _action = this.state[action];
        let _name = event.target.name;
        // input type change (if type == number && value !=='' then string => number)
        _action[_name] = (event.target.type === 'number' && event.target.value !== '') ? Number(event.target.value) : _action[_name] = event.target.value;
        this.setState({ [action]: _action });

        if (action === "insertData") {
            //????????????
            if ((_name === 'price' && this.state.insertData.num !== 0) || _name === 'num') {
                let tmpPrice = this.state.insertData.price / this.state.insertData.num;
                _action.price_per = Math.round(tmpPrice * 10) / 10;
                this.setState({ insertData: _action });
            }
        }
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

    // wrapper switch
    wrapperOpen(actionName: string, event) {
        event.preventDefault();
        this.setState((prev) => ({
            wrapperOpen: { ...prev.wrapperOpen, [actionName]: !prev.wrapperOpen[actionName] }
        }));
    }

    selectOptionChange(value: string, selectOptions: {}) {
        for (let ele in selectOptions) {
            if (selectOptions[ele].label === value) { return selectOptions[ele].value }
        }
    }

    // #region [Modal]
    modalOpen(event, data) {
        event.preventDefault();
        this.setState((prev) => ({
            modal: {
                ...prev.modal,
                data: {
                    ...JSON.parse(JSON.stringify(data)),
                    type: this.selectOptionChange(prev.modal.data.type, this.state.selectOption.ma_type),
                    quality: this.selectOptionChange(prev.modal.data.quality, this.state.selectOption.ma_quality),
                },
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

    //edit submit
    async submitForm(event, data) {
        event.preventDefault();
        customAlert.fire({ title: '????????????????', icon: 'warning' })
            .then(async (result) => {
                if (result.isConfirmed) {
                    this.props.setLoading(true);
                    let _res = await postData("/api/mat/editMatData", data);
                    this.props.setLoading(false);
                    if (_res.ack === 'OK') {
                        customToastTopEnd.fire('OK!', '????????????!', 'success')
                        this._getMatData({});
                    } else {
                        customToastTopEnd.fire('NO NO!', _res.ackDesc, 'error')
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
        customAlert.fire({ title: '????????????????', icon: 'warning' })
            .then(async (result) => {
                if (result.isConfirmed) {
                    this.props.setLoading(true);
                    let _res = await postData("/api/mat/deleteMatData", data);
                    this.props.setLoading(false);
                    if (_res.ack === 'OK') {
                        customToastTopEnd.fire('OK!', '????????????.', 'success')
                        this._getMatData({});
                    } else {
                        customToastTopEnd.fire('NO NO!', _res.ackDesc, 'error')
                    }
                }
            })
    }

    // #endregion
    render() {
        const { selectOption, modal, wrapperOpen, insertData, searchData, isLoadingInsert, isLoadingSearch, gridData } = this.state;

        const modalCols = [
            { field: 'id', headerName: 'ID', type: 'text', className: 'mb-2 col-4 ' },
            { field: 'type', headerName: '??????', type: 'dropDown', className: 'mb-2 col-4', selectOption: selectOption.ma_type },
            { field: 'name', headerName: '??????', type: 'text', className: 'mb-2 col-4 ' },
            { field: 'size', headerName: '??????', type: 'text', className: 'mb-2 col-4 ' },
            { field: 'quality', headerName: '??????', type: 'dropDown', className: 'mb-2 col-4 ', selectOption: selectOption.ma_quality },
            { field: 'store_name', headerName: '??????', type: 'text', className: 'mb-2 col-4 ' },
            { field: 'price', headerName: '??????', type: 'number', className: 'mb-2 col-4 ' },
            { field: 'num', headerName: '??????', type: 'number', className: 'mb-2 col-4 ' },
            { field: 'price_per', headerName: '??????(???)', type: 'number', className: 'mb-2 col-4 ', disabled: true },
            { field: 'memo', headerName: '??????', type: 'text', className: 'mb-2 col-12 ' },
        ]

        const columns = [
            { field: 'seq', headerName: '???', flex: 1 },
            { field: 'id', headerName: 'ID', flex: 1 },
            { field: 'type', headerName: '??????', flex: 1 },
            { field: 'name', headerName: '??????', flex: 1 },
            { field: 'size', headerName: '??????', flex: 1 },
            { field: 'quality', headerName: '??????', flex: 1 },
            { field: 'price_per', headerName: '??????(???)', flex: 1 },
            {
                field: 'actions', headerName: 'Actions', flex: 2,
                renderCell: (params) => {
                    return (
                        <>
                            <Button variant="text" startIcon={<EditIcon />} themeColor='success' onClick={(e) => this.modalOpen(e, params.row)} />
                            <Button variant="text" startIcon={<DeleteOutlineIcon />} themeColor='error' onClick={(e) => this.handleGridDelete(e, params.row)} />
                        </>
                    )
                }
            },
        ];

        return (
            <div className={styles.matManage}>
                <div className={styles.wrapper}>
                    {/* insert */}
                    <div className={styles.items}>
                        <a href="#" className="itemTitle" onClick={(e) => { this.wrapperOpen('isInsertWrapper', e) }}>
                            ????????????
                            <EjectIcon className={clsx('itemIconRotate', wrapperOpen.isInsertWrapper && 'active', !wrapperOpen.isInsertWrapper && 'noActive')} /></a>
                        <div className={clsx(styles.itemWrapper, wrapperOpen.isInsertWrapper && [styles.active, 'neumorphismFlat'])} >
                            <Container>
                                <Row className={clsx("justify-content-md-center", styles.insertRow)}>
                                    <Col xs={12} md={4}>
                                        <FloatingLabel controlId="floatingInputId" label="ID" className="mb-1 ">
                                            <Form.Control type="text" placeholder="ID" name='id' value={insertData.id} onChange={(e) => { this.handleDataChange(e, "insert") }} />
                                        </FloatingLabel>
                                    </Col>
                                    <Col xs={12} md={4}>
                                        <FloatingLabel controlId="floatingSelectType" label="??????" className="mb-1 ">
                                            <Form.Select aria-label="Floating label select" name='type' value={insertData.type} onChange={(e) => { this.handleDataChange(e, "insert") }} >
                                                {selectOption.ma_type.map(({ value, label }, index) => <option key={index} value={value} >{label}</option>)}
                                            </Form.Select>
                                        </FloatingLabel>
                                    </Col>
                                    <Col xs={12} md={4}>
                                        <FloatingLabel controlId="floatingInputName" label="??????" className="mb-1 ">
                                            <Form.Control type="text" placeholder="??????" name='name' value={insertData.name} onChange={(e) => { this.handleDataChange(e, "insert") }} />
                                        </FloatingLabel>
                                    </Col>
                                </Row>

                                <Row className={clsx("justify-content-md-center", styles.insertRow)}>
                                    <Col xs={12} md={4}>
                                        <FloatingLabel controlId="floatingInputSize" label="??????" className="mb-1 ">
                                            <Form.Control type="text" placeholder="??????" name='size' value={insertData.size} onChange={(e) => { this.handleDataChange(e, "insert") }} />
                                        </FloatingLabel>
                                    </Col>
                                    <Col xs={12} md={4}>
                                        <FloatingLabel controlId="floatingSelectQuality" label="??????">
                                            <Form.Select aria-label="Floating label select" name='quality' value={insertData.quality} onChange={(e) => { this.handleDataChange(e, "insert") }} >
                                                {selectOption.ma_quality.map(({ value, label }, index) => <option key={index} value={value} >{label}</option>)}
                                            </Form.Select>
                                        </FloatingLabel>
                                    </Col>
                                    <Col xs={12} md={4}>
                                        <FloatingLabel controlId="floatingInputStoreName" label="??????" className="mb-1 ">
                                            <Form.Control type="text" placeholder="??????" name='store_name' value={insertData.store_name} onChange={(e) => { this.handleDataChange(e, "insert") }} />
                                        </FloatingLabel>
                                    </Col>
                                </Row>

                                <Row className={clsx("justify-content-md-center", styles.insertRow)}>
                                    <Col xs={12} md={4}>
                                        <FloatingLabel controlId="floatingInputPrice" label="??????" className="mb-1 ">
                                            <Form.Control type="number" placeholder="??????" name='price' value={insertData.price || ''} onChange={(e) => { this.handleDataChange(e, "insert") }} />
                                        </FloatingLabel>
                                    </Col>
                                    <Col xs={12} md={4}>
                                        <FloatingLabel controlId="floatingInputNum" label="??????" className="mb-1 ">
                                            <Form.Control type="number" placeholder="??????" name='num' value={insertData.num || ''} onChange={(e) => { this.handleDataChange(e, "insert") }} />
                                        </FloatingLabel>
                                    </Col>
                                    <Col xs={12} md={4}>
                                        <FloatingLabel controlId="floatingInputPricePer" label="??????" className="mb-1 ">
                                            <Form.Control type="number" placeholder="??????" name='price_per' value={insertData.price_per || ''} onChange={(e) => { this.handleDataChange(e, "insert") }} disabled readOnly />
                                        </FloatingLabel>
                                    </Col>
                                </Row>

                                <Row className={clsx("justify-content-md-center", styles.insertRow)}>
                                    <Col xs={12} md={12}>
                                        <FloatingLabel controlId="floatingInputMemo" label="??????" className="mb-1 ">
                                            <Form.Control type="text" placeholder="??????" name='memo' value={insertData.memo} onChange={(e) => { this.handleDataChange(e, "insert") }} />
                                        </FloatingLabel>
                                    </Col>
                                </Row>

                                <Row className={clsx("justify-content-md-center", styles.insertRow)}>
                                    <Col xs={12} md={{ span: 6, offset: 3 }} className="btnGroup">
                                        <Button variant="contained" onClick={this.insertData} isLoading={isLoadingInsert}>??????</Button>
                                        <Button variant="contained" themeColor="success" name="insertData" onClick={this.dataClear}>????????????</Button>
                                    </Col>
                                </Row>
                            </Container>
                        </div>
                    </div>

                    {/* search */}
                    <div className={styles.items}>
                        <a href="/#" className="itemTitle" onClick={(e) => { this.wrapperOpen('isSearchWrapper', e) }}>
                            ????????????
                            <EjectIcon className={clsx('itemIconRotate', wrapperOpen.isSearchWrapper && 'active', !wrapperOpen.isSearchWrapper && 'noActive')} /></a>
                        <div className={clsx(styles.itemWrapper, styles.search, wrapperOpen.isSearchWrapper && [styles.active, 'neumorphismFlat'])}>
                            <Container>
                                <Row className={clsx("justify-content-md-center", styles.insertRow)}>
                                    <Col xs={12} md={3}>
                                        <FloatingLabel controlId="floatingInputIdSearch" label="ID" className="mb-1 ">
                                            <Form.Control type="text" placeholder="ID" name='id' value={searchData.id} onChange={(e) => { this.handleDataChange(e, "search") }} />
                                        </FloatingLabel>
                                    </Col>
                                    <Col xs={12} md={3}>
                                        <FloatingLabel controlId="floatingSelectTypeSearch" label="??????">
                                            <Form.Select aria-label="Floating label select" name='type' value={searchData.type} onChange={(e) => { this.handleDataChange(e, "search") }} >
                                                {selectOption.ma_type.map(({ value, label }, index) => <option key={index} value={value} >{label}</option>)}
                                            </Form.Select>
                                        </FloatingLabel>
                                    </Col>
                                    <Col xs={12} md={3}>
                                        <FloatingLabel controlId="floatingInputNameSearch" label="??????" className="mb-1 ">
                                            <Form.Control type="text" placeholder="??????" name='name' value={searchData.name} onChange={(e) => { this.handleDataChange(e, "search") }} />
                                        </FloatingLabel>
                                    </Col>
                                    <Col xs={12} md={3}>
                                        <FloatingLabel controlId="floatingInputSizeSearch" label="??????" className="mb-1 ">
                                            <Form.Control type="text" placeholder="??????" name='size' value={searchData.size} onChange={(e) => { this.handleDataChange(e, "search") }} />
                                        </FloatingLabel>
                                    </Col>
                                </Row>

                                <Row className={clsx("justify-content-md-center", styles.insertRow)}>
                                    <Col xs={12} md={3}>
                                        <FloatingLabel controlId="floatingSelectQualitySearch" label="??????">
                                            <Form.Select aria-label="Floating label select" name='quality' value={searchData.quality} onChange={(e) => { this.handleDataChange(e, "search") }} >
                                                {selectOption.ma_quality.map(({ value, label }, index) => <option key={index} value={value} >{label}</option>)}
                                            </Form.Select>
                                        </FloatingLabel>
                                    </Col>
                                    <Col xs={12} md={3}>
                                        <FloatingLabel controlId="floatingInputStoreNameSearch" label="??????" className="mb-1 ">
                                            <Form.Control type="text" placeholder="??????" name='storeName' value={searchData.storeName} onChange={(e) => { this.handleDataChange(e, "search") }} />
                                        </FloatingLabel>
                                    </Col>
                                    <Col xs={12} md={3}>
                                        <FloatingLabel controlId="floatingInputLowPricePerSearch" label="????????????" className="mb-1 ">
                                            <Form.Control type="number" placeholder="????????????" name='lowPricePer' value={searchData.lowPricePer || ''} onChange={(e) => { this.handleDataChange(e, "search") }} />
                                        </FloatingLabel>
                                    </Col>
                                    <Col xs={12} md={3}>
                                        <FloatingLabel controlId="floatingInputHighPricePerSearch" label="????????????" className="mb-1 ">
                                            <Form.Control type="number" placeholder="????????????" name='highPricePer' value={searchData.highPricePer || ''} onChange={(e) => { this.handleDataChange(e, "search") }} />
                                        </FloatingLabel>
                                    </Col>
                                </Row>

                                <Row className={clsx("justify-content-md-center", styles.insertRow)}>
                                    <Col xs={12} md={12}>
                                        <FloatingLabel controlId="floatingInputMemoSearch" label="??????" className="mb-1 ">
                                            <Form.Control type="text" placeholder="??????" name='memo' value={searchData.memo} onChange={(e) => { this.handleDataChange(e, "search") }} />
                                        </FloatingLabel>
                                    </Col>
                                </Row>

                                <Row className={clsx("justify-content-md-center", styles.insertRow)}>
                                    <Col xs={12} md={{ span: 6, offset: 3 }} className="btnGroup">
                                        <Button variant="contained" onClick={this.searchData} isLoading={isLoadingSearch}>??????</Button>
                                        <Button variant="contained" themeColor="success" name="searchData" onClick={this.dataClear}>????????????</Button>
                                    </Col>
                                </Row>
                            </Container>
                        </div>
                    </div>

                    {/* grid */}
                    <div className={styles.items}>
                        <div className={styles.matDataList}>
                            <DataGrid
                                rows={gridData}
                                columns={columns}
                                pageSize={10}
                                rowsPerPageOptions={[10]}
                                disableSelectionOnClick
                                getRowId={(row: { seq: number }) => row.seq}
                            />
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
                        submitForm={(e, data) => { this.submitForm(e, data) }} /> : null
                }
            </div >
        )
    }
}

type StateType = {
    wrapperOpen?: { isInsertWrapper: boolean, isSearchWrapper: boolean };
    insertData?: I_insertData;
    searchData?: I_searchData;
    selectOption?: I_selectOption;
    gridData?: {}[];
    modal?: I_modal;
    isLoadingInsert?: boolean;
    isLoadingSearch?: boolean;
};

// type propType = {
// };

interface I_insertData {
    id: string,
    type: string,
    name: string,
    size: string,
    quality: string,
    store_name: string,
    price: number,
    num: number,
    price_per: number,
    memo: string,
}

interface I_searchData {
    id: string,
    type: string,
    name: string,
    size: string,
    quality: string,
    storeName: string,
    lowPrice: string,
    highPrice: string,
    lowPricePer: string,
    highPricePer: string,
    memo: string,
}

interface I_selectOption {
    ma_type: { value: string, label: string, }[],
    ma_quality: { value: string, label: string, }[],
}

interface I_modal {
    isShow: boolean,
    title: string,
    data: { type: string, quality: string },
}
