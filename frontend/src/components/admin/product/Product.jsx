import './product.css'
import '../../../css/hashtag.css'
import { Component } from 'react'
import { ModalMaList } from './modalMaList/ModalMaList'

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Container from 'react-bootstrap/Container'
import FloatingLabel from 'react-bootstrap/FloatingLabel'

import TextField from '@mui/material/TextField';
import { Clear, Search } from '@material-ui/icons';
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
                data: {},
            },
            hashtags: [],
            fileList: [],// upload
            maList: [], // 使用材料清單
        };

        // this.target = createRef(null);

        //bind
        this.handleDataChange = this.handleDataChange.bind(this);
        this.handleDatePickerChange = this.handleDatePickerChange.bind(this);

        this.onChangePicWall = this.onChangePicWall.bind(this);
        this.insertMaListItem = this.insertMaListItem.bind(this);
        this.deleteMaListItem = this.deleteMaListItem.bind(this);

        this.modalOnHide = this.modalOnHide.bind(this);
        this.submitForm = this.submitForm.bind(this);
        
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

    async handleDataChange(event) {
        event.preventDefault();
        // console.log(event.target.value);
        let _insertData = this.state.insertData;
        //將庫存type轉成string
        if (event.target.name === 'inventory') {
            event.target.value = event.target.value.toString();
        }
        _insertData[event.target.name] = event.target.value;
        this.setState({ insertData: _insertData });

        // handle catenaBelong 
        if (event.target.name === 'catenaBelong') {
            if (await checkEmpty(this.state.insertData.catenaBelong)) {
                // get code mark
                let _res = await postData("/api/getCodeMark/product_catena/" + this.state.insertData.catenaBelong);
                _insertData.catenaIntro = _res.data.mark;
            } else {
                _insertData.catenaIntro = '';
            }
            this.setState({ insertData: _insertData });
        }
        //handle singleBelong
        if (event.target.name === 'singleBelong') {
            if (await checkEmpty(this.state.insertData.singleBelong)) {
                // get code mark
                let _res = await postData("/api/getCodeMark/product_single/" + this.state.insertData.singleBelong);
                _insertData.productIntro = _res.data.mark;
            } else {
                _insertData.productIntro = '';
            }
            this.setState({ insertData: _insertData });
        }

        //handle
        if (event.target.name === 'status') {
            if (this.state.insertData.status === 'NoInventory') {
                this.state.insertData.inventory = '0';
            }
            this.setState({ insertData: _insertData });
        }
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

    //hashtag beg
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
    //hashtag end

    onChangePicWall(fileList) {
        this.setState({ fileList: [...fileList] });
    }

    insertMaListItem() {
        // this.setState((prev) => ({
        //     maList: [...prev.maList, {}]
        // }));
        let _modal = this.state.modal;
        _modal.isShow = !_modal.isShow;
        this.setState({ modal: _modal });
    }

    deleteMaListItem(index) {
        // this.setState((prev) => ({
        //     maList: prev.maList.filter((_, i) => i !== index)
        // }));
    }

  
    modalOnHide() {
        let _modal = this.state.modal;
        _modal.isShow = !_modal.isShow;
        this.setState({ modal: _modal });
    }

    //edit submit
    async submitForm(event, data) {
        event.preventDefault();
        let tmpMaList = this.state.maList;
        for (let i of data) {
            tmpMaList.push({ ...i, itemNum: 0 });
            // this.state.maList.push({ ...i, itemNum: 0 })
        }

        this.setState({ maList: tmpMaList })
        this.modalOnHide();
    }



    render() {

        //hashtag beg=========================================
        const KeyCodes = {
            comma: 188,
            enter: 13
        };
        const delimiters = [KeyCodes.comma, KeyCodes.enter];
        //hashtag end=========================================

        // Picture Wall beg=========================================
        const handleOnPreview = (files) => {
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

        const handleDeleteItem = (fileId) => {
            this.setState((prev) => ({
                fileList: prev.fileList.filter((item) => item.id !== fileId)
            }));
        };
        // Picture Wall end=========================================


        return (
            <div className="product">
                {this.state.isLoading ? <Loading /> : ''}
                {/* productWrapper */}
                <div className="productWrapper">
                    {/* adminProductBody */}
                    <div className="adminProductBody">
                        {/* adminProductBodyLeft */}
                        <div className="adminProductBodyLeft">

                            {/* 基本資料 */}
                            <div className="adminProductItem">
                                <div className="adminProductItemWrapper">
                                    <Container>
                                        <Row>
                                            <Col xs={12} md={6}>
                                                <FloatingLabel controlId="floatingInputName" label="品名" className="mb-2 ">
                                                    <Form.Control type="text" placeholder="品名" name='name' value={this.state.insertData.name} onChange={this.handleDataChange} />
                                                </FloatingLabel>
                                            </Col>
                                            <Col xs={12} md={6}>
                                                <FloatingLabel controlId="floatingSelectStatus" label="商品狀態">
                                                    <Form.Select aria-label="Floating label select" name='status' value={this.state.insertData.status} onChange={this.handleDataChange} >
                                                        {this.state.selectOption.product_status.map(({ value, label }, index) => <option key={index} value={value} >{label}</option>)}
                                                    </Form.Select>
                                                </FloatingLabel>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs={12} md={6}>
                                                <FloatingLabel controlId="floatingSelectKind" label="商品種類">
                                                    <Form.Select aria-label="Floating label select" name='kind' value={this.state.insertData.kind} onChange={this.handleDataChange} >
                                                        {this.state.selectOption.product_kind.map(({ value, label }, index) => <option key={index} value={value} >{label}</option>)}
                                                    </Form.Select>
                                                </FloatingLabel>
                                            </Col>
                                            <Col xs={12} md={6}>
                                                <FloatingLabel controlId="floatingInputSize" label="尺寸" className="mb-2 ">
                                                    <Form.Control type="text" placeholder="尺寸" name='size' value={this.state.insertData.size} onChange={this.handleDataChange} />
                                                </FloatingLabel>
                                            </Col>
                                        </Row>

                                        {this.state.insertData.status !== 'NoInventory' ?
                                            <Row>
                                                <Col xs={12} md={6}>
                                                    <FloatingLabel controlId="floatingInputInventory" label="庫存" className="mb-2 ">
                                                        <Form.Control type="number" placeholder="庫存" name='inventory' value={Number(this.state.insertData.inventory)} onChange={this.handleDataChange} />
                                                    </FloatingLabel>
                                                </Col>
                                            </Row> : ''
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
                                            </Row> : ''
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
                                            </Row> : ''
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
                                                    <Form.Select aria-label="Floating label select" name='catenaBelong' value={this.state.insertData.catenaBelong} onChange={this.handleDataChange} >
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
                                                        onChange={this.handleDataChange}
                                                        style={{ height: '100px' }}
                                                    />
                                                </FloatingLabel>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs={12} md={6}>
                                                <FloatingLabel controlId="floatingSelectProductBelong" label="所屬單品" className="mb-1 ">
                                                    <Form.Select aria-label="Floating label select" name='singleBelong' value={this.state.insertData.singleBelong} onChange={this.handleDataChange} >
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
                                                        onChange={this.handleDataChange}
                                                        style={{ height: '100px' }}
                                                    />
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
                                                        onChange={this.handleDataChange}
                                                        style={{ height: '100px' }}
                                                    />
                                                </FloatingLabel>
                                            </Col>
                                        </Row>

                                    </Container>
                                </div>
                            </div>

                            {/* Hashtags */}
                            <div className="adminProductItem">
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
                                                    onClearAll={this.onClearAllHashtags}
                                                />
                                            </Col>
                                        </Row>
                                    </Container>
                                </div>
                            </div>

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
                                                    handleOnPreview={handleOnPreview}
                                                    handleDeleteItem={handleDeleteItem}
                                                    onChangePicWall={this.onChangePicWall}
                                                ></PicWall>
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
                                                <FloatingLabel controlId="floatingInputPrice" label="售價" className="mb-1 ">
                                                    <Form.Control type="text" placeholder="售價" name='price' />
                                                </FloatingLabel>
                                            </Col>
                                        </Row>
                                        <div className="adminProductItemTitle">
                                            使用材料
                                        </div>
                                        <Row style={{ paddingBottom: '10px' }}>
                                            <Col xs={12} md={{ span: 3, offset: 9 }}>
                                                <Button
                                                    variant="contained"
                                                    themeColor="success"
                                                    onClick={this.insertMaListItem}
                                                >
                                                    新增
                                                </Button>
                                            </Col>
                                        </Row>
                                        {
                                            this.state.maList.map((item, index) => (
                                                <Row key={index}>
                                                    <Col xs={1} md={1} className="maListItemCol" style={{ width: '10px' }}>
                                                        <Button
                                                            variant="contained"
                                                            themeColor="error"
                                                            onClick={this.deleteMaListItem(index)}
                                                            style={{
                                                                marginRight: '10px',
                                                                borderRadius: 50,
                                                                minWidth: '30px',
                                                                height: '30px'
                                                            }}
                                                        >
                                                            <Clear />
                                                        </Button>
                                                    </Col>

                                                    <Col xs={2} md={3} style={{ display: 'flex' }}>
                                                        <FloatingLabel controlId="floatingInputItemName" label="名稱" className="mb-1 ">
                                                            <Form.Control type="text" placeholder="名稱" name='itemName' value={item.name} disabled />
                                                        </FloatingLabel>

                                                    </Col>
                                                    <Col xs={2} md={2}>
                                                        <FloatingLabel controlId="floatingInputItemSize" label="尺寸" className="mb-1 ">
                                                            <Form.Control type="text" placeholder="尺寸" name='itemSize' value={item.size} />
                                                        </FloatingLabel>
                                                    </Col>
                                                    <Col xs={2} md={2}>
                                                        <FloatingLabel controlId="floatingInputItemNum" label="數量" className="mb-1 ">
                                                            <Form.Control type="text" placeholder="數量" name='itemNum' value={item.num} />
                                                        </FloatingLabel>
                                                    </Col>
                                                    <Col xs={2} md={2} className="maListItemCol">
                                                        單價 :{item.price_per}
                                                    </Col>
                                                    <Col xs={2} md={2} className="maListItemCol">
                                                        小計 :
                                                        {/* {item.price_per *2 | 0} */}
                                                    </Col>
                                                </Row>
                                            ))
                                        }
                                        <Row>
                                            <Col xs={12} md={{ span: 3, offset: 9 }}>
                                                <Button
                                                    variant="contained"
                                                    themeColor="success"
                                                    onClick={this.insertMaListItem}
                                                >
                                                    新增
                                                </Button>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col xs={12} md={12}>
                                                總計
                                            </Col>
                                            <Col xs={12} md={12}>
                                                利潤
                                            </Col>
                                        </Row>

                                    </Container>
                                </div>

                            </div>
                            {/* <ModalMaList /> */}

                            <ModalMaList isShow={this.state.modal.isShow} onHide={this.modalOnHide}
                                submitForm={(e, data) => { this.submitForm(e, data) }} />

                        </div>
                        {/* adminProductBodyRight end */}
                    </div>
                    {/* adminProductBody end */}
                </div>
                {/* productWrapper end */}
            </div >
        )
    }
}
