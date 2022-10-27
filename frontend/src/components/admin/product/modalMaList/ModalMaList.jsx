import './modalMaList.scss'
import { Component } from 'react'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import { DataGrid } from '@mui/x-data-grid';

import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import Button from '../../../button/Button'
import { postData } from "../../../../api";
import { Eject, AddBox, CancelPresentation } from '@material-ui/icons';

export class ModalMaList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            wrapperOpen: {
                isSearchWrapper: true,
            },
            searchData: {
                id: '', type: '', name: '', size: '', quality: '', storeName: '', lowPrice: '', highPrice: '', lowPricePer: '', highPricePer: '',
            },
            SelectOption: {
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
        //func
        this._getMatGridData(this.state.searchData);
        this._getSelectOption();
    }

    async _getMatGridData(qryData) {
        // console.log("getMatGridData!!!");
        let _res = await postData("/api/getMatData", qryData);
        let _gridData = _res.data;
        delete _gridData.guid;
        for (let i = 0; i < _gridData.length; i++) {
            _gridData[i].seq = (i + 1);
        }
        // console.log(_gridData);
        this.setState({ gridData: [..._gridData] });
    }

    //get select Option 
    async _getSelectOption() {
        //copy state.SelectOption
        let _SelectOption = this.state.SelectOption;
        //qry from state.SelectOption
        let qryTmp = Object.keys(_SelectOption);
        //get Select Option res 
        let _res = await postData("/api/getSelectOption", qryTmp);
        //update Select Option data
        qryTmp.forEach(ele => {
            _res.data[ele].forEach(ele_res => {
                if (ele_res.value !== '**') { _SelectOption[ele].push(ele_res) }
            })
        })
    }

    //材料搜尋材料
    async searchData(event) {
        event.preventDefault();
        this.setState({ isLoadingSearch: true });
        if (this.state.searchData.lowPricePer > this.state.searchData.highPrice) {
            Swal.fire(
                'No No!',
                '最低單價不可高於最高單價',
                'error'
            )
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

    // handleDataChange(event) {
    //     event.preventDefault();
    //     let _name = event.target.name;
    //     let _modalData = this.state.modalData;
    //     _modalData.data[_name] = event.target.value;
    //     this.setState({ modalData: _modalData })
    // }

    addToSelectedList(event, data) {
        event.preventDefault();
        this.setState((prev) => ({
            selectedList: [...prev.selectedList, { ...data }]
        }))
    }
    deleteSelectedList(event, data, index) {
        event.preventDefault();
        this.setState({
            selectedList: this.state.selectedList.filter((_, i) => i !== index)
        });
    }



    render() {

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
                            <Button
                                variant="text"
                                startIcon={<AddBox />}
                                themeColor='success'
                                onClick={(e) => this.addToSelectedList(e, params.row)}
                            />
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
                                    <Eject className={this.state.wrapperOpen.isSearchWrapper ? 'itemIconRotate active' : 'itemIconRotate noActive'} /></a>
                                <div className={this.state.wrapperOpen.isSearchWrapper ? 'searchItemWrapper active' : 'searchItemWrapper '}>
                                    <Container>

                                        <Row className="justify-content-md-center insertRow">
                                            <Col xs={12} md={3}>
                                                <FloatingLabel controlId="floatingInputIdSearch" label="ID" className="mb-1 ">
                                                    <Form.Control type="text" placeholder="ID" name='id' value={this.state.searchData.id} onChange={(e) => { this.handleDataChange(e, "search") }} />
                                                </FloatingLabel>
                                            </Col>
                                            <Col xs={12} md={3}>
                                                <FloatingLabel controlId="floatingSelectTypeSearch" label="類別">
                                                    <Form.Select aria-label="Floating label select" name='type' value={this.state.searchData.type} onChange={(e) => { this.handleDataChange(e, "search") }} >
                                                        {this.state.SelectOption.ma_type.map(({ value, label }, index) => <option key={index} value={value} >{label}</option>)}
                                                    </Form.Select>
                                                </FloatingLabel>
                                            </Col>
                                            <Col xs={12} md={3}>
                                                <FloatingLabel controlId="floatingInputNameSearch" label="品名" className="mb-1 ">
                                                    <Form.Control type="text" placeholder="品名" name='name' value={this.state.searchData.name} onChange={(e) => { this.handleDataChange(e, "search") }} />
                                                </FloatingLabel>
                                            </Col>
                                            <Col xs={12} md={3}>
                                                <FloatingLabel controlId="floatingInputSizeSearch" label="尺寸" className="mb-1 ">
                                                    <Form.Control type="text" placeholder="尺寸" name='size' value={this.state.searchData.size} onChange={(e) => { this.handleDataChange(e, "search") }} />
                                                </FloatingLabel>
                                            </Col>
                                        </Row>

                                        <Row className="justify-content-md-center insertRow">
                                            <Col xs={12} md={3}>
                                                <FloatingLabel controlId="floatingSelectQualitySearch" label="質地">
                                                    <Form.Select aria-label="Floating label select" name='quality' value={this.state.searchData.quality} onChange={(e) => { this.handleDataChange(e, "search") }} >
                                                        {this.state.SelectOption.ma_quality.map(({ value, label }, index) => <option key={index} value={value} >{label}</option>)}
                                                    </Form.Select>
                                                </FloatingLabel>
                                            </Col>
                                            <Col xs={12} md={3}>
                                                <FloatingLabel controlId="floatingInputStoreNameSearch" label="店家" className="mb-1 ">
                                                    <Form.Control type="text" placeholder="店家" name='storeName' value={this.state.searchData.storeName} onChange={(e) => { this.handleDataChange(e, "search") }} />
                                                </FloatingLabel>
                                            </Col>
                                            <Col xs={12} md={3}>
                                                <FloatingLabel controlId="floatingInputLowPricePerSearch" label="最低單價" className="mb-1 ">
                                                    <Form.Control type="number" placeholder="最低單價" name='lowPricePer' value={this.state.searchData.lowPricePer || ''} onChange={(e) => { this.handleDataChange(e, "search") }} />
                                                </FloatingLabel>
                                            </Col>
                                            <Col xs={12} md={3}>
                                                <FloatingLabel controlId="floatingInputHighPricePerSearch" label="最高單價" className="mb-1 ">
                                                    <Form.Control type="number" placeholder="最高單價" name='highPricePer' value={this.state.searchData.highPricePer || ''} onChange={(e) => { this.handleDataChange(e, "search") }} />
                                                </FloatingLabel>
                                            </Col>
                                        </Row>

                                        <Row className="justify-content-md-center">
                                            <Col xs={12} md={6} className="btnGroup">
                                                <Button
                                                    variant="contained"
                                                    onClick={this.searchData}
                                                    isLoading={this.state.isLoadingSearch}
                                                >
                                                    搜尋
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    themeColor="success"
                                                    name="searchData"
                                                    onClick={this.dataClear}
                                                >
                                                    清除搜尋
                                                </Button>
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
                                                rows={this.state.gridData}
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
                            {
                                this.state.selectedList.map((ele, index) => (
                                    <div className="selectedListItems" key={index}>
                                        <div className="selectedListItemIcon">
                                            <CancelPresentation onClick={(e) => this.deleteSelectedList(e, ele, index)} />
                                        </div>
                                        <div className="selectedListItem">
                                            <div className="selectedListItemId">
                                                {ele.id}
                                            </div>
                                            <div className="selectedListItemName">
                                                {ele.name}
                                            </div>
                                        </div>

                                    </div>
                                ))

                            }

                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            variant="contained"
                            themeColor="secondary"
                            onClick={this.props.onHide}
                        >
                            取消
                        </Button>
                        <Button
                            variant="contained"
                            themeColor="primary"
                            onClick={(e) => { this.props.submitForm(e, this.state.selectedList) }}
                        >
                            確定
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        );
    }
}
