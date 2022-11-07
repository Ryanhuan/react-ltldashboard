import './adminMatManage.scss'
import { Component } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import { Eject, DeleteOutline, Edit } from '@material-ui/icons';
import { DataGrid } from '@mui/x-data-grid';
import { CustomModal } from '../../../components/modal/customModal';
import { postData } from "../../../api";
import Button from '../../../components/button/Button';
import { customAlert } from '../../../components/customAlert/customAlert';

export class AdminMatManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            wrapperOpen: {
                isInsertWrapper: false,
                isSearchWrapper: false,
            },
            insertData: {
                id: '', type: '', name: '', size: '', quality: '', store_name: '', price: '', num: '', price_per: '', memo: '',
            },
            searchData: {
                id: '', type: '', name: '', size: '', quality: '', storeName: '', lowPrice: '', highPrice: '', lowPricePer: '', highPricePer: '', memo: '',
            },
            selectOption: {
                ma_type: [{ value: '', label: '==請選擇==' },],
                ma_quality: [{ value: '', label: '==請選擇==' },],
            },
            gridData: [],
            modal: {
                isShow: false, title: '', data: {},
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
        let _res = await postData("/api/getSelectOption", qryTmp);
        //update Select Option data
        qryTmp.forEach(ele => {
            _res.data[ele].forEach(ele_res => {
                if (ele_res.value !== '**') { _selectOption[ele].push(ele_res) }
            })
        })
    }

    //get mat data for grid
    async _getMatData(qryData) {
        let _res = await postData("/api/getMatData", qryData);
        let _gridData = _res.data;
        delete _gridData.guid;
        for (let i = 0; i < _gridData.length; i++) {
            _gridData[i].seq = (i + 1);
        }
        this.setState({ gridData: [..._gridData] });
    }

    //材料新增材料
    async insertData(event) {
        event.preventDefault();
        this.setState({ isLoadingInsert: !this.state.isLoadingInsert });
        // console.log(this.state.insertData);
        if (this.state.insertData.id === '' || this.state.insertData.id === null) {
            customAlert.fire({
                position: 'bottom-end',
                width: 400,
                icon: 'error',
                title: 'ID 必填!',
                showConfirmButton: false,
                timer: 1500
            })
        } else {
            let _insertData = this.state.insertData
            for (let ele in _insertData) {
                if (ele === 'price' || ele === 'num' || ele === 'price_per') {
                    _insertData[ele] = _insertData[ele] === '' ? 0 : parseInt(_insertData[ele]);
                }
            }
            // _insertData
            let _res = await postData("/api/insertMatData", this.state.insertData);
            if (_res.status === 'InsertMatData_OK') {
                customAlert.fire({
                    position: 'bottom-end',
                    width: 400,
                    icon: 'success',
                    title: '新增材料成功!',
                    showConfirmButton: false,
                    timer: 1500
                })
                this._getMatData({});
            } else if (_res.msg === 'ID_Repeated') {
                customAlert.fire({
                    position: 'bottom-end',
                    width: 400,
                    icon: 'error',
                    title: 'ID 重複!',
                    showConfirmButton: false,
                    timer: 1500
                })
            } else {
                customAlert.fire({
                    position: 'bottom-end',
                    width: 400,
                    icon: 'error',
                    title: JSON.stringify(_res.msg),
                    showConfirmButton: false,
                    timer: 1500
                })
            }
        }
        this.setState({ isLoadingInsert: !this.state.isLoadingInsert });
    }

    //材料搜尋材料
    async searchData(event) {
        event.preventDefault();
        this.setState({ isLoadingSearch: !this.state.isLoadingSearch });
        if (this.state.searchData.lowPricePer > this.state.searchData.highPrice) {
            customAlert.fire(
                'No No!',
                '最低單價不可高於最高單價',
                'error'
            )
        } else {
            this._getMatData(this.state.searchData);
        }
        this.setState({ isLoadingSearch: !this.state.isLoadingSearch });
    }

    // insert & search data onchange
    handleDataChange(event, action) {
        action = action + 'Data';
        let _action = this.state[action];
        let _name = event.target.name;
        // input type change (if type == number && value !=='' then string => number)
        _action[_name] = (event.target.type === 'number' && event.target.value !== '') ? parseInt(event.target.value) : _action[_name] = event.target.value;
        this.setState({ [action]: _action });

        if (action === "insertData") {
            //計算單價
            if ((_name === 'price' && this.state.insertData.num !== '') || _name === 'num') {
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
    wrapperOpen(event) {
        event.preventDefault();
        this.setState((prev) => ({
            wrapperOpen: { ...prev.wrapperOpen, [event.target.name]: !prev.wrapperOpen[event.target.name] }
        }));
    }

    selectOptionChange(value, selectOptions) {
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

    //edit submit
    async submitForm(event, data) {
        event.preventDefault();
        customAlert.fire({
            title: '確定要修改?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '確定',
            cancelButtonText: '取消'
        }).then(async (result) => {
            if (result.isConfirmed) {
                let _res = await postData("/api/editMatData", data);
                if (_res.status === 'editMatData_OK') {
                    customAlert.fire('完成修改!', '修改成功.', 'success')
                    this._getMatData({});
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
                let _res = await postData("/api/deleteMatData", data);
                if (_res.status === 'deleteMatData_OK') {
                    customAlert.fire('完成刪除!', '刪除成功.', 'success')
                    this._getMatData({});
                } else {
                    customAlert.fire('Fail!', _res.msg, 'error')
                }
            }
        })
    }

    // #endregion
    render() {
        const { selectOption, modal, wrapperOpen, insertData, searchData, isLoadingInsert, isLoadingSearch, gridData } = this.state;

        const modalCols = [
            { field: 'id', headerName: 'ID', type: 'text', className: 'mb-2 col-4 ' },
            { field: 'type', headerName: '類別', type: 'dropDown', className: 'mb-2 col-4', selectOption: selectOption.ma_type },
            { field: 'name', headerName: '品名', type: 'text', className: 'mb-2 col-4 ' },
            { field: 'size', headerName: '尺寸', type: 'text', className: 'mb-2 col-4 ' },
            { field: 'quality', headerName: '質地', type: 'dropDown', className: 'mb-2 col-4 ', selectOption: selectOption.ma_quality },
            { field: 'store_name', headerName: '店家', type: 'text', className: 'mb-2 col-4 ' },
            { field: 'price', headerName: '價錢', type: 'number', className: 'mb-2 col-4 ' },
            { field: 'num', headerName: '數量', type: 'number', className: 'mb-2 col-4 ' },
            { field: 'price_per', headerName: '單價(元)', type: 'number', className: 'mb-2 col-4 ', disabled: true },
            { field: 'memo', headerName: '備註', type: 'text', className: 'mb-2 col-12 ' },
        ]

        const columns = [
            { field: 'seq', headerName: '序', flex: 1 },
            { field: 'id', headerName: 'ID', flex: 1 },
            { field: 'type', headerName: '類別', flex: 1 },
            { field: 'name', headerName: '品名', flex: 1 },
            { field: 'size', headerName: '尺寸', flex: 1 },
            { field: 'quality', headerName: '質地', flex: 1 },
            { field: 'price_per', headerName: '單價(元)', flex: 1 },
            {
                field: 'actions', headerName: 'Actions', flex: 2,
                renderCell: (params) => {
                    return (
                        <>
                            <Button variant="text" startIcon={<Edit />} themeColor='success' onClick={(e) => this.modalOpen(e, params.row)} />
                            <Button variant="text" startIcon={<DeleteOutline />} themeColor='error' onClick={(e) => this.handleGridDelete(e, params.row)} />
                            {modal.isShow ?
                                <CustomModal isShow={modal.isShow} onHide={this.modalOnHide} modalData={modal}
                                    modalCols={modalCols} submitForm={(e, data) => { this.submitForm(e, data) }} /> : null
                            }
                        </>
                    )
                }
            },
        ];

        return (
            <div className="adminMatManage">
                <div className="adminWrapper">
                    {/* insert */}
                    <div className="adminItems">
                        <a href="/#" className="itemTitle" name="isInsertWrapper" onClick={this.wrapperOpen}>
                            材料新增
                            <Eject className={wrapperOpen.isInsertWrapper ? 'itemIconRotate active' : 'itemIconRotate noActive'} /></a>
                        <div className={wrapperOpen.isInsertWrapper ? 'adminItemWrapper active neumorphismFlat' : 'adminItemWrapper'}>
                            <Container>
                                <Row className="justify-content-md-center insertRow">
                                    <Col xs={12} md={4}>
                                        <FloatingLabel controlId="floatingInputId" label="ID" className="mb-1 ">
                                            <Form.Control type="text" placeholder="ID" name='id' value={insertData.id} onChange={(e) => { this.handleDataChange(e, "insert") }} />
                                        </FloatingLabel>
                                    </Col>
                                    <Col xs={12} md={4}>
                                        <FloatingLabel controlId="floatingSelectType" label="類別">
                                            <Form.Select aria-label="Floating label select" name='type' value={insertData.type} onChange={(e) => { this.handleDataChange(e, "insert") }} >
                                                {selectOption.ma_type.map(({ value, label }, index) => <option key={index} value={value} >{label}</option>)}
                                            </Form.Select>
                                        </FloatingLabel>
                                    </Col>
                                    <Col xs={12} md={4}>
                                        <FloatingLabel controlId="floatingInputName" label="品名" className="mb-1 ">
                                            <Form.Control type="text" placeholder="品名" name='name' value={insertData.name} onChange={(e) => { this.handleDataChange(e, "insert") }} />
                                        </FloatingLabel>
                                    </Col>
                                </Row>

                                <Row className="justify-content-md-center insertRow">
                                    <Col xs={12} md={4}>
                                        <FloatingLabel controlId="floatingInputSize" label="尺寸" className="mb-1 ">
                                            <Form.Control type="text" placeholder="尺寸" name='size' value={insertData.size} onChange={(e) => { this.handleDataChange(e, "insert") }} />
                                        </FloatingLabel>
                                    </Col>
                                    <Col xs={12} md={4}>
                                        <FloatingLabel controlId="floatingSelectQuality" label="質地">
                                            <Form.Select aria-label="Floating label select" name='quality' value={insertData.quality} onChange={(e) => { this.handleDataChange(e, "insert") }} >
                                                {selectOption.ma_quality.map(({ value, label }, index) => <option key={index} value={value} >{label}</option>)}
                                            </Form.Select>
                                        </FloatingLabel>
                                    </Col>
                                    <Col xs={12} md={4}>
                                        <FloatingLabel controlId="floatingInputStoreName" label="店家" className="mb-1 ">
                                            <Form.Control type="text" placeholder="店家" name='store_name' value={insertData.store_name} onChange={(e) => { this.handleDataChange(e, "insert") }} />
                                        </FloatingLabel>
                                    </Col>
                                </Row>

                                <Row className="justify-content-md-center insertRow">
                                    <Col xs={12} md={4}>
                                        <FloatingLabel controlId="floatingInputPrice" label="價錢" className="mb-1 ">
                                            <Form.Control type="number" placeholder="價錢" name='price' value={insertData.price || ''} onChange={(e) => { this.handleDataChange(e, "insert") }} />
                                        </FloatingLabel>
                                    </Col>
                                    <Col xs={12} md={4}>
                                        <FloatingLabel controlId="floatingInputNum" label="數量" className="mb-1 ">
                                            <Form.Control type="number" placeholder="數量" name='num' value={insertData.num || ''} onChange={(e) => { this.handleDataChange(e, "insert") }} />
                                        </FloatingLabel>
                                    </Col>
                                    <Col xs={12} md={4}>
                                        <FloatingLabel controlId="floatingInputPricePer" label="單價" className="mb-1 ">
                                            <Form.Control type="number" placeholder="單價" name='price_per' value={insertData.price_per || ''} onChange={(e) => { this.handleDataChange(e, "insert") }} disabled readOnly />
                                        </FloatingLabel>
                                    </Col>
                                </Row>

                                <Row className="justify-content-md-center insertRow">
                                    <Col xs={12} md={12}>
                                        <FloatingLabel controlId="floatingInputMemo" label="備註" className="mb-1 ">
                                            <Form.Control type="text" placeholder="備註" name='memo' value={insertData.memo} onChange={(e) => { this.handleDataChange(e, "insert") }} />
                                        </FloatingLabel>
                                    </Col>
                                </Row>

                                <Row className="justify-content-md-center insertRow">
                                    <Col xs={12} md={{ span: 6, offset: 3 }} className="btnGroup">
                                        <Button variant="contained" onClick={this.insertData} isLoading={isLoadingInsert}>新增</Button>
                                        <Button variant="contained" themeColor="success" name="insertData" onClick={this.dataClear}>清除新增</Button>
                                    </Col>
                                </Row>
                            </Container>
                        </div>
                    </div>

                    {/* search */}
                    <div className="adminItems">
                        <a href="/#" className="itemTitle" name="isSearchWrapper" onClick={this.wrapperOpen}>
                            材料搜尋
                            <Eject className={wrapperOpen.isSearchWrapper ? 'itemIconRotate active' : 'itemIconRotate noActive'} /></a>
                        <div className={wrapperOpen.isSearchWrapper ? 'adminItemWrapper search active neumorphismFlat' : 'adminItemWrapper search'}>
                            <Container>
                                <Row className="justify-content-md-center insertRow">
                                    <Col xs={12} md={3}>
                                        <FloatingLabel controlId="floatingInputIdSearch" label="ID" className="mb-1 ">
                                            <Form.Control type="text" placeholder="ID" name='id' value={searchData.id} onChange={(e) => { this.handleDataChange(e, "search") }} />
                                        </FloatingLabel>
                                    </Col>
                                    <Col xs={12} md={3}>
                                        <FloatingLabel controlId="floatingSelectTypeSearch" label="類別">
                                            <Form.Select aria-label="Floating label select" name='type' value={searchData.type} onChange={(e) => { this.handleDataChange(e, "search") }} >
                                                {selectOption.ma_type.map(({ value, label }, index) => <option key={index} value={value} >{label}</option>)}
                                            </Form.Select>
                                        </FloatingLabel>
                                    </Col>
                                    <Col xs={12} md={3}>
                                        <FloatingLabel controlId="floatingInputNameSearch" label="品名" className="mb-1 ">
                                            <Form.Control type="text" placeholder="品名" name='name' value={searchData.name} onChange={(e) => { this.handleDataChange(e, "search") }} />
                                        </FloatingLabel>
                                    </Col>
                                    <Col xs={12} md={3}>
                                        <FloatingLabel controlId="floatingInputSizeSearch" label="尺寸" className="mb-1 ">
                                            <Form.Control type="text" placeholder="尺寸" name='size' value={searchData.size} onChange={(e) => { this.handleDataChange(e, "search") }} />
                                        </FloatingLabel>
                                    </Col>
                                </Row>

                                <Row className="justify-content-md-center insertRow">
                                    <Col xs={12} md={3}>
                                        <FloatingLabel controlId="floatingSelectQualitySearch" label="質地">
                                            <Form.Select aria-label="Floating label select" name='quality' value={searchData.quality} onChange={(e) => { this.handleDataChange(e, "search") }} >
                                                {selectOption.ma_quality.map(({ value, label }, index) => <option key={index} value={value} >{label}</option>)}
                                            </Form.Select>
                                        </FloatingLabel>
                                    </Col>
                                    <Col xs={12} md={3}>
                                        <FloatingLabel controlId="floatingInputStoreNameSearch" label="店家" className="mb-1 ">
                                            <Form.Control type="text" placeholder="店家" name='storeName' value={searchData.storeName} onChange={(e) => { this.handleDataChange(e, "search") }} />
                                        </FloatingLabel>
                                    </Col>
                                    <Col xs={12} md={3}>
                                        <FloatingLabel controlId="floatingInputLowPricePerSearch" label="最低單價" className="mb-1 ">
                                            <Form.Control type="number" placeholder="最低單價" name='lowPricePer' value={searchData.lowPricePer || ''} onChange={(e) => { this.handleDataChange(e, "search") }} />
                                        </FloatingLabel>
                                    </Col>
                                    <Col xs={12} md={3}>
                                        <FloatingLabel controlId="floatingInputHighPricePerSearch" label="最高單價" className="mb-1 ">
                                            <Form.Control type="number" placeholder="最高單價" name='highPricePer' value={searchData.highPricePer || ''} onChange={(e) => { this.handleDataChange(e, "search") }} />
                                        </FloatingLabel>
                                    </Col>
                                </Row>

                                <Row className="justify-content-md-center insertRow">
                                    <Col xs={12} md={12}>
                                        <FloatingLabel controlId="floatingInputMemoSearch" label="備註" className="mb-1 ">
                                            <Form.Control type="text" placeholder="備註" name='memo' value={searchData.memo} onChange={(e) => { this.handleDataChange(e, "search") }} />
                                        </FloatingLabel>
                                    </Col>
                                </Row>

                                <Row className="justify-content-md-center insertRow">
                                    <Col xs={12} md={{ span: 6, offset: 3 }} className="btnGroup">
                                        <Button variant="contained" onClick={this.searchData} isLoading={isLoadingSearch}>搜尋</Button>
                                        <Button variant="contained" themeColor="success" name="searchData" onClick={this.dataClear}>清除搜尋</Button>
                                    </Col>
                                </Row>

                            </Container>
                        </div>

                    </div>

                    {/* grid */}
                    <div className="adminItems">
                        <div className="matDataList">
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
        )
    }
}