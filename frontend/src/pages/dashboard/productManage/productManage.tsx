
import { Component } from 'react';
import styles from './productManage.module.scss';
import { clsx } from 'clsx';
import { postData } from "@/api";
import Button from '@/components/button/Button';
import { Product } from '@/components/dashboard/product/Product';
import { customAlert, customToastTopEnd } from '@/components/customAlert/customAlert';

import { DataGrid } from '@mui/x-data-grid';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Offcanvas from 'react-bootstrap/Offcanvas'
import EditIcon from '@mui/icons-material/Edit';
import EjectIcon from '@mui/icons-material/Eject';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export class productManage extends Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            wrapperOpen: {
                isSearchWrapper: true,
            },
            searchData: {
                sku: '', name: '', kind: '', size: '', inventory: 0, status: '', catena_belong: '', single_belong: ''
            },
            selectOption: {
                product_kind: [],
                product_status: [],
                product_catena: [],
                product_single: [],
            },
            gridData: [],
            isLoadingSearch: false,
            editProduct: {
                isEditProduct: false,
                editProductData: {},
                editProductFileList: [],
                editProductMaList: [],
            },
        };

        this.wrapperOpen = this.wrapperOpen.bind(this);
        this.handleDataChange = this.handleDataChange.bind(this);
        this.searchData = this.searchData.bind(this);
        this.dataClear = this.dataClear.bind(this);

        this.openEdit = this.openEdit.bind(this);
        this.closeEdit = this.closeEdit.bind(this);
    }

    componentDidMount() {
        this._getSelectOption();
        this._getGridData(this.state.searchData);
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
                _SelectOption[ele] = [{ value: '', label: '==?????????==' },];
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

    // insert data onchange
    handleDataChange(event, action) {
        let _action = this.state[action];
        let _name = event.target.name;
        // input type change (if type == number && value !=='' then string => number)
        _action[_name] = (event.target.type === 'number' && event.target.value !== '') ? Number(event.target.value) : event.target.value;
        this.setState({ [action]: _action });
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

    //get grid data
    async _getGridData(data) {
        this.props.setLoading(true);
        let _res = await postData("/api/product/getProductData", data);
        this.props.setLoading(false);
        if (_res.ack === 'OK') {
            for (let i = 0; i < _res.data.length; i++) {
                _res.data[i].seq = (i + 1);
            }
            this.setState({ gridData: _res.data });
        } else {
            customToastTopEnd.fire('NO NO!', 'Search fail !', 'error');
            this.setState({ gridData: [] });
        }
    }

    //??????????????????
    async searchData(event) {
        event.preventDefault();
        this.setState({ isLoadingSearch: true });
        this.props.setLoading(true);
        this._getGridData(this.state.searchData);
        this.setState({ isLoadingSearch: false });
        this.props.setLoading(false);
    }

    async openEdit(event, data) {
        this.props.setLoading(true);
        let _productBomData = await postData("/api/product/getProductBomData/" + data.sku);
        _productBomData.ack === 'FAIL' ? customToastTopEnd.fire('NO NO!', _productBomData.ackDesc, 'error') : '';

        let _productImgData = await postData('getProductImgData/' + data.sku);
        let _productFileList = [];
        for (let ele of _productImgData.data) {
            _productFileList.push({
                id: Math.floor(Math.random() * 1000).toString(),
                imageUrl: ele,
            })
        }

        this.setState((prev) => (
            {
                editProduct: {
                    ...prev.editProduct,
                    isEditProduct: true,
                    editProductData: data,
                    editProductFileList: _productFileList,
                    editProductMaList: _productBomData.data,
                }
            }));
        this.props.setLoading(false);

    }

    closeEdit(e) {
        this.setState((prev) => (
            {
                editProduct: {
                    ...prev.editProduct,
                    isEditProduct: false,
                    editProductData: {},
                    editProductFileList: [],
                    editProductMaList: [],
                }
            }));
    }

    // delete
    async handleDelete(event, data) {
        event.preventDefault();
        customAlert.fire({ title: '????????????????', icon: 'warning' })
            .then(async (result) => {
                if (result.isConfirmed) {
                    this.props.setLoading(true);
                    let _res = await postData("/api/product/deleteProductInfo/" + data.sku);
                    this.props.setLoading(false);
                    if (_res.ack === 'OK') {
                        customToastTopEnd.fire('????????????!', '????????????.', 'success')
                        this.searchData(event);
                    } else {
                        customToastTopEnd.fire('Fail!', _res.ackDesc, 'error')
                    }
                }
            })
    }

    setLoading(state) {
        this.props.setLoading(state);
    }

    // #endregion

    render() {
        const { searchData, wrapperOpen, selectOption, isLoadingSearch, gridData, editProduct } = this.state;

        const columns = [
            { field: 'seq', headerName: '???', flex: 1 },
            { field: 'sku', headerName: 'SKU', flex: 2 },
            { field: 'name', headerName: '??????', flex: 2 },
            { field: 'kind', headerName: '??????', flex: 2 },
            { field: 'size', headerName: '??????', flex: 2 },
            { field: 'inventory', headerName: '??????', flex: 2 },
            { field: 'status', headerName: '??????', flex: 2 },
            { field: 'catena_belong', headerName: '????????????', flex: 1 },
            { field: 'single_belong', headerName: '????????????', flex: 1 },
            {
                field: 'actions', headerName: 'Actions', flex: 2,
                renderCell: (params) => {
                    return (
                        <>
                            <Button variant="text" startIcon={<EditIcon />} themeColor='success'
                                onClick={(e) => this.openEdit(e, params.row)} />
                            <Button variant="text" startIcon={<DeleteOutlineIcon />} themeColor='error'
                                onClick={(e) => this.handleDelete(e, params.row)} />
                        </>
                    )
                }
            },
        ];

        return (
            <div className={styles.productManage}>
                {/* {!isEditProduct && */}
                <div className={styles.wrapper}>
                    {/* search */}
                    <div className={styles.items}>
                        <a href="#" className="itemTitle" onClick={(e) => { this.wrapperOpen('isSearchWrapper', e) }}>
                            ????????????
                            <EjectIcon className={clsx('itemIconRotate', wrapperOpen.isSearchWrapper && 'active', !wrapperOpen.isSearchWrapper && 'noActive')} /></a>
                        <div className={clsx(styles.itemWrapper, 'neumorphismFlat', wrapperOpen.isSearchWrapper && styles.active)}>
                            <Container>
                                <Row className="justify-content-md-center">
                                    <Col xs={12} md={3}>
                                        <FloatingLabel controlId="floatingInputSKUSearch" label="SKU" className="mb-1 ">
                                            <Form.Control type="text" placeholder="SKU" name='sku' value={searchData.sku} onChange={(e) => { this.handleDataChange(e, "searchData") }} />
                                        </FloatingLabel>
                                    </Col>
                                    <Col xs={12} md={3}>
                                        <FloatingLabel controlId="floatingInputNameSearch" label="??????" className="mb-1 ">
                                            <Form.Control type="text" placeholder="??????" name='name' value={searchData.name} onChange={(e) => { this.handleDataChange(e, "searchData") }} />
                                        </FloatingLabel>
                                    </Col>
                                    <Col xs={12} md={3}>
                                        <FloatingLabel controlId="floatingSelectKindSearch" label="??????" className="mb-1 ">
                                            <Form.Select aria-label="Floating label select" name='kind' value={searchData.kind} onChange={(e) => { this.handleDataChange(e, "searchData") }} >
                                                {selectOption.product_kind.map(({ value, label }, index) => <option key={index} value={value} >{label}</option>)}
                                            </Form.Select>
                                        </FloatingLabel>

                                    </Col>
                                    <Col xs={12} md={3}>
                                        <FloatingLabel controlId="floatingInputSizeSearch" label="??????" className="mb-1 ">
                                            <Form.Control type="text" placeholder="??????" name='size' value={searchData.size} onChange={(e) => { this.handleDataChange(e, "searchData") }} />
                                        </FloatingLabel>
                                    </Col>
                                </Row>

                                <Row className="justify-content-md-center">
                                    <Col xs={12} md={3}>
                                        <FloatingLabel controlId="floatingInputInventorySearch" label="??????" className="mb-3 ">
                                            <Form.Control type="number" placeholder="??????" name='inventory' value={searchData.inventory} onChange={(e) => { this.handleDataChange(e, "searchData") }} />
                                        </FloatingLabel>
                                    </Col>
                                    <Col xs={12} md={3}>
                                        <FloatingLabel controlId="floatingSelectStatusSearch" label="??????" className="mb-3 ">
                                            <Form.Select aria-label="Floating label select" name='status' value={searchData.status} onChange={(e) => { this.handleDataChange(e, "searchData") }} >
                                                {selectOption.product_status.map(({ value, label }, index) => <option key={index} value={value} >{label}</option>)}
                                            </Form.Select>
                                        </FloatingLabel>
                                    </Col>
                                    <Col xs={12} md={3}>
                                        <FloatingLabel controlId="floatingSelectCatenaBelongSearch" label="????????????" className="mb-3 ">
                                            <Form.Select aria-label="Floating label select" name='catena_belong' value={searchData.catena_belong} onChange={(e) => { this.handleDataChange(e, "searchData") }} >
                                                {selectOption.product_catena.map(({ value, label }, index) => <option key={index} value={value} >{label}</option>)}
                                            </Form.Select>
                                        </FloatingLabel>
                                    </Col>
                                    <Col xs={12} md={3}>
                                        <FloatingLabel controlId="floatingSelectSingleBelongSearch" label="????????????" className="mb-3 ">
                                            <Form.Select aria-label="Floating label select" name='single_belong' value={searchData.single_belong} onChange={(e) => { this.handleDataChange(e, "searchData") }} >
                                                {selectOption.product_single.map(({ value, label }, index) => <option key={index} value={value} >{label}</option>)}
                                            </Form.Select>
                                        </FloatingLabel>
                                    </Col>

                                </Row>

                                <Row className="justify-content-md-center">
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
                                getRowId={(row) => row.seq}
                            />
                        </div>
                    </div>
                </div>
                {/* } */}


                <Offcanvas className='productOffCanvas' show={editProduct.isEditProduct} onHide={this.closeEdit} placement={'end'}>
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title>Edit Product</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        <Product
                            type={'edit'}
                            refreshGrid={() => { this._getGridData(this.state.searchData) }}
                            isEditProduct={(state: boolean) => { editProduct.isEditProduct = state }}
                            setLoading={(state: boolean) => this.setLoading(state)}
                            insertData={Object.assign({}, editProduct.editProductData)}
                            fileList={editProduct.editProductFileList}
                            maList={editProduct.editProductMaList} />
                    </Offcanvas.Body>
                </Offcanvas>

            </div>
        )
    }
}
