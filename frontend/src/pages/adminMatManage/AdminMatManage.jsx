import './adminMatManage.css'
import { Component } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import Button from 'react-bootstrap/Button'
import { Eject } from '@material-ui/icons';
import { DataGrid } from '@mui/x-data-grid';

import Swal from 'sweetalert2';
import { postData } from "../../api";

export class AdminMatManage extends Component {
    constructor(props) {
        super(props);
        //declare
        this.state = {
            WrapperOpen:{
                insertWrapper:false,
                searchWrapper:false,
            },
            insertData: {
                id: '', type: '', name: '', size: '', quality: '', storeName: '', price: 0, num: 0, pricePer: 0, memo: '',
            },
            searchData: {
                id: '', type: '', name: '', size: '', quality: '', storeName: '', price: 0, num: 0, pricePer: 0, memo: '',
            },
            SelectOption: {
                ma_type: [{ value: '', label: '==請選擇==' },],
                ma_quality: [{ value: '', label: '==請選擇==' },],
            },
            gridData:[],
        };
        //bind
        this.insertData = this.insertData.bind(this);
        this.searchData = this.searchData.bind(this);
        
        this.dataClear = this.dataClear.bind(this);
        this.WrapperOpen = this.WrapperOpen.bind(this);
        this.handleDataChange = this.handleDataChange.bind(this);
        
        //func
        this._getSelectOption();
    }

    componentDidMount() {
        this._getMatData({});
    }

    //get select Option 
    async _getSelectOption() {
        //copy state.SelectOption
        let _SelectOption = this.state.SelectOption;
        //qry from state.SelectOption
        let qryTmp = Object.keys(_SelectOption);
        //get Select Option res 
        let _res = await postData("/api/getSelectOption",qryTmp);
        //update Select Option data
        qryTmp.forEach(ele => {
            _res.data[ele].forEach(ele_res => {
                if (ele_res.value !== '**') { _SelectOption[ele].push(ele_res) }
            })
        })
    }

    //get mat data for grid
    async _getMatData(qryData) {
        let _res = await postData("/api/getMatData",qryData);
        let _gridData = _res.data;
        delete _gridData.guid;
        _gridData.forEach(ele => {
            ele.matId = ele.id;
            ele.id = '';
        })
        for (let i = 0; i < _gridData.length; i++) {
            _gridData[i].id = (i + 1);
        }
        this.setState({ gridData: [..._gridData] });
    }

    //材料新增材料
    async insertData(event) {
        event.preventDefault();
        // console.log(this.state.insertData);
        if(this.state.insertData.id===''||this.state.insertData.id===null){
            Swal.fire({
                position: 'bottom-end',
                width: 400,
                icon: 'error',
                title: 'ID 必填!',
                showConfirmButton: false,
                timer: 1500
            })
        }else{
            let res_ = await postData("/api/insertMatData",this.state.insertData);
            if (res_.status === 'InsertMatData_OK') {
                Swal.fire({
                    position: 'bottom-end',
                    width: 400,
                    icon: 'success',
                    title: '新增材料成功!',
                    showConfirmButton: false,
                    timer: 1500
                })
            } else if (res_.msg === 'ID_Repeated') {
                Swal.fire({
                    position: 'bottom-end',
                    width: 400,
                    icon: 'error',
                    title: 'ID 重複!',
                    showConfirmButton: false,
                    timer: 1500
                })
            } else {
                Swal.fire({
                    position: 'bottom-end',
                    width: 400,
                    icon: 'error',
                    title: res_.msg,
                    showConfirmButton: false,
                    timer: 1500
                })
            }
        }
        

    }

    //材料搜尋材料
    async searchData(event) {
        event.preventDefault();
    }

    // insert & search data onchange
    handleDataChange(event, action) {
        action = action + 'Data';
        let _action = this.state[action];
        let _name = event.target.name;
        _action[_name] = event.target.value;
        this.setState({ [action]: _action });

        if (action === "insertData") {
            //計算單價
            if ((_name === 'price' && this.state.insertData.num !== 0) || _name === 'num') {
                let tmpPrice = this.state.insertData.price / this.state.insertData.num;
                _action.pricePer = Math.round(tmpPrice * 10) / 10;
                this.setState({ insertData: _action });
            }
        }
    }

