import './adminProductAdd.css'
import './hashtag.css'
import { Component, createRef } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import Button from 'react-bootstrap/Button'
import { postData } from "../../../api";

import Figure from 'react-bootstrap/Figure';
// import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
// import Popover from 'react-bootstrap/Popover';
// import Tooltip from 'react-bootstrap/Tooltip';
// import Overlay from 'react-bootstrap/Overlay';

import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

//hashtag   
import { WithContext as ReactTags } from 'react-tag-input';


export class AdminProductAdd extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            insertData: {
                name: '', kind: '', size: '', inventory: '', status: '',
                catenaBelong: '', singleBelong: '', catenaIntro: '', productIntro: '', otherIntro: '',
                scheduledDate: null, LimitDateBeg: null, LimitDateEnd: null,
            },
            SelectOption: {
                product_kind: [],
                product_status: [],
                product_catena: [],
                product_single: [],
            },
            hashtags: [],
        };
        this.target = createRef(null);

        //bind
        this.handleDataChange = this.handleDataChange.bind(this);
        this.handleDatePickerChange = this.handleDatePickerChange.bind(this);

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
        let qryTmp = Object.keys(this.state.SelectOption);
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
        this.setState({ SelectOption: _SelectOption })
    }

    //判斷obj是否為空
    async checkEmpty(o) {
        return (o !== null && o !== undefined && o !== '') ? true : false;
    }

    async handleDataChange(event) {
        event.preventDefault();

        // console.log(event.target.value);
        let _insertData = this.state.insertData;

        //將庫存type轉成string
        if(event.target.name === 'inventory'){
            event.target.value = event.target.value.toString();
        }

        _insertData[event.target.name] = event.target.value;

        this.setState({ insertData: _insertData });

        // handle catenaBelong 
        if (event.target.name === 'catenaBelong') {
            if (await this.checkEmpty(this.state.insertData.catenaBelong)) {
                // get code mark
                let _res = await postData("/api/getCodeMark/product_catena/" + this.state.insertData.catenaBelong);
                _insertData.catenaIntro = _res.data.mark;
            }else{
                _insertData.catenaIntro = '';
            }
            this.setState({ insertData: _insertData });
        }
        //handle singleBelong
        if (event.target.name === 'singleBelong') {
            if (await this.checkEmpty(this.state.insertData.singleBelong)) {
                // get code mark
                let _res = await postData("/api/getCodeMark/product_single/" + this.state.insertData.singleBelong);
                _insertData.productIntro = _res.data.mark;
            }else{
                _insertData.productIntro ='';
            }
            this.setState({ insertData: _insertData });
        }

        //handle
        if (event.target.name === 'status') {
            if (this.state.insertData.status==='NoInventory'){
                this.state.insertData.inventory='0';
            }
            this.setState({ insertData: _insertData });
        }

        // // Convert the FileList into an array and iterate
        // let files = Array.from(event.target.files).map(file => {
        //     // Define a new file reader
        //     let reader = new FileReader();
        //     // Create a new promise
        //     return new Promise(resolve => {
        //         // Resolve the promise after reading file
        //         reader.onload = () => resolve(reader.result);
        //         // Reade the file as a text
        //         reader.readAsText(file);
        //     });
        // });

        // // At this point you'll have an array of results
        // let res = await Promise.all(files);
        // console.log(res);

    }

    async handleDatePickerChange(newValue, targetName) {
        let _insertData = this.state.insertData;
        _insertData[targetName] = newValue;
        this.setState({ insertData: _insertData });
    }


    async handleSubmit(event) {
        event.preventDefault()
        console.log(this.state.insertData);
        // const url = 'http://localhost:3000/uploadFile';
        // const formData = new FormData();
        // formData.append('file', file);
        // formData.append('fileName', file.name);
        // const config = {
        //   headers: {
        //     'content-type': 'multipart/form-data',
        //   },
        // };
        // axios.post(url, formData, config).then((response) => {
        //   console.log(response.data);
        // });

        // let _res = await postData('/api/insertProductData',res);

    }

    async upload(e){
        
        // Convert the FileList into an array and iterate
        let files = Array.from(e.target.files).map(file => {
            
            // Define a new file reader
            let reader = new FileReader();
            
            // Create a new promise
            return new Promise(resolve => {
                
                // Resolve the promise after reading file
                reader.onload = () => resolve(reader.result);
                
                // Reade the file as a text
                reader.readAsText(file);
                
            });
            
        });
        
        // At this point you'll have an array of results
        let res = await Promise.all(files);
        console.log(res);
        
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


    render() {

        //hashtag beg
        const KeyCodes = {
            comma: 188,
            enter: 13
        };
        const delimiters = [KeyCodes.comma, KeyCodes.enter];
        //hashtag end



        return (
            <div className="adminProductAdd">
                <div className="adminProductAddWrapper">
                    <div className="adminProductBody">
                        <div className="adminProductBodyLeft">
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
                                                        {this.state.SelectOption.product_status.map(({ value, label }, index) => <option key={index} value={value} >{label}</option>)}
                                                    </Form.Select>
                                                </FloatingLabel>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs={12} md={6}>
                                                <FloatingLabel controlId="floatingSelectKind" label="商品種類">
                                                    <Form.Select aria-label="Floating label select" name='kind' value={this.state.insertData.kind} onChange={this.handleDataChange} >
                                                        {this.state.SelectOption.product_kind.map(({ value, label }, index) => <option key={index} value={value} >{label}</option>)}
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
                            <div className="adminProductItem">
                                <div className="adminProductItemTitle">
                                    新增 Hashtags
                                </div>
                                <div className="adminProductItemWrapper">
                                    <Container>
                                        <Row>
                                            <Col xs={12} md={12}>
                                                <ReactTags
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

                            <div className="adminProductItem">
                                <div className="adminProductItemTitle">

                                </div>
                                <div className="adminProductItemWrapper">
                                    <Container>
                                        <Row>
                                            <Col xs={12} md={6}>
                                                <FloatingLabel controlId="floatingSelectCatenaBelong" label="所屬系列" className="mb-1 ">
                                                    <Form.Select aria-label="Floating label select" name='catenaBelong' value={this.state.insertData.catenaBelong} onChange={this.handleDataChange} >
                                                        {this.state.SelectOption.product_catena.map(({ value, label }, index) => <option key={index} value={value} >{label}</option>)}
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
                                                        {this.state.SelectOption.product_single.map(({ value, label }, index) => <option key={index} value={value} >{label}</option>)}
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
                         

                            <div className="adminProductItem">
                                <div className="adminProductItemTitle">
                                    商品照上傳
                                </div>
                                <div className="adminProductItemWrapper">
                                    <Container>
                                        <Row>
                                            <Col xs={12} md={12}>
                                                <Form.Group controlId="formFileMultiple" className="mb-3">
                                                    <Form.Control 
                                                        type="file" 
                                                        accept="image/jpg,image/jpeg,image/png"
                                                        multiple
                                                        // onChange = {this.upload} 
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col xs={12} md={12}>
                                                <Figure>
                                                    <Figure.Image
                                                        width={171}
                                                        height={180}
                                                        alt="171x180"
                                                    />
                                                    <Figure.Caption>
                                                        Nulla vitae elit libero, a pharetra augue mollis interdum.
                                                    </Figure.Caption>
                                                </Figure>
                                            </Col>
                                        </Row>

                                    </Container>
                                </div>

                            </div>
                        </div>

                        <div className="adminProductBodyRight">
                            <div className="adminProductItem">

                                <div className="adminProductItemWrapper">
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
                                        <Row>
                                            <Col xs={1} md={1}>
                                                index1
                                            </Col>
                                            <Col xs={2} md={2}>
                                                <FloatingLabel controlId="floatingInputX1" label="金具" className="mb-1 ">
                                                    <Form.Control type="text" placeholder="金具" name='id' />
                                                </FloatingLabel>
                                            </Col>
                                            <Col xs={2} md={2}>
                                                <FloatingLabel controlId="floatingInputX3" label="尺寸" className="mb-1 ">
                                                    <Form.Control type="text" placeholder="尺寸" name='id' />
                                                </FloatingLabel>
                                            </Col>
                                            <Col xs={2} md={2}>
                                                <FloatingLabel controlId="floatingInputX2" label="Num" className="mb-1 ">
                                                    <Form.Control type="text" placeholder="Num" name='id' />
                                                </FloatingLabel>
                                            </Col>
                                            <Col xs={2} md={2}>
                                                單價 1
                                            </Col>
                                            <Col xs={2} md={2}>
                                                小計 2
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs={1} md={1}>
                                                index2
                                            </Col>

                                            <Col xs={2} md={2}>
                                                <FloatingLabel controlId="floatingInputX1" label=" 半貴石:" className="mb-1 ">
                                                    <Form.Control type="text" placeholder="半貴石:" name='id' />
                                                </FloatingLabel>
                                            </Col>
                                            <Col xs={2} md={2}>
                                                <FloatingLabel controlId="floatingInputX3" label="尺寸" className="mb-1 ">
                                                    <Form.Control type="text" placeholder="尺寸" name='id' />
                                                </FloatingLabel>
                                            </Col>
                                            <Col xs={2} md={2}>
                                                <FloatingLabel controlId="floatingInputX2" label="Num" className="mb-1 ">
                                                    <Form.Control type="text" placeholder="Num" name='id' />
                                                </FloatingLabel>
                                            </Col>
                                            <Col xs={2} md={2}>
                                                單價 1
                                            </Col>
                                            <Col xs={2} md={2}>
                                                小計 2
                                            </Col>
                                        </Row>


                                        <Row>
                                            <Col xs={12} md={{ span: 3, offset: 9 }}>
                                                {/* <Button className="btn" variant="outline-secondary" name="Add">Add</Button> */}
                                                {/* <Button ref={this.target} onClick={() => this.setState({ show: !this.state.show })}>
                                                    Add
                                                </Button> */}
                                                {/* <Overlay target={this.target.current} show={this.state.show} placement="bottom">
                                                    {(props) => (
                                                        <Tooltip id="overlay-example" {...props}>
                                                            <a href="">半貴石</a>
                                                            <br></br>
                                                            <a href="">金具</a>
                                                        </Tooltip>
                                                    )}
                                                </Overlay> */}
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
                        </div>


                    </div>

                </div>
            </div>
        )
    }
}
