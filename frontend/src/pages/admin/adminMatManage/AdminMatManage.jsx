import './adminMatManage.css'
import { Component } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import Button from 'react-bootstrap/Button'
import { Eject, DeleteOutline, Edit} from '@material-ui/icons';
import { DataGrid } from '@mui/x-data-grid';
import {CustomModal}from '../../../components/modal/customModal';
import Swal from 'sweetalert2';
import { postData } from "../../../api";

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
                id: '', type: '', name: '', size: '', quality: '', store_name: '', price: '', num: '', price_per: '', memo: '',
            },
            searchData: {
                id: '', type: '', name: '', size: '', quality: '', storeName: '', lowPrice: '', highPrice: '', lowPricePer: '', highPricePer: '', memo: '',
            },
            SelectOption: {
                ma_type: [{ value: '', label: '==請選擇==' },],
                ma_quality: [{ value: '', label: '==請選擇==' },],
            },
            gridData:[],
            modal:{
                show: false,
                title:'',
                data:{},
            }
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
        for (let i = 0; i < _gridData.length; i++) {
            _gridData[i].seq = (i + 1);
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
            let _insertData=this.state.insertData
            for(let ele in _insertData){
                if(ele==='price'||ele==='num'||ele==='price_per'){
                    _insertData[ele]= _insertData[ele]==='' ? 0:parseInt(_insertData[ele]);
                }
            }
            // _insertData
            let _res = await postData("/api/insertMatData",this.state.insertData);
            if (_res.status === 'InsertMatData_OK') {
                Swal.fire({
                    position: 'bottom-end',
                    width: 400,
                    icon: 'success',
                    title: '新增材料成功!',
                    showConfirmButton: false,
                    timer: 1500
                })
                this._getMatData({});
            } else if (_res.msg === 'ID_Repeated') {
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
                    title: JSON.stringify(_res.msg),
                    showConfirmButton: false,
                    timer: 1500
                })
            }
        }
    }

    //材料搜尋材料
    async searchData(event) {
        event.preventDefault();
        if(this.state.searchData.lowPricePer > this.state.searchData.highPrice ){
            Swal.fire(
                'No No!',
                '最低單價不可高於最高單價',
                'error'
            )
        }else{
            this._getMatData(this.state.searchData);
        }
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
    WrapperOpen(event) {
        event.preventDefault();
        let wrapperName = event.target.name;
        let _WrapperOpen = this.state.WrapperOpen;
        _WrapperOpen[wrapperName] = !_WrapperOpen[wrapperName];
        this.setState({ WrapperOpen: _WrapperOpen });
    }
   

    render() {

        const selectOptionChange=(value,selectOptions)=>{
            for(let ele in selectOptions){
              if(selectOptions[ele].label===value){ return selectOptions[ele].value }
            }
        }

        const modalOpen=(event,data)=>{
            event.preventDefault();
            let _data=JSON.parse(JSON.stringify(data));
            let _modal=this.state.modal;
            _data.type=selectOptionChange(_data.type,this.state.SelectOption.ma_type);
            _data.quality=selectOptionChange(_data.quality,this.state.SelectOption.ma_quality);
            _modal.data=_data;
            _modal.title="修改";
            _modal.show=!_modal.show;
            this.setState({modal:_modal});
        }

        const modalOnHide=()=>{
            let _modal=this.state.modal;
            _modal.show=!_modal.show;
            this.setState({modal:_modal});
        }

        //edit submit
        const submitForm=async (event,data)=>{
            event.preventDefault();
            Swal.fire({
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
                        Swal.fire(
                            '完成修改!',
                            '修改成功.',
                            'success'
                        )
                        this._getMatData({});
                    } else {
                        Swal.fire(
                            'Fail!',
                            _res.msg,
                            'error'
                        )
                    }
                }
            })
            modalOnHide();
        }

        //grid delete
        const handleDelete = async (event, data) => {
            event.preventDefault();
            Swal.fire({
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
                        Swal.fire(
                            '完成刪除!',
                            '刪除成功.',
                            'success'
                        )
                        this._getMatData({});
                    } else {
                        Swal.fire(
                            'Fail!',
                            _res.msg,
                            'error'
                        )
                    }
                }
            })
        }

        const modalCols = [
            { field: 'id', headerName: 'ID', type: 'text', className: 'mb-2 col-4 '},
            { field: 'type', headerName: '類別', type: 'dropDown', className: 'mb-2 col-4' ,selectOption:this.state.SelectOption.ma_type},
            { field: 'name', headerName: '品名', type: 'text', className: 'mb-2 col-4 ' },
            { field: 'size', headerName: '尺寸', type: 'text', className: 'mb-2 col-4 ' },
            { field: 'quality', headerName: '質地', type: 'dropDown', className: 'mb-2 col-4 ' ,selectOption:this.state.SelectOption.ma_quality },
            { field: 'store_name', headerName: '店家', type: 'text', className: 'mb-2 col-4 ' },
            { field: 'price', headerName: '價錢', type: 'number', className: 'mb-2 col-4 ' },
            { field: 'num', headerName: '數量', type: 'number', className: 'mb-2 col-4 ' },
            { field: 'price_per', headerName: '單價(元)', type: 'number', className: 'mb-2 col-4 ',disabled:true},
            { field: 'memo', headerName: '備註', type: 'text', className: 'mb-2 col-12 ' },
        ]

        const columns = [
            { field: 'seq', headerName: 'Seq', flex: 1},
            { field: 'id', headerName: 'ID', flex: 1},
            { field: 'type', headerName: '類別', flex: 1},
            { field: 'name', headerName: '品名', flex: 1},
            { field: 'size', headerName: '尺寸',  flex: 1},
            { field: 'quality', headerName: '質地',flex: 1 },
            { field: 'price_per', headerName: '單價(元)', flex: 1},
            { field: 'actions', headerName: 'Actions', flex: 1,
                renderCell: (params) => {
                    return (
                        <>
                            <Edit className="matGridEdit" onClick={(e) => modalOpen(e,params.row)}/>
                            <DeleteOutline className="matGridDelete" onClick={(e) => handleDelete(e,params.row)} />
                            {this.state.modal.show ?
                                <CustomModal show={this.state.modal.show} onHide={modalOnHide} modalData={this.state.modal}
                                modalCols={modalCols} submitForm={(e,data)=>{submitForm(e,data)}}
                                 /> : ''
                            }
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
                                                <Form.Control type="text" placeholder="店家" name='store_name' value={this.state.insertData.store_name}  onChange={(e)=>{this.handleDataChange(e,"insert")}}/>
                                            </FloatingLabel>
                                        </Col>
                                    </Row>

                                    <Row className="justify-content-md-center insertRow">
                                        <Col xs={12} md={4}>
                                            <FloatingLabel controlId="floatingInputPrice" label="價錢" className="mb-1 ">
                                                <Form.Control type="number" placeholder="價錢" name='price' value={this.state.insertData.price|| ''}  onChange={(e)=>{this.handleDataChange(e,"insert")}}/>
                                            </FloatingLabel>
                                        </Col>
                                        <Col xs={12} md={4}>
                                            <FloatingLabel controlId="floatingInputNum" label="數量" className="mb-1 ">
                                                <Form.Control type="number" placeholder="數量" name='num' value={this.state.insertData.num|| ''}  onChange={(e)=>{this.handleDataChange(e,"insert")}} />
                                            </FloatingLabel>
                                        </Col>
                                        <Col xs={12} md={4}>
                                            <FloatingLabel controlId="floatingInputPricePer" label="單價" className="mb-1 ">
                                                <Form.Control type="number" placeholder="單價" name='price_per' value={this.state.insertData.price_per|| ''} onChange={(e)=>{this.handleDataChange(e,"insert")}}disabled readOnly />
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

                        {/* search */}
                        <div className="AdminMatManageItem">
                            <div className="AdminMatManageItemTitle">
                                <a href="/#" className="AdminMatManageItemTitle" name="searchWrapper" onClick={this.WrapperOpen}>材料搜尋<Eject className={this.state.WrapperOpen.searchWrapper ? 'AdminMatManageItemTitleIcon active' : 'AdminMatManageItemTitleIcon noActive'} /></a>
                            </div>
                            <div className={this.state.WrapperOpen.searchWrapper ? 'AdminMatManageItemWrapper searchWrapper active' : 'AdminMatManageItemWrapper searchWrapper'}>
                                <Container>
                                    <Row className="justify-content-md-center insertRow">
                                        <Col xs={12} md={3}>
                                            <FloatingLabel controlId="floatingInputIdSearch" label="ID" className="mb-1 ">
                                                <Form.Control type="text" placeholder="ID" name='id' value={this.state.searchData.id}  onChange={(e)=>{this.handleDataChange(e,"search")}}/>
                                            </FloatingLabel>
                                        </Col>
                                        <Col xs={12} md={3}>
                                            <FloatingLabel controlId="floatingSelectTypeSearch" label="類別">
                                                <Form.Select aria-label="Floating label select" name='type' value={this.state.searchData.type}  onChange={(e)=>{this.handleDataChange(e,"search")}} >
                                                    {this.state.SelectOption.ma_type.map(({ value, label }, index) => <option key={index} value={value} >{label}</option>)}
                                                </Form.Select>
                                            </FloatingLabel>
                                        </Col>
                                        <Col xs={12} md={3}>
                                            <FloatingLabel controlId="floatingInputNameSearch" label="品名" className="mb-1 ">
                                                <Form.Control type="text" placeholder="品名" name='name' value={this.state.searchData.name} onChange={(e)=>{this.handleDataChange(e,"search")}}/>
                                            </FloatingLabel>
                                        </Col>
                                        <Col xs={12} md={3}>
                                            <FloatingLabel controlId="floatingInputSizeSearch" label="尺寸" className="mb-1 ">
                                                <Form.Control type="text" placeholder="尺寸" name='size' value={this.state.searchData.size} onChange={(e)=>{this.handleDataChange(e,"search")}} />
                                            </FloatingLabel>
                                        </Col>
                                    </Row>

                                    <Row className="justify-content-md-center insertRow">
                                        <Col xs={12} md={3}>
                                            <FloatingLabel controlId="floatingSelectQualitySearch" label="質地">
                                                <Form.Select aria-label="Floating label select" name='quality' value={this.state.searchData.quality}  onChange={(e)=>{this.handleDataChange(e,"search")}} >
                                                    {this.state.SelectOption.ma_quality.map(({ value, label }, index) => <option key={index} value={value} >{label}</option>)}
                                                </Form.Select>
                                            </FloatingLabel>
                                        </Col>
                                        <Col xs={12} md={3}>
                                            <FloatingLabel controlId="floatingInputStoreNameSearch" label="店家" className="mb-1 ">
                                                <Form.Control type="text" placeholder="店家" name='storeName' value={this.state.searchData.storeName}  onChange={(e)=>{this.handleDataChange(e,"search")}} />
                                            </FloatingLabel>
                                        </Col>
                                        <Col xs={12} md={3}>
                                            <FloatingLabel controlId="floatingInputLowPricePerSearch" label="最低單價" className="mb-1 ">
                                                <Form.Control type="number" placeholder="最低單價" name='lowPricePer' value={this.state.searchData.lowPricePer || ''}  onChange={(e)=>{this.handleDataChange(e,"search")}}  />
                                            </FloatingLabel>
                                        </Col>
                                        <Col xs={12} md={3}>
                                            <FloatingLabel controlId="floatingInputHighPricePerSearch" label="最高單價" className="mb-1 ">
                                                <Form.Control type="number" placeholder="最高單價" name='highPricePer' value={this.state.searchData.highPricePer || ''}  onChange={(e)=>{this.handleDataChange(e,"search")}}  />
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

                                </Container>
                            </div>
                        </div>

                        <div className="AdminMatManageItem">
                            <div className="matDataList">
                                <DataGrid
                                    rows={this.state.gridData}
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
