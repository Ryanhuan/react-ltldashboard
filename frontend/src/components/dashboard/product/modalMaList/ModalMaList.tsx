import { ChangeEvent, Component } from 'react'
import styles from './modalMaList.module.scss'
import { clsx } from 'clsx'

import Button from '@/components/button/Button';
import { postData } from "@/api";
import { customAlert, customToastTopEnd } from '@/components/customAlert/customAlert';

import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import { DataGrid } from '@mui/x-data-grid';
import EjectIcon from '@mui/icons-material/Eject';
import AddBoxIcon from '@mui/icons-material/AddBox';
import CancelPresentationIcon from '@mui/icons-material/CancelPresentation';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';


export class ModalMaList extends Component<any, StateType> {
    constructor(props) {
        super(props);
        this.state = {
            wrapperOpen: {
                isSearchWrapper: true,
            },
            searchData: {
                id: '', type: '', name: '', size: '', quality: '', storeName: '', lowPricePer: 0, highPricePer: 0,
            },
            selectOption: {
                ma_type: [], ma_quality: [],
            },
            gridData: [],
            selectedList: [],
            // gridSettings
            isLoadingSearch: false,
            ...this.props,
        };

        this.searchData = this.searchData.bind(this);
        this.dataClear = this.dataClear.bind(this);
        this.wrapperOpen = this.wrapperOpen.bind(this);
        this.handleDataChange = this.handleDataChange.bind(this);
        this._getMatGridData = this._getMatGridData.bind(this);
        this.addToSelectedList = this.addToSelectedList.bind(this);
        this.increaseCntItem = this.increaseCntItem.bind(this);
        this.decreaseCntItem = this.decreaseCntItem.bind(this);

    }

    componentDidUpdate(prevProps, prevState) {
        // console.log("prevProps",prevProps);
        // console.log("prevState",prevState);
        if (prevState.selectedList !== this.props.data) {
            // maList has been updated ,then update selectedList data
            this.setState({ selectedList: this.props.data });
        }
    }

    componentDidMount(): void {
        //func
        this._getMatGridData(this.state.searchData);
        this._getSelectOption();
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
                _selectOption[ele].push({ value: '', label: '==請選擇==' });
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
        if (this.state.searchData.lowPricePer > this.state.searchData.highPricePer) {
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
    wrapperOpen(actionName: string, event) {
        event.preventDefault();
        this.setState((prev) => ({
            wrapperOpen: { ...prev.wrapperOpen, [actionName]: !prev.wrapperOpen[actionName] }
        }));
    }
    // search data onchange
    handleDataChange(event: ChangeEvent<HTMLSelectElement> | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, action: string) {
        let _action = this.state[action];
        let _name = event.target.name;
        // input type change (if type == number && value !=='' then string => number)
        _action[_name] = (event.target.type === 'number' && event.target.value !== '') ? Number(event.target.value) : _action[_name] = event.target.value;
        this.setState({ [action]: _action });
    }

    // 新增品項
    addToSelectedList(event, data) {
        event.preventDefault();
        let _selectedList = this.state.selectedList;
        if (_selectedList.length == 0) {
            _selectedList.push({ ...data, cnt_num: 1 })
        } else {
            let _res = _selectedList.find(function (ele) {
                return ele.id === data.id;
            })
            _res === undefined ? _selectedList.push({ ...data, cnt_num: 1 }) : _res.cnt_num = _res.cnt_num + 1;
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
        _selectedList[index].cnt_num = _selectedList[index].cnt_num >= 50 ? _selectedList[index].cnt_num : _selectedList[index].cnt_num + 1;
        this.setState({ selectedList: [..._selectedList] })
    }

    // 減少數量
    decreaseCntItem(event, index) {
        event.preventDefault();
        let _selectedList = this.state.selectedList;
        _selectedList[index].cnt_num = _selectedList[index].cnt_num <= 1 ? _selectedList[index].cnt_num : _selectedList[index].cnt_num + 1;
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
                            <Button variant="text" startIcon={<AddBoxIcon />} themeColor='success'
                                onClick={(e) => this.addToSelectedList(e, params.row)} />
                        </>
                    )
                }
            },
        ];


