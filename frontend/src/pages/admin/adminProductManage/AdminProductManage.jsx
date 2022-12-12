
import './adminProductManage.scss'
import { Component } from 'react'
import { Product } from '../../../components/admin/product/Product'
import { DataGrid } from '@mui/x-data-grid';
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import { DeleteOutline, Edit, Eject } from '@material-ui/icons';
// import { CustomModal } from '../../../components/modal/customModal';
import { postData } from "../../../api";
import { getSelectOption } from '../../../utility.ts'
import Button from '../../../components/button/Button'
import { customAlert, customToastTopEnd } from '../../../components/customAlert/customAlert';

import Loading from '../../../components/loading/Loading'


export class AdminProductManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            wrapperOpen: {
                isSearchWrapper: true,
            },
            searchData: {
                sku: '', name: '', kind: '', size: '', inventory: '', status: '', catena_belong: '', single_belong: ''
            },
            selectOption: {
                product_kind: [],
                product_status: [],
                product_catena: [],
                product_single: [],
            },
            gridData: [],
            isLoading: false,
            isLoadingSearch: false,
        };

        this.wrapperOpen = this.wrapperOpen.bind(this);
        this.handleDataChange = this.handleDataChange.bind(this);
        this.searchData = this.searchData.bind(this);


    }

    componentDidMount() {
        this._getSelectOption();
        this._getGridData(this.state.searchData);

    }

    // insert data onchange
    handleDataChange(event, action) {
        let _action = this.state[action];
        let _name = event.target.name;
        // input type change (if type == number && value !=='' then string => number)
        _action[_name] = (event.target.type === 'number' && event.target.value !== '') ? parseInt(event.target.value) : event.target.value;
        this.setState({ [action]: _action });
    }

    //get select Option 
    async _getSelectOption() {
        let qryTmp = Object.keys(this.state.selectOption);
        let _SelectOption = [];
        //get Select Option res 
        let _res = await postData("/api/codeManage/getSelectOption", qryTmp);
        //update Select Option data
        if (_res.ack === 'OK') {
            qryTmp.forEach(ele => {
                _SelectOption[ele] = [{ value: '', label: '==請選擇==' },];
                _res.data[ele].forEach(async ele_res => {
                    if (ele_res.value !== '**') {
                        await _SelectOption[ele].push(ele_res)
                    }
                })
            })
            this.setState({ selectOption: _SelectOption })
        } else {
            customToastTopEnd.fire('NO NO!', _res.ackDesc, 'error');
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

    //get grid data
    async _getGridData(data) {
        let _res = await postData("/api/product/getProductData", data);
        for (let i = 0; i < _res.data.length; i++) {
            _res.data[i].seq = (i + 1);
        }
        this.setState({ gridData: _res.data });
        // if (_res.ack === 'OK') {
        //     let _gridData = [];
        //     //排除'**'
        //     for (let ele in _res.data[data]) {
        //         if (_res.data[data][ele].value !== '**') { _gridData.push(_res.data[data][ele]) }
        //     }
        //     //create seq
        //     for (let i = 0; i < _gridData.length; i++) {
        //         _gridData[i].seq = (i + 1);
        //     }
        //     this.setState({ gridData: _gridData });
        // } else {
        //     customToastTopEnd.fire('NO NO!', 'Search fail', 'error');
        //     this.setState({ gridData: [] });
        // }
    }

    //材料搜尋材料
    async searchData(event) {
        event.preventDefault();
        this.setState({ isLoadingSearch: true });
        this._getGridData(this.state.searchData);
        this.setState({ isLoadingSearch: false });
    }


    render() {
        const { searchData, modal, wrapperOpen, selectOption, isLoadingSearch, gridData, isLoading } = this.state;

        const columns = [
            { field: 'seq', headerName: '序', flex: 1 },
            { field: 'sku', headerName: 'SKU', flex: 2 },
            { field: 'name', headerName: '品名', flex: 2 },
            { field: 'kind', headerName: '種類', flex: 2 },
            { field: 'size', headerName: '尺寸', flex: 2 },
            { field: 'inventory', headerName: '庫存', flex: 2 },
            { field: 'status', headerName: '狀態', flex: 2 },
            { field: 'catena_belong', headerName: '系列所屬', flex: 1 },
            { field: 'single_belong', headerName: '商品所屬', flex: 1 },
            {
                field: 'actions', headerName: 'Actions', flex: 2,
                renderCell: (params) => {
                    return (
                        <>
                            <Button variant="text" startIcon={<Edit />} themeColor='success'
                            />
                            <Button variant="text" startIcon={<DeleteOutline />} themeColor='error'
                            />
                            {/* <Button variant="text" startIcon={<Edit />} themeColor='success'
                                onClick={(e) => this.modalOpen(e, params.row)} />
                            <Button variant="text" startIcon={<DeleteOutline />} themeColor='error'
                                onClick={(e) => this.handleDelete(e, params.row)} /> */}
                            {/* {modal.isShow ?
                                <CustomModal isShow={modal.isShow} onHide={this.modalOnHide} modalData={modal}
                                    modalCols={modalCols} submitForm={(e, data) => { this.submitForm(e, data) }}
                                /> : null
                            } */}
                        </>
                    )
                }
            },
        ];

        return (
            <div className="adminProductManage">
                {isLoading ? <Loading /> : null}

                <div className="adminWrapper">
                    {/* search */}
                    <div className="adminItems">
                        <a href="/#" className="itemTitle" name="isSearchWrapper" onClick={this.wrapperOpen}>
                            商品搜尋
                            <Eject className={wrapperOpen.isSearchWrapper ? 'itemIconRotate active' : 'itemIconRotate noActive'} /></a>
                        <div className={wrapperOpen.isSearchWrapper ? 'adminItemWrapper search active neumorphismFlat' : 'adminItemWrapper search'}>
                            <Container>
                                <Row className="justify-content-md-center insertRow">
                                    <Col xs={12} md={3}>
                                        <FloatingLabel controlId="floatingInputSKUSearch" label="SKU" className="mb-1 ">
                                            <Form.Control type="text" placeholder="SKU" name='sku' value={searchData.sku} onChange={(e) => { this.handleDataChange(e, "searchData") }} />
                                        </FloatingLabel>
                                    </Col>
                                    <Col xs={12} md={3}>
                                        <FloatingLabel controlId="floatingInputNameSearch" label="品名" className="mb-1 ">
                                            <Form.Control type="text" placeholder="品名" name='name' value={searchData.name} onChange={(e) => { this.handleDataChange(e, "searchData") }} />
                                        </FloatingLabel>
                                    </Col>
                                    <Col xs={12} md={3}>
                                        <FloatingLabel controlId="floatingSelectKindSearch" label="種類" className="mb-1 ">
                                            <Form.Select aria-label="Floating label select" name='kind' value={searchData.kind} onChange={(e) => { this.handleDataChange(e, "searchData") }} >
                                                {selectOption.product_kind.map(({ value, label }, index) => <option key={index} value={value} >{label}</option>)}
                                            </Form.Select>
                                        </FloatingLabel>

                                    </Col>
                                    <Col xs={12} md={3}>
                                        <FloatingLabel controlId="floatingInputSizeSearch" label="尺寸" className="mb-1 ">
                                            <Form.Control type="text" placeholder="尺寸" name='size' value={searchData.size} onChange={(e) => { this.handleDataChange(e, "searchData") }} />
                                        </FloatingLabel>
                                    </Col>
                                </Row>

                                <Row className="justify-content-md-center insertRow">
                                    <Col xs={12} md={3}>
                                        <FloatingLabel controlId="floatingInputInventorySearch" label="庫存" className="mb-3 ">
                                            <Form.Control type="text" placeholder="庫存" name='inventory' value={searchData.inventory} onChange={(e) => { this.handleDataChange(e, "searchData") }} />
                                        </FloatingLabel>
                                    </Col>
                                    <Col xs={12} md={3}>
                                        <FloatingLabel controlId="floatingSelectStatusSearch" label="狀態" className="mb-3 ">
                                            <Form.Select aria-label="Floating label select" name='status' value={searchData.status} onChange={(e) => { this.handleDataChange(e, "searchData") }} >
                                                {selectOption.product_status.map(({ value, label }, index) => <option key={index} value={value} >{label}</option>)}
                                            </Form.Select>
                                        </FloatingLabel>
                                    </Col>
                                    <Col xs={12} md={3}>
                                        <FloatingLabel controlId="floatingSelectCatenaBelongSearch" label="系列所屬" className="mb-3 ">
                                            <Form.Select aria-label="Floating label select" name='catena_belong' value={searchData.catena_belong} onChange={(e) => { this.handleDataChange(e, "searchData") }} >
                                                {selectOption.product_catena.map(({ value, label }, index) => <option key={index} value={value} >{label}</option>)}
                                            </Form.Select>
                                        </FloatingLabel>
                                    </Col>
                                    <Col xs={12} md={3}>
                                        <FloatingLabel controlId="floatingSelectSingleBelongSearch" label="商品所屬" className="mb-3 ">
                                            <Form.Select aria-label="Floating label select" name='single_belong' value={searchData.single_belong} onChange={(e) => { this.handleDataChange(e, "searchData") }} >
                                                {selectOption.product_single.map(({ value, label }, index) => <option key={index} value={value} >{label}</option>)}
                                            </Form.Select>
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
