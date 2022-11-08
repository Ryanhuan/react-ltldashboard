import './modalMaList.scss'
import { Component } from 'react'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from '../../../button/Button'
import { DataGrid } from '@mui/x-data-grid';
import { Eject, AddBox, CancelPresentation, AddCircleOutline, RemoveCircleOutline } from '@material-ui/icons';
import { postData } from "../../../../api";
import { customAlert, customToastTopEnd } from '../../../customAlert/customAlert';

export class ModalMaList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...this.props,
            wrapperOpen: {
                isSearchWrapper: true,
            },
            searchData: {
                id: '', type: '', name: '', size: '', quality: '', storeName: '', lowPrice: '', highPrice: '', lowPricePer: '', highPricePer: '',
            },
            selectOption: {
                ma_type: [{ value: '', label: '==請選擇==' },],
                ma_quality: [{ value: '', label: '==請選擇==' },],
            },
            gridData: [],
            selectedList: [],
            // gridSettings
            isLoadingSearch: false,
        };
        this.searchData = this.searchData.bind(this);
        this.dataClear = this.dataClear.bind(this);
        this.wrapperOpen = this.wrapperOpen.bind(this);
        this.handleDataChange = this.handleDataChange.bind(this);
        this._getMatGridData = this._getMatGridData.bind(this);
        this.addToSelectedList = this.addToSelectedList.bind(this);
        this.increaseCntItem = this.increaseCntItem.bind(this);
        this.decreaseCntItem = this.decreaseCntItem.bind(this);

        //func
        this._getMatGridData(this.state.searchData);
        this._getSelectOption();
    }

    componentDidUpdate(prevProps, prevState) {
        // console.log("prevProps",prevProps);
        // console.log("prevState",prevState);
        if (prevState.data !== this.props.data) {
            // maList has been updated ,then update selectedList data
            this.state.selectedList = this.props.data;
        }
    }



    async _getMatGridData(qryData) {
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

    //get select Option 
    async _getSelectOption() {
        let _selectOption = this.state.selectOption;
        let qryTmp = Object.keys(_selectOption);
        let _res = await postData("/api/codeManage/getSelectOption", qryTmp);
        if (_res.ack === 'OK') {
            qryTmp.forEach(ele => {
                _res.data[ele].forEach(ele_res => {
                    if (ele_res.value !== '**') { _selectOption[ele].push(ele_res) }
                })
            })
        } else {
            customToastTopEnd.fire('NO NO!', _res.ackDesc, 'error');
        }
    }

    //材料搜尋
    async searchData(event) {
        event.preventDefault();
        this.setState({ isLoadingSearch: true });
        if (this.state.searchData.lowPricePer > this.state.searchData.highPrice) {
            customToastTopEnd.fire('No No!', '最低單價不可高於最高單價', 'error')
        } else {
            this._getMatGridData(this.state.searchData);
        }
        this.setState({ isLoadingSearch: false });
    }

    //clear
    dataClear(event) {
        event.preventDefault();
        let _searchData = this.state.searchData;
        for (let ele in _searchData) {
            _searchData[ele] = '';
        }
        this.setState({ searchData: _searchData });
    }

    // wrapper switch
    wrapperOpen(event) {
        event.preventDefault();
        let wrapperName = event.target.name;
        let _wrapperOpen = this.state.wrapperOpen;
        _wrapperOpen[wrapperName] = !_wrapperOpen[wrapperName];
        this.setState({ wrapperOpen: _wrapperOpen });
    }

    // search data onchange
    handleDataChange(event, action) {
        action = action + 'Data';
        let _action = this.state[action];
        let _name = event.target.name;
        // input type change (if type == number && value !=='' then string => number)
        _action[_name] = (event.target.type === 'number' && event.target.value !== '') ? parseInt(event.target.value) : _action[_name] = event.target.value;
        this.setState({ [action]: _action });
    }

    // 新增品項
    addToSelectedList(event, data) {
        event.preventDefault();
        let _selectedList = this.state.selectedList;
        if (_selectedList.length == 0) {
            _selectedList.push({ ...data, cntNum: 1 })
        } else {
            let _res = _selectedList.filter(function (item, index, array) {
                if (item.id == data.id) {
                    item.cntNum = item.cntNum + 1;
                    return true;
                } else {
                    return false;
                }
            });
            if (_res == false) {
                _selectedList.push({ ...data, cntNum: 1 })
            }
        }
        this.setState({ selectedList: [..._selectedList] })
    }

    // 刪除品項
    deleteSelectedList(event, data, index) {
        event.preventDefault();
        this.setState({
            selectedList: this.state.selectedList.filter((_, i) => i !== index)
        });
    }

    // 增加數量
    increaseCntItem(event, index) {
        event.preventDefault();
        let _selectedList = this.state.selectedList;
        _selectedList[index].cntNum = _selectedList[index].cntNum >= 50 ? _selectedList[index].cntNum : _selectedList[index].cntNum + 1;
        this.setState({ selectedList: [..._selectedList] })
    }

    // 減少數量
    decreaseCntItem(event, index) {
        event.preventDefault();
        let _selectedList = this.state.selectedList;
        _selectedList[index].cntNum = _selectedList[index].cntNum <= 1 ? _selectedList[index].cntNum : _selectedList[index].cntNum + 1;
        this.setState({ selectedList: [..._selectedList] })
    }

    render() {

        const { wrapperOpen, searchData, selectOption, isLoadingSearch, gridData, selectedList } = this.state;

        const columns = [
            { field: 'id', headerName: 'ID' },
            { field: 'name', headerName: 'Name' },
            { field: 'type', headerName: 'Type' },
            { field: 'size', headerName: 'Size' },
            { field: 'quality', headerName: '材質' },
            { field: 'price_per', headerName: '單價(元)' },
            { field: 'store_name', headerName: '店名' },
            {
                field: 'actions', headerName: 'Actions',
                renderCell: (params) => {
                    return (
                        <>
                            <Button variant="text" startIcon={<AddBox />} themeColor='success'
                                onClick={(e) => this.addToSelectedList(e, params.row)} />
                        </>
                    )
                }
            },
        ];


        return (
            <Modal show={this.props.isShow} onHide={this.props.onHide} aria-labelledby="contained-modal-title-vcenter" centered>
                <Form>
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter" className="modalTitle">
                            Select
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="show-grid modalBody">
                        {/* {body} */}

                        {/* search */}
                        <div className="modalItem">
                            <div className="searchItem">
                                <a href="/#" className="itemTitle" name="isSearchWrapper" onClick={this.wrapperOpen}>
                                    材料搜尋
                                    <Eject className={wrapperOpen.isSearchWrapper ? 'itemIconRotate active' : 'itemIconRotate noActive'} /></a>
                                <div className={wrapperOpen.isSearchWrapper ? 'searchItemWrapper active' : 'searchItemWrapper '}>
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

                                        <Row className="justify-content-md-center">
                                            <Col xs={12} md={6} className="btnGroup">
                                                <Button variant="contained" onClick={this.searchData} isLoading={isLoadingSearch}>搜尋 </Button>
                                                <Button variant="contained" themeColor="success" name="searchData" onClick={this.dataClear}>清除搜尋</Button>
                                            </Col>
                                        </Row>

                                    </Container>
                                </div>
                            </div>
                            <Container>
                                <Row>
                                    <Col>
                                        <div className="grid">
                                            <DataGrid
                                                rows={gridData}
                                                columns={columns}
                                                pageSize={10}
                                                rowsPerPageOptions={[10]}
                                                getRowId={(row) => row.seq}
                                            />
                                        </div>
                                    </Col>
                                </Row>
                            </Container>
                        </div>

                        <div className="modalItem selectedListBox">
                            <Container>
                                <Row>
                                    <div className="selectedListBoxHeader" >
                                        <Col xs={2} md={2}> {/* space */} </Col>
                                        <Col xs={5} md={5} >
                                            <div className="selectedListBoxHeaderItem">
                                                <div className="selectedListBoxHeaderId"> ID </div>
                                                <div className="selectedListBoxHeaderName"> NAME </div>
                                            </div>
                                        </Col>
                                        <Col xs={5} md={5} >
                                            <div className="selectedListBoxHeaderNum"> 數量 </div>
                                        </Col>
                                    </div>
                                </Row>
                                <Row>
                                    {
                                        selectedList.map((ele, index) => (
                                            <div className="selectedListItemWrapper" key={index}>
                                                <div className="selectedListItems" >
                                                    <Col xs={2} md={2} className="selectedListItem selectedListItemIconLeft" >
                                                        <Button variant="text" startIcon={<CancelPresentation />} themeColor='error'
                                                            onClick={(e) => this.deleteSelectedList(e, ele, index)} />
                                                    </Col>
                                                    <Col xs={5} md={5} className="selectedListItem">
                                                        <div className="selectedListItemId"> {ele.id} </div>
                                                        <div className="selectedListItemName"> {ele.name} </div>
                                                    </Col>
                                                    <Col xs={6} md={6} className="selectedListItem selectedListItemIconRight">
                                                        <Button variant="text" startIcon={<RemoveCircleOutline />} themeColor='main'
                                                            onClick={(e) => { this.decreaseCntItem(e, index) }} />
                                                        <span className="cntNumStyle"> {ele.cntNum} </span>
                                                        <Button variant="text" startIcon={<AddCircleOutline />} themeColor='main'
                                                            onClick={(e) => { this.increaseCntItem(e, index) }} />
                                                    </Col>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </Row>
                            </Container>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="contained" themeColor="secondary" onClick={this.props.onHide} >取消</Button>
                        <Button variant="contained" themeColor="primary"
                            onClick={(e) => { this.props.submitForm(e, selectedList) }}>確定</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        );
    }
}