        return (
            <Modal className={styles.modalWrapper} show={this.props.isShow} onHide={this.props.onHide} aria-labelledby="contained-modal-title-vcenter" centered>
                <div className={styles.modalContent}>
                    <Form>
                        <Modal.Header closeButton>
                            <Modal.Title id="contained-modal-title-vcenter" className="modalTitle">
                                Select
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body className={clsx(styles.modalBody, 'show-grid')}>
                            {/* {body} */}

                            {/* search */}
                            <div className={styles.modalItem}>
                                <div className={styles.searchItem}>
                                    <a href="#" className="itemTitle" onClick={(e) => { this.wrapperOpen('isInsertWrapper', e) }}>
                                        材料搜尋
                                        <EjectIcon className={clsx('itemIconRotate', wrapperOpen.isSearchWrapper && 'active', !wrapperOpen.isSearchWrapper && 'noActive')} /></a>
                                    <div className={clsx(styles.searchItemWrapper, wrapperOpen.isSearchWrapper && styles.active)}>
                                        <Container>

                                            <Row className={clsx('justify-content-md-center', styles.insertRow)}>
                                                <Col xs={12} md={3}>
                                                    <FloatingLabel controlId="floatingInputIdSearch" label="ID" className="mb-1 ">
                                                        <Form.Control type="text" placeholder="ID" name='id' value={searchData.id} onChange={(e) => { this.handleDataChange(e, "searchData") }} />
                                                    </FloatingLabel>
                                                </Col>
                                                <Col xs={12} md={3}>
                                                    <FloatingLabel controlId="floatingSelectTypeSearch" label="類別">
                                                        <Form.Select aria-label="Floating label select" name='type' value={searchData.type} onChange={(e) => { this.handleDataChange(e, "searchData") }} >
                                                            {selectOption.ma_type.map(({ value, label }, index) => <option key={index} value={value} >{label}</option>)}
                                                        </Form.Select>
                                                    </FloatingLabel>
                                                </Col>
                                                <Col xs={12} md={3}>
                                                    <FloatingLabel controlId="floatingInputNameSearch" label="品名" className="mb-1 ">
                                                        <Form.Control type="text" placeholder="品名" name='name' value={searchData.name} onChange={(e) => { this.handleDataChange(e, "searchData") }} />
                                                    </FloatingLabel>
                                                </Col>
                                                <Col xs={12} md={3}>
                                                    <FloatingLabel controlId="floatingInputSizeSearch" label="尺寸" className="mb-1 ">
                                                        <Form.Control type="text" placeholder="尺寸" name='size' value={searchData.size} onChange={(e) => { this.handleDataChange(e, "searchData") }} />
                                                    </FloatingLabel>
                                                </Col>
                                            </Row>

                                            <Row className={clsx('justify-content-md-center', styles.insertRow)}>
                                                <Col xs={12} md={3}>
                                                    <FloatingLabel controlId="floatingSelectQualitySearch" label="質地">
                                                        <Form.Select aria-label="Floating label select" name='quality' value={searchData.quality} onChange={(e) => { this.handleDataChange(e, "searchData") }} >
                                                            {selectOption.ma_quality.map(({ value, label }, index) => <option key={index} value={value} >{label}</option>)}
                                                        </Form.Select>
                                                    </FloatingLabel>
                                                </Col>
                                                <Col xs={12} md={3}>
                                                    <FloatingLabel controlId="floatingInputStoreNameSearch" label="店家" className="mb-1 ">
                                                        <Form.Control type="text" placeholder="店家" name='storeName' value={searchData.storeName} onChange={(e) => { this.handleDataChange(e, "searchData") }} />
                                                    </FloatingLabel>
                                                </Col>
                                                <Col xs={12} md={3}>
                                                    <FloatingLabel controlId="floatingInputLowPricePerSearch" label="最低單價" className="mb-1 ">
                                                        <Form.Control type="number" placeholder="最低單價" name='lowPricePer' value={searchData.lowPricePer || ''} onChange={(e) => { this.handleDataChange(e, "searchData") }} />
                                                    </FloatingLabel>
                                                </Col>
                                                <Col xs={12} md={3}>
                                                    <FloatingLabel controlId="floatingInputHighPricePerSearch" label="最高單價" className="mb-1 ">
                                                        <Form.Control type="number" placeholder="最高單價" name='highPricePer' value={searchData.highPricePer || ''} onChange={(e) => { this.handleDataChange(e, "searchData") }} />
                                                    </FloatingLabel>
                                                </Col>
                                            </Row>

                                            <Row className="justify-content-md-center">
                                                <Col xs={12} md={6} className={styles.btnGroup}>
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
                                            <div className={styles.grid}>
                                                <DataGrid
                                                    rows={gridData}
                                                    columns={columns}
                                                    pageSize={10}
                                                    rowsPerPageOptions={[10]}
                                                    getRowId={(row: { seq: number }) => row.seq}
                                                />
                                            </div>
                                        </Col>
                                    </Row>
                                </Container>
                            </div>

                            <div className={styles.modalItem}>
                                <div className={styles.selectedListBox}>
                                    <Container>
                                        <Row>
                                            <div className={styles.selectedListBoxHeader}>
                                                <Col xs={2} md={2}> {/* space */} </Col>
                                                <Col xs={5} md={5} >
                                                    <div className={styles.selectedListBoxHeaderItem}>
                                                        <div className={styles.selectedListBoxHeaderId}> ID </div>
                                                        <div className={styles.selectedListBoxHeaderName}> NAME </div>
                                                    </div>
                                                </Col>
                                                <Col xs={5} md={5} >
                                                    <div className={styles.selectedListBoxHeaderNum}> 數量 </div>
                                                </Col>
                                            </div>
                                        </Row>
                                        <Row>
                                            {
                                                selectedList.map((ele, index) => (
                                                    <div className={styles.selectedListItemWrapper} key={index}>
                                                        <div className={styles.selectedListItems} >
                                                            <Col xs={2} md={2} className={clsx(styles.selectedListItem, styles.selectedListItemIconLeft)} >
                                                                <Button variant="text" startIcon={<CancelPresentationIcon />} themeColor='error'
                                                                    onClick={(e) => this.deleteSelectedList(e, ele, index)} />
                                                            </Col>
                                                            <Col xs={5} md={5} className={styles.selectedListItem}>
                                                                <div className={styles.selectedListItemId}> {ele.id} </div>
                                                                <div className={styles.selectedListItemName}> {ele.name} </div>
                                                            </Col>
                                                            <Col xs={6} md={6} className={clsx(styles.selectedListItem, styles.selectedListItemIconRight)}>
                                                                <Button variant="text" startIcon={<RemoveCircleOutlineIcon />} themeColor='main'
                                                                    onClick={(e) => { this.decreaseCntItem(e, index) }} />
                                                                <span className={styles.cntNumStyle}> {ele.cnt_num} </span>
                                                                <Button variant="text" startIcon={<AddCircleOutlineIcon />} themeColor='main'
                                                                    onClick={(e) => { this.increaseCntItem(e, index) }} />
                                                            </Col>
                                                        </div>
                                                    </div>
                                                ))
                                            }
                                        </Row>
                                    </Container>
                                </div>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="contained" themeColor="secondary" onClick={this.props.onHide} >取消</Button>
                            <Button variant="contained" themeColor="primary"
                                onClick={(e) => { this.props.submitForm(e, selectedList) }}>確定</Button>
                        </Modal.Footer>
                    </Form>
                </div>
            </Modal>
        );
    }
}

type StateType = {
    wrapperOpen?: { isSearchWrapper: boolean };
    searchData?: I_searchData;
    selectOption?: { ma_type: I_selectOptionItem[], ma_quality: I_selectOptionItem[] };
    gridData?: {}[];
    selectedList?: any[];
    isLoadingSearch?: boolean;
};

interface I_searchData {
    id: string,
    type: string,
    name: string,
    size: string,
    quality: string,
    storeName: string,
    lowPricePer: number,
    highPricePer: number,
}

interface I_selectOptionItem {
    value: string,
    label: string,
}