    //clear
    dataClear(event) {
        event.preventDefault();
        let _dataName = this.state[event.target.name];
        for (var ele in _dataName) {
            if (typeof _dataName[ele] === 'string') { _dataName[ele] = '' } else if (typeof _dataName[ele] === 'number') { _dataName[ele] = 0 };
        }
        this.setState({ [_dataName]: _dataName });
    }

    // wrapper switch
    WrapperOpen(event) {
        event.preventDefault();
        let wrapperName = event.target.name;
        let _WrapperOpen = this.state.WrapperOpen;
        _WrapperOpen[wrapperName] = !_WrapperOpen[wrapperName];
        this.setState({ WrapperOpen: _WrapperOpen });
    }
   

    render() {

        const columns = [
            { field: 'id', headerName: 'Seq' , flex: 1 },
            { field: 'matId', headerName: 'ID', flex: 1},
            { field: 'type', headerName: '類別', flex: 1},
            { field: 'name', headerName: '品名', flex: 1},
            { field: 'size', headerName: '尺寸',  flex: 1},
            { field: 'quality', headerName: '質地',flex: 1 },
            { field: 'price_per', headerName: '單價(元)', flex: 1},
            { field: 'actions', headerName: 'Actions', flex: 1,
                renderCell: (params) => {
                    return (
                        <>
                            <button className="userListEdit">Edit</button>
                            {/* <DeleteOutline className="userListDelete" onClick={() => handleDelete(params.row.id)} /> */}
                        </>
                    )
                }
            },
        ];

        return (
            <div className="AdminMatManage">
                <div className="AdminMatManageWrapper">
                    <div className="AdminMatManageTop">
                        <span className="PageTitle">材料管理</span>
                    </div>
                    <div className="AdminMatManageBody">
                        {/* insert */}
                        <div className="AdminMatManageItem">
                            <div className="AdminMatManageItemTitle">
                                <a href="/#" className="AdminMatManageItemTitle" name="insertWrapper" onClick={this.WrapperOpen}>材料新增<Eject className={this.state.WrapperOpen.insertWrapper ? 'AdminMatManageItemTitleIcon active' : 'AdminMatManageItemTitleIcon noActive'} /></a>
                            </div>
                            <div className={this.state.WrapperOpen.insertWrapper ? 'AdminMatManageItemWrapper active' : 'AdminMatManageItemWrapper'}>
                                <Container>
                                    <Row className="justify-content-md-center insertRow">
                                        <Col xs={12} md={4}>
                                            <FloatingLabel controlId="floatingInputId" label="ID" className="mb-1 ">
                                                <Form.Control type="text" placeholder="ID" name='id' value={this.state.insertData.id} onChange={(e)=>{this.handleDataChange(e,"insert")}} />
                                            </FloatingLabel>
                                        </Col>
                                        <Col xs={12} md={4}>
                                            <FloatingLabel controlId="floatingSelectType" label="類別">
                                                <Form.Select aria-label="Floating label select" name='type' value={this.state.insertData.type}  onChange={(e)=>{this.handleDataChange(e,"insert")}} >
                                                    {this.state.SelectOption.ma_type.map(({ value, label }, index) => <option key={index} value={value} >{label}</option>)}
                                                </Form.Select>
                                            </FloatingLabel>
                                        </Col>
                                        <Col xs={12} md={4}>
                                            <FloatingLabel controlId="floatingInputName" label="品名" className="mb-1 ">
                                                <Form.Control type="text" placeholder="品名" name='name' value={this.state.insertData.name}  onChange={(e)=>{this.handleDataChange(e,"insert")}} />
                                            </FloatingLabel>
                                        </Col>
                                    </Row>

                                    <Row className="justify-content-md-center insertRow">
                                        <Col xs={12} md={4}>
                                            <FloatingLabel controlId="floatingInputSize" label="尺寸" className="mb-1 ">
                                                <Form.Control type="text" placeholder="尺寸" name='size' value={this.state.insertData.size}  onChange={(e)=>{this.handleDataChange(e,"insert")}} />
                                            </FloatingLabel>
                                        </Col>
                                        <Col xs={12} md={4}>
                                            <FloatingLabel controlId="floatingSelectQuality" label="質地">
                                                <Form.Select aria-label="Floating label select" name='quality' value={this.state.insertData.quality}  onChange={(e)=>{this.handleDataChange(e,"insert")}} >
                                                    {this.state.SelectOption.ma_quality.map(({ value, label }, index) => <option key={index} value={value} >{label}</option>)}
                                                </Form.Select>
                                            </FloatingLabel>
                                        </Col>
                                        <Col xs={12} md={4}>
                                            <FloatingLabel controlId="floatingInputStoreName" label="店家" className="mb-1 ">
                                                <Form.Control type="text" placeholder="店家" name='storeName' value={this.state.insertData.storeName}  onChange={(e)=>{this.handleDataChange(e,"insert")}}/>
                                            </FloatingLabel>
                                        </Col>
                                    </Row>

                                    <Row className="justify-content-md-center insertRow">
                                        <Col xs={12} md={4}>
                                            <FloatingLabel controlId="floatingInputPrice" label="價錢" className="mb-1 ">
                                                <Form.Control type="number" placeholder="價錢" name='price' value={this.state.insertData.price}  onChange={(e)=>{this.handleDataChange(e,"insert")}}/>
                                            </FloatingLabel>
                                        </Col>
                                        <Col xs={12} md={4}>
                                            <FloatingLabel controlId="floatingInputNum" label="數量" className="mb-1 ">
                                                <Form.Control type="number" placeholder="數量" name='num' value={this.state.insertData.num}  onChange={(e)=>{this.handleDataChange(e,"insert")}} />
                                            </FloatingLabel>
                                        </Col>
                                        <Col xs={12} md={4}>
                                            <FloatingLabel controlId="floatingInputPricePer" label="單價" className="mb-1 ">
                                                <Form.Control type="number" placeholder="單價" name='pricePer' value={this.state.insertData.pricePer} onChange={(e)=>{this.handleDataChange(e,"insert")}}disabled readOnly />
                                            </FloatingLabel>
                                        </Col>
                                    </Row>

                                    <Row className="justify-content-md-center insertRow">
                                        <Col xs={12} md={12}>
                                            <FloatingLabel controlId="floatingInputMemo" label="備註" className="mb-1 ">
                                                <Form.Control type="text" placeholder="備註" name='memo' value={this.state.insertData.memo}  onChange={(e)=>{this.handleDataChange(e,"insert")}} />
                                            </FloatingLabel>
                                        </Col>
                                    </Row>

                                    <Row className="justify-content-md-center insertRow">
                                        <Col xs={3} md={3}>
                                            <Button className="btn" variant="outline-primary" onClick={this.insertData}>新增</Button>
                                            <Button className="btn" variant="outline-secondary" name="insertData" onClick={this.dataClear}>清除新增</Button>
                                        </Col>
                                    </Row>
                                </Container>
                            </div>
                        </div>

                        {/* edit */}
                        <div className="AdminMatManageItem">
                            <div className="AdminMatManageItemTitle">
                                <a href="/#" className="AdminMatManageItemTitle" name="searchWrapper" onClick={this.WrapperOpen}>材料搜尋<Eject className={this.state.WrapperOpen.searchWrapper ? 'AdminMatManageItemTitleIcon active' : 'AdminMatManageItemTitleIcon noActive'} /></a>
                            </div>
                            <div className={this.state.WrapperOpen.searchWrapper ? 'AdminMatManageItemWrapper active' : 'AdminMatManageItemWrapper'}>
                                <Container>
                                    <Row className="justify-content-md-center insertRow">
                                        <Col xs={12} md={4}>
                                            <FloatingLabel controlId="floatingInputIdSearch" label="ID" className="mb-1 ">
                                                <Form.Control type="text" placeholder="ID" name='id' value={this.state.searchData.id}  onChange={(e)=>{this.handleDataChange(e,"search")}}/>
                                            </FloatingLabel>
                                        </Col>
                                        <Col xs={12} md={4}>
                                            <FloatingLabel controlId="floatingSelectTypeSearch" label="類別">
                                                <Form.Select aria-label="Floating label select" name='type' value={this.state.searchData.type}  onChange={(e)=>{this.handleDataChange(e,"search")}} >
                                                    {this.state.SelectOption.ma_type.map(({ value, label }, index) => <option key={index} value={value} >{label}</option>)}
                                                </Form.Select>
                                            </FloatingLabel>
                                        </Col>
                                        <Col xs={12} md={4}>
                                            <FloatingLabel controlId="floatingInputNameSearch" label="品名" className="mb-1 ">
                                                <Form.Control type="text" placeholder="品名" name='name' value={this.state.searchData.name} onChange={(e)=>{this.handleDataChange(e,"search")}}/>
                                            </FloatingLabel>
                                        </Col>
                                    </Row>

                                    <Row className="justify-content-md-center insertRow">
                                        <Col xs={12} md={4}>
                                            <FloatingLabel controlId="floatingInputSizeSearch" label="尺寸" className="mb-1 ">
                                                <Form.Control type="text" placeholder="尺寸" name='size' value={this.state.searchData.size} onChange={(e)=>{this.handleDataChange(e,"search")}} />
                                            </FloatingLabel>
                                        </Col>
                                        <Col xs={12} md={4}>
                                            <FloatingLabel controlId="floatingSelectQualitySearch" label="質地">
                                                <Form.Select aria-label="Floating label select" name='quality' value={this.state.searchData.quality}  onChange={(e)=>{this.handleDataChange(e,"search")}} >
                                                    {this.state.SelectOption.ma_quality.map(({ value, label }, index) => <option key={index} value={value} >{label}</option>)}
                                                </Form.Select>
                                            </FloatingLabel>
                                        </Col>
                                        <Col xs={12} md={4}>
                                            <FloatingLabel controlId="floatingInputStoreNameSearch" label="店家" className="mb-1 ">
                                                <Form.Control type="text" placeholder="店家" name='storeName' value={this.state.searchData.storeName}  onChange={(e)=>{this.handleDataChange(e,"search")}} />
                                            </FloatingLabel>
                                        </Col>
                                    </Row>

                                    <Row className="justify-content-md-center insertRow">
                                        <Col xs={12} md={4}>
                                            <FloatingLabel controlId="floatingInputPriceSearch" label="價錢" className="mb-1 ">
                                                <Form.Control type="number" placeholder="價錢" name='price' value={this.state.searchData.price} onChange={(e)=>{this.handleDataChange(e,"search")}} />
                                            </FloatingLabel>
                                        </Col>
                                        <Col xs={12} md={4}>
                                            <FloatingLabel controlId="floatingInputNumSearch" label="數量" className="mb-1 ">
                                                <Form.Control type="number" placeholder="數量" name='num' value={this.state.searchData.num} onChange={(e)=>{this.handleDataChange(e,"search")}} />
                                            </FloatingLabel>
                                        </Col>
                                        <Col xs={12} md={4}>
                                            <FloatingLabel controlId="floatingInputPricePerSearch" label="單價" className="mb-1 ">
                                                <Form.Control type="number" placeholder="單價" name='pricePer' value={this.state.searchData.pricePer}  onChange={(e)=>{this.handleDataChange(e,"search")}}disabled readOnly />
                                            </FloatingLabel>
                                        </Col>
                                    </Row>

                                    <Row className="justify-content-md-center insertRow">
                                        <Col xs={12} md={12}>
                                            <FloatingLabel controlId="floatingInputMemoSearch" label="備註" className="mb-1 ">
                                                <Form.Control type="text" placeholder="備註" name='memo' value={this.state.searchData.memo}  onChange={(e)=>{this.handleDataChange(e,"search")}} />
                                            </FloatingLabel>
                                        </Col>
                                    </Row>

                                    <Row className="justify-content-md-center insertRow">
                                        <Col xs={3} md={3}>
                                            <Button className="btn" variant="outline-primary" onClick={this.searchData}>搜尋</Button>
                                            <Button className="btn" variant="outline-secondary" name="searchData" onClick={this.dataClear}>清除搜尋</Button>
                                        </Col>
                                    </Row>


                                    {/* <Row className="justify-content-md-center insertRow">
                                        <Col xs={12} md={4}>
                                        </Col>
                                        <Col xs={12} md={4}>
                                        </Col>
                                        <Col xs={12} md={4}>
                                        </Col>
                                    </Row> */}
                                </Container>
                            </div>
                        </div>

                        <div className="AdminMatManageItem">
                            <div className="matDataList">
                                <DataGrid
                                    rows={this.state.gridData}
                                    columns={columns}
                                    pageSize={5}
                                    rowsPerPageOptions={[5]}
                                    disableSelectionOnClick
                                />
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        )
    }
}


