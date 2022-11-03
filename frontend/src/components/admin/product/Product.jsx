import './product.scss'
import '../../../css/hashtag.css'
import { Component } from 'react'
import { ModalMaList } from './modalMaList/ModalMaList'

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Container from 'react-bootstrap/Container'
import FloatingLabel from 'react-bootstrap/FloatingLabel'

import TextField from '@mui/material/TextField';
import { Clear } from '@material-ui/icons';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { postData } from "../../../api";
import Button from '../../../components/button/Button'
import PicWall from '../../../components/upload/PicWall'
import Loading from '../../../components/loading/Loading'
import { checkEmpty } from '../../../utility.ts'

//hashtag   
import { WithContext as ReactTags } from 'react-tag-input';


export class Product extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            insertData: this.props.type == 'update' ? this.props.updateData : {
                name: '', kind: '', size: '', inventory: '', status: '',
                catenaBelong: '', singleBelong: '', catenaIntro: '', productIntro: '', otherIntro: '',
                scheduledDate: null, LimitDateBeg: null, LimitDateEnd: null,
                productItemsTotalPrice: '', productProfit: '', productPrice: '',
            },
            // insertData: {
            //     name: '', kind: '', size: '', inventory: '', status: '',
            //     catenaBelong: '', singleBelong: '', catenaIntro: '', productIntro: '', otherIntro: '',
            //     scheduledDate: null, LimitDateBeg: null, LimitDateEnd: null,
            // },
            selectOption: {
                product_kind: [],
                product_status: [],
                product_catena: [],
                product_single: [],
            },
            modal: {
                isShow: false,
                data: [],
            },
            hashtags: [],
            fileList: [],// upload
            maList: [], // 使用材料清單
        };

        // this.target = createRef(null);

        //bind
        this.handleInsertDataChange = this.handleInsertDataChange.bind(this);
        this.handleDatePickerChange = this.handleDatePickerChange.bind(this);
        this.handleMaListData = this.handleMaListData.bind(this);
        this.insertMaListItem = this.insertMaListItem.bind(this);
        this.deleteMaListItem = this.deleteMaListItem.bind(this);
        this.modalOnHide = this.modalOnHide.bind(this);
        this.submitForm = this.submitForm.bind(this);

        // pic wall
        this.onChangePicWall = this.onChangePicWall.bind(this);
        this.handleOnPreview = this.handleOnPreview.bind(this);
        this.handleDeleteItem = this.handleDeleteItem.bind(this);

        //hashtag  
        this.handleHashtagsDelete = this.handleHashtagsDelete.bind(this);
        this.handleHashtagsAddition = this.handleHashtagsAddition.bind(this);
        this.handleHashtagsDrag = this.handleHashtagsDrag.bind(this);
        this.handleHashtagsClick = this.handleHashtagsClick.bind(this);
        this.onClearAllHashtags = this.onClearAllHashtags.bind(this);
    }


    componentDidMount() {
        this._getSelectOption();
    }

    log(tmpState) {
        console.log('log:', tmpState);
    }
    // 計算總計&利潤
    cntPriceAndProfit() {
        let _maList = this.state.maList;
        let tmpTotalPrice = 0;
        for (let ele of _maList) {
            tmpTotalPrice += Number(ele.cntNum * ele.price_per);
        }
        this.setState((prev) => ({
            insertData: { ...prev.insertData, productItemsTotalPrice: tmpTotalPrice, productProfit: (prev.insertData.productPrice - tmpTotalPrice) }
        }));
    }
    
    componentDidUpdate(prevProps, prevState) {
        // console.log("prevProps",prevProps);
        // console.log("prevState", prevState);

        // maList has been updated
        if (prevState.maList !== this.state.maList ) {
            // update modal data
            this.setState({ modal: { ...this.state.modal, data: this.state.maList } }
                // , this.log(this.state.modal.data)
            )
            // 重新計算總計&利潤
            this.cntPriceAndProfit();
        }

    }



    //get select Option 
    async _getSelectOption() {
        let qryTmp = Object.keys(this.state.selectOption);
        let _SelectOption = [];
        //get Select Option res 
        let _res = await postData("/api/getSelectOption", qryTmp);
        //update Select Option data
        qryTmp.forEach(ele => {
            _SelectOption[ele] = [{ value: '', label: '==請選擇==' },];
            _res.data[ele].forEach(async ele_res => {
                if (ele_res.value !== '**') {
                    await _SelectOption[ele].push(ele_res)
                }
            })
        })
        this.setState({ selectOption: _SelectOption })
    }

    async handleInsertDataChange(event) {
        event.preventDefault();
        // console.log(event.target.value);
        let _insertData = this.state.insertData;
        //將庫存type轉成string
        if (event.target.name === 'inventory') {
            event.target.value = event.target.value.toString();
        }
        _insertData[event.target.name] = event.target.value;

        switch (event.target.name) {
            case 'catenaBelong':
                if (await checkEmpty(this.state.insertData.catenaBelong)) {
                    // get code mark
                    let _res = await postData("/api/getCodeMark/product_catena/" + this.state.insertData.catenaBelong);
                    _insertData.catenaIntro = _res.data.mark;
                } else {
                    _insertData.catenaIntro = '';
                }
                break;

            case 'singleBelong':
                if (await checkEmpty(this.state.insertData.singleBelong)) {
                    // get code mark
                    let _res = await postData("/api/getCodeMark/product_single/" + this.state.insertData.singleBelong);
                    _insertData.productIntro = _res.data.mark;
                } else {
                    _insertData.productIntro = '';
                }
                break;

            case 'status':
                // 若status為"無庫存' , 將庫存的數量改為0
                if (this.state.insertData.status === 'NoInventory') {
                    this.state.insertData.inventory = '0';
                }
                break;

            // 計算利潤
            case 'productItemsTotalPrice':
            case 'productPrice':
                _insertData.productProfit = _insertData.productPrice - _insertData.productItemsTotalPrice;
                break;

            default:
                break;
        }

        this.setState({ insertData: _insertData });

    }

    async handleDatePickerChange(newValue, targetName) {
        let _insertData = this.state.insertData;
        _insertData[targetName] = newValue;
        this.setState({ insertData: _insertData });
    }

    async handleSubmit(event) {
        event.preventDefault();
        // console.log(this.state.insertData);

        // let _res = await postData('/api/insertProductData',res);

    }

    // #region [hashtag]
    handleHashtagsDelete(i) {
        let _tags = this.state.hashtags.filter((tag, index) => index !== i);
        this.setState({ hashtags: _tags });
    };

    handleHashtagsAddition(tag) {
        this.setState({ hashtags: [...this.state.hashtags, tag] });
    };

    handleHashtagsDrag(tag, currPos, newPos) {
        const newTags = this.state.hashtags.slice();
        newTags.splice(currPos, 1);
        newTags.splice(newPos, 0, tag);
        // re-render
        this.setState({ hashtags: newTags });
    };

    handleHashtagsClick(index) {
        // console.log('The tag at index ' + index + ' was clicked');
    };

    onClearAllHashtags() {
        this.setState({ hashtags: [] });
    };
    // #endregion


    // #region [Picture Wall]

    onChangePicWall(fileList) { this.setState({ fileList: [...fileList] }); }

    handleOnPreview(files) {
        for (let ele of files) {
            // console.log(files);
            // const file = files[0];
            const file = ele;
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                // convert image file to base64 string
                this.setState((prev) => ({
                    fileList: [...prev.fileList,
                    {
                        id: file.size + Math.floor(Math.random() * 1000).toString(),
                        imageUrl: reader.result,
                    }]
                }));
            }, false);
            if (file) { reader.readAsDataURL(file); }
        }
    };

    handleDeleteItem(fileId) { this.setState((prev) => ({ fileList: prev.fileList.filter((item) => item.id !== fileId) })); };

    // #endregion


    // #region [right wrapper & maList modal]
    // open ma list modal
    insertMaListItem() { this.setState((prev) => ({ modal: { ...prev.modal, isShow: !prev.modal.isShow } })); }

    // handle MaList Data
    handleMaListData(event, index) {
        event.preventDefault();
        let _maList = this.state.maList;
        _maList[index][event.target.name] = event.target.value;
        if (event.target.name == 'cntNum') {
            // 計算單素材使用價錢
            _maList[index].itemPrice = _maList[index].cntNum * _maList[index].price_per;
            this.cntPriceAndProfit();
        }
        this.setState({ maList: _maList });
    }

    deleteMaListItem(index) { this.setState((prev) => ({ maList: prev.maList.filter((_, i) => i !== index) })); }

    modalOnHide() { this.setState((prev) => ({ modal: { ...prev.modal, isShow: !prev.modal.isShow } })); }

    //modal submit
    submitForm(event, data) {
        event.preventDefault();
        // let tmpMaList = this.state.maList;
        let tmpMaList = [];
        for (let ele of data) {
            tmpMaList.push({ ...ele, itemPrice: ele.cntNum * ele.price_per });
        }
        this.setState({ maList: tmpMaList })
        this.modalOnHide();
    }
    // #endregion


    render() {

        //hashtag beg=========================================
        const KeyCodes = { comma: 188, enter: 13 };
        const delimiters = [KeyCodes.comma, KeyCodes.enter];
        //hashtag end=========================================

        const maListTmp = this.state.maList.map((item, index) => (
            <Row key={index}>
                <Col xs={1} md={1} className="maListItemCol">
                    <Button variant="contained" startIcon={<Clear />} themeColor="error" onClick={() => this.deleteMaListItem(index)}
                        style={{
                            paddingLeft: '7px',
                            borderRadius: 50,
                            minWidth: '1px',
                            height: '38px'
                        }}>
                    </Button>
                </Col>

                <Col xs={2} md={3} style={{ display: 'flex' }}>
                    <FloatingLabel controlId="floatingInputItemName" label="名稱" className="mb-1 ">
                        <Form.Control type="text" placeholder="名稱" name='itemName' value={item.name} disabled
                            onChange={(event) => { this.handleMaListData(event, index) }} />
                    </FloatingLabel>

                </Col>
                <Col xs={2} md={2}>
                    <FloatingLabel controlId="floatingInputItemSize" label="尺寸" className="mb-1 ">
                        <Form.Control type="text" placeholder="尺寸" name='itemSize' value={item.size} disabled
                            onChange={(event) => { this.handleMaListData(event, index) }} />
                    </FloatingLabel>
                </Col>
                <Col xs={2} md={2}>
                    <FloatingLabel controlId="floatingInputItemNum" label="數量" className="mb-1 ">
                        <Form.Control type="text" placeholder="數量" name='cntNum' value={item.cntNum}
                            onChange={(event) => { this.handleMaListData(event, index) }} />
                    </FloatingLabel>
                </Col>
                <Col xs={2} md={2} className="maListItemCol">
                    單價 :{item.price_per}
                </Col>
                <Col xs={2} md={2} className="maListItemCol">
                    小計 :{item.itemPrice | 0}
                </Col>
            </Row>
        ))

        return (
            <div className="product">
                {this.state.isLoading ? <Loading /> : null}
                {/* productWrapper */}
                <div className="productWrapper">
                    {/* adminProductBodyLeft */}
                    <div className="adminProductBodyLeft">

                        {/* 基本資料 */}
                        <div className="adminProductItem">
                            <div className="adminProductItemWrapper">
                                <Container>
                                    <Row>
                                        <Col xs={12} md={6}>
                                            <FloatingLabel controlId="floatingInputName" label="品名" className="mb-2 ">
                                                <Form.Control type="text" placeholder="品名" name='name' value={this.state.insertData.name} onChange={this.handleInsertDataChange} />
                                            </FloatingLabel>
                                        </Col>
                                        <Col xs={12} md={6}>
                                            <FloatingLabel controlId="floatingSelectStatus" label="商品狀態">
                                                <Form.Select aria-label="Floating label select" name='status' value={this.state.insertData.status} onChange={this.handleInsertDataChange} >
                                                    {this.state.selectOption.product_status.map(({ value, label }, index) => <option key={index} value={value} >{label}</option>)}
                                                </Form.Select>
                                            </FloatingLabel>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs={12} md={6}>
                                            <FloatingLabel controlId="floatingSelectKind" label="商品種類">
                                                <Form.Select aria-label="Floating label select" name='kind' value={this.state.insertData.kind} onChange={this.handleInsertDataChange} >
                                                    {this.state.selectOption.product_kind.map(({ value, label }, index) => <option key={index} value={value} >{label}</option>)}
                                                </Form.Select>
                                            </FloatingLabel>
                                        </Col>
                                        <Col xs={12} md={6}>
                                            <FloatingLabel controlId="floatingInputSize" label="尺寸" className="mb-2 ">
                                                <Form.Control type="text" placeholder="尺寸" name='size' value={this.state.insertData.size} onChange={this.handleInsertDataChange} />
                                            </FloatingLabel>
                                        </Col>
                                    </Row>

                                    {this.state.insertData.status !== 'NoInventory' ?
                                        <Row>
                                            <Col xs={12} md={6}>
                                                <FloatingLabel controlId="floatingInputInventory" label="庫存" className="mb-2 ">
                                                    <Form.Control type="number" placeholder="庫存" name='inventory' value={Number(this.state.insertData.inventory)} onChange={this.handleInsertDataChange} />
                                                </FloatingLabel>
                                            </Col>
                                        </Row> : null
                                    }

                                    {this.state.insertData.status === 'Scheduled' ?
                                        <Row>
                                            <Col xs={12} md={12} className="mb-2 " >
                                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                    <DatePicker
                                                        label="預訂上架日期"
                                                        value={this.state.insertData.scheduledDate}
                                                        onChange={(newValue) => { this.handleDatePickerChange(newValue, 'scheduledDate') }}
                                                        renderInput={(params) => <TextField {...params} />}
                                                    />
                                                </LocalizationProvider>
                                            </Col>
                                        </Row> : null
                                    }

                                    {this.state.insertData.status === 'Limit' ?
                                        <Row>
                                            <Col xs={12} md={6} className="mb-2 ">
                                                <LocalizationProvider dateAdapter={AdapterDateFns} >
                                                    <DatePicker
                                                        label="上架日期"
                                                        value={this.state.insertData.LimitDateBeg}
                                                        onChange={(newValue) => { this.handleDatePickerChange(newValue, 'LimitDateBeg') }}
                                                        renderInput={(params) => <TextField {...params} />}
                                                    />
                                                </LocalizationProvider>
                                            </Col>
                                            <Col xs={12} md={6}>
                                                <LocalizationProvider dateAdapter={AdapterDateFns} >
                                                    <DatePicker
                                                        label="下架日期"
                                                        value={this.state.insertData.LimitDateEnd}
                                                        onChange={(newValue) => { this.handleDatePickerChange(newValue, 'LimitDateEnd') }}
                                                        renderInput={(params) => <TextField {...params} />}
                                                    />
                                                </LocalizationProvider>
                                            </Col>
                                        </Row> : null
                                    }
                                </Container>
                            </div>
                        </div>

                        {/* 系列 */}
                        <div className="adminProductItem">
                            <div className="adminProductItemTitle">

                            </div>
                            <div className="adminProductItemWrapper">
                                <Container>
                                    <Row>
                                        <Col xs={12} md={6}>
                                            <FloatingLabel controlId="floatingSelectCatenaBelong" label="所屬系列" className="mb-1 ">
                                                <Form.Select aria-label="Floating label select" name='catenaBelong' value={this.state.insertData.catenaBelong} onChange={this.handleInsertDataChange} >
                                                    {this.state.selectOption.product_catena.map(({ value, label }, index) => <option key={index} value={value} >{label}</option>)}
                                                </Form.Select>
                                            </FloatingLabel>
                                        </Col>
                                        <Col xs={12} md={12}>
                                            <FloatingLabel controlId="floatingTextareaCatenaIntro" label="系列介紹" className="mb-1 ">
                                                <Form.Control
                                                    as="textarea"
                                                    placeholder="系列介紹"
                                                    name='catenaIntro'
                                                    value={this.state.insertData.catenaIntro}
                                                    onChange={this.handleInsertDataChange}
                                                    style={{ height: '100px' }} />
                                            </FloatingLabel>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs={12} md={6}>
                                            <FloatingLabel controlId="floatingSelectProductBelong" label="所屬單品" className="mb-1 ">
                                                <Form.Select aria-label="Floating label select" name='singleBelong' value={this.state.insertData.singleBelong} onChange={this.handleInsertDataChange} >
                                                    {this.state.selectOption.product_single.map(({ value, label }, index) => <option key={index} value={value} >{label}</option>)}
                                                </Form.Select>
                                            </FloatingLabel>
                                        </Col>
                                        <Col xs={12} md={12}>
                                            <FloatingLabel controlId="floatingTextareaProductIntro" label="單品介紹" className="mb-1 ">
                                                <Form.Control
                                                    as="textarea"
                                                    placeholder="單品介紹"
                                                    name='productIntro'
                                                    value={this.state.insertData.productIntro}
                                                    onChange={this.handleInsertDataChange}
                                                    style={{ height: '100px' }} />
                                            </FloatingLabel>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs={12} md={12}>
                                            <FloatingLabel controlId="floatingTextareaOtherIntro" label="其他介紹" className="mb-1 ">
                                                <Form.Control
                                                    as="textarea"
                                                    placeholder="其他介紹"
                                                    name='otherIntro'
                                                    value={this.state.insertData.otherIntro}
                                                    onChange={this.handleInsertDataChange}
                                                    style={{ height: '100px' }} />
                                            </FloatingLabel>
                                        </Col>
                                    </Row>

                                </Container>
                            </div>
                        </div>

                        {/* Hashtags */}
                        {/* <div className="adminProductItem">
                                <div className="adminProductItemTitle">
                                    新增 Hashtags
                                </div>
                                <div className="adminProductItemWrapper">
                                    <Container>
                                        <Row>
                                            <Col xs={12} md={12}>
                                                <ReactTags
                                                    autofocus={false}
                                                    // suggestions={suggestions}
                                                    placeholder='Add hashtags'
                                                    tags={this.state.hashtags}
                                                    delimiters={delimiters}
                                                    handleDelete={this.handleHashtagsDelete}
                                                    handleAddition={this.handleHashtagsAddition}
                                                    handleDrag={this.handleHashtagsDrag}
                                                    handleTagClick={this.handleHashtagsClick}
                                                    inputFieldPosition="top"
                                                    // autocomplete
                                                    clearAll
                                                    onClearAll={this.onClearAllHashtags} />
                                            </Col>
                                        </Row>
                                    </Container>
                                </div>
                            </div> */}

                        {/* PIC WALL */}
                        <div className="adminProductItem">
                            <div className="adminProductItemTitle">
                                商品照上傳
                            </div>
                            <div className="adminProductItemWrapper">
                                <Container>
                                    <Row>
                                        <Col xs={12} md={12}>
                                            <PicWall
                                                fileList={this.state.fileList}
                                                handleOnPreview={this.handleOnPreview}
                                                handleDeleteItem={this.handleDeleteItem}
                                                onChangePicWall={this.onChangePicWall}></PicWall>
                                        </Col>
                                    </Row>

                                </Container>
                            </div>
                        </div>

                    </div>
                    {/* adminProductBodyLeft end */}

                    {/* adminProductBodyRight */}
                    <div className="adminProductBodyRight">
                        <div className="adminProductItem">

                            <div className="adminProductItemWrapper" style={{ minWidth: '600px' }}>
                                <Container>
                                    <Row>
                                        <Col xs={12} md={4}>
                                            <FloatingLabel controlId="floatingInputProductPrice" label="售價" className="mb-1 ">
                                                <Form.Control type="text" placeholder="售價" name='productPrice' value={this.state.insertData.productPrice} onChange={this.handleInsertDataChange} />
                                            </FloatingLabel>
                                        </Col>
                                    </Row>
                                    <div className="adminProductItemTitle">
                                        使用材料
                                    </div>
                                    <Row style={{ paddingBottom: '10px' }}>
                                        <Col xs={12} md={{ span: 3, offset: 9 }}>
                                            <Button variant="contained" themeColor="success" onClick={this.insertMaListItem}>新增</Button>
                                        </Col>
                                    </Row>

                                    {maListTmp}

                                    <Row>
                                        <Col xs={12} md={{ span: 3, offset: 9 }}>
                                            <Button variant="contained" themeColor="success" onClick={this.insertMaListItem}>新增</Button>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col xs={12} md={6}>
                                            <FloatingLabel controlId="floatingInputProductTotalPrice" label="總計" className="mb-2 ">
                                                <Form.Control type="text" placeholder="總計" name='productItemsTotalPrice' value={this.state.insertData.productItemsTotalPrice} onChange={this.handleInsertDataChange} disabled />
                                            </FloatingLabel>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col xs={12} md={6}>
                                            <FloatingLabel controlId="floatingInputProductProfit" label="利潤" className="mb-2 ">
                                                <Form.Control type="text" placeholder="利潤" name='productProfit' value={this.state.insertData.productProfit} onChange={this.handleInsertDataChange} disabled />
                                            </FloatingLabel>
                                        </Col>
                                    </Row>


                                </Container>
                            </div>

                        </div>
                        {/* <ModalMaList /> */}

                        <ModalMaList isShow={this.state.modal.isShow} onHide={this.modalOnHide} data={this.state.modal.data}
                            submitForm={(e, data) => { this.submitForm(e, data) }} />

                    </div>
                    {/* adminProductBodyRight end */}
                </div>
                {/* productWrapper end */}
            </div >
        )
    }
}
