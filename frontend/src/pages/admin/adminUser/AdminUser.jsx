import { useState, useEffect } from 'react'
import Form from 'react-bootstrap/Form'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import { DataGrid } from '@mui/x-data-grid';
import { AccountCircle, CheckCircleOutline, HighlightOff, Edit, Eject } from '@material-ui/icons';
import './adminUser.css'
import { ModalEditUser } from './modalEditUser/ModalEditUser';
import { postData, getData, getUserId } from "../../../api";
import Button from '../../../components/button/Button'
import { customAlert, customToastTopEnd } from '../../../components/customAlert/customAlert';


export default function AdminUser() {
    // let navigate = useNavigate();
    //declare
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [rePassword, setRePassword] = useState("");
    const [root, setRoot] = useState([
        { id: '01', name: '超級管理', value: 'admin', check: false },
        { id: '02', name: '網站管理', value: 'web', check: false },
        { id: '03', name: '文章管理', value: 'blog', check: false },
        { id: '04', name: '產品管理', value: 'product', check: false },
        { id: '05', name: '訂單管理', value: 'list', check: false },
        { id: '06', name: '管理主頁', value: 'manage', check: false }
    ]);
    const [wrapperOn, setWrapperOn] = useState(false);
    const [isLoadingSingUp, setIsLoadingSingUp] = useState(false);
    //user grid edit (popup modal)
    const [userListEditModalShow, setUserListEditModalShow] = useState(false); //popup modal
    const [userListEditData, setUserListEditData] = useState({}); //popup modal

    //root checkbox change event
    const changeCheckboxState = (index) => {
        let arrLists = root;
        arrLists[index].check = !arrLists[index].check;
        setRoot([...arrLists]);
    }

    // Sign Up event
    const signUp = async e => {
        e.preventDefault();
        // console.log(root);
        if (email === "" || username === "" || password === "") {
            alert("Email or Username or Password is not entered!");
        } else if (password !== rePassword) {
            alert("兩次密碼輸入不一致!");
        }
        else {
            setIsLoadingSingUp(!isLoadingSingUp);  //btn loading
            //process data
            const root_tmp = [];
            for (var ele in root) {
                if (root[ele].check) root_tmp.push(root[ele].value)
            }
            let _root = root_tmp.toString();
            let op_user = getUserId()?.email || 'user';

            const signUpData = await postData("/api/user/signup", { email, password, username, _root, op_user });
            if (signUpData.ack === 'OK') {
                customToastTopEnd.fire('OK!', 'Sign up success!', 'success');
                //reset input box
                resetSignupInput();
                //get all users info to update user's grid 
                getAllUsersInfo_();
            } else if (signUpData.ackDesc === 'Email_Is_Exist') {
                customToastTopEnd.fire('NO NO!', 'Email Is Exist', 'error');
            } else {
                customToastTopEnd.fire('NO NO!', 'Sign up fail', 'error');
            }
            setIsLoadingSingUp(!isLoadingSingUp); //btn loading
        }
    }

    //grid for all user info 
    const [userRows_, setUserRows_] = useState([]);
    useEffect(() => {
        getAllUsersInfo_();
    }, []);

    const getAllUsersInfo_ = () => {
        getData("/api/user/getAllUsers")
            .then((result) => {
                // console.log(result.data);
                var tmp = [];
                for (let i = 0; i < result.data.length; i++) {
                    var tmp_ = { ...result.data[i], id: (i + 1) }
                    tmp.push(tmp_)
                }
                setUserRows_(tmp)
            })
            .catch(() => console.log("err"));
    }

    //set users grid columns
    const columns = [
        { field: 'id', headerName: 'ID', flex: 1 },
        {
            field: 'displayname', headerName: 'User', flex: 1,
            renderCell: (params) => {
                return (
                    <div className="userListUser">
                        {/* {params.row.photourl !== null ?
                            <img className="userListImg" src={params.row.photourl} alt="" />
                            : <AccountCircle className="userListIcon" alt="" />
                        } */}
                        {/* TODO: 待補 user photo */}
                        <AccountCircle className="userListIcon" alt="" />
                        {params.row.displayname}
                    </div>
                )
            }
        },
        { field: 'email', headerName: 'Email', flex: 2 },
        {
            field: 'isenabled', headerName: 'Status', flex: 1,
            renderCell: (params) => {
                return (
                    <div className="userListEnable">
                        {params.row.isenabled === true ?
                            <CheckCircleOutline className="checkCircleOutline" alt="enable" />
                            : <HighlightOff className="highlightOff" alt="disable" />
                        }
                    </div>
                )
            }
        },
        { field: 'root', headerName: 'root', flex: 2, },
        {
            field: 'action', headerName: 'Action', flex: 1,
            renderCell: (params) => {
                const userListEditOpen = (data) => {
                    let data_ = JSON.parse(JSON.stringify(data));
                    // console.log(data_);
                    setUserListEditData(data_);
                    setUserListEditModalShow(true);
                }
                return (
                    <>
                        <Button variant="text" startIcon={<Edit />} themeColor='success' onClick={() => userListEditOpen(params.row)} />
                        {userListEditModalShow ?
                            <ModalEditUser show={userListEditModalShow} onHide={() => setUserListEditModalShow(false)}
                                editData={userListEditData} getAllUsersInfo={getAllUsersInfo_} /> : ''
                        }
                    </>
                )
            }
        },
    ];


    // reset Input box
    const resetSignupInput = () => {
        setEmail("");
        setUsername("");
        setPassword("");
        setRePassword("");
    }

    return (
        <div className="adminUser">
            <div className="adminUserWrapper">
                <div className="adminUserBody">
                    <a href="#" className="itemTitle" onClick={() => { setWrapperOn(!wrapperOn) }}>
                        成員新增
                        <Eject className={wrapperOn ? 'itemIconRotate active' : 'itemIconRotate noActive'} />
                    </a>
                    <div className={wrapperOn ? 'adminUserBodySignUpWrapper active neumorphismFlat' : 'adminUserBodySignUpWrapper'}>
                        <Form>
                            <div className="adminUserBodySignUpWrapperItem">
                                <div className="adminUserBodySignUpWrapperLeft">
                                    <div className="signUpItemTitle">基本資料</div>

                                    <Form.Group className="mb-1" controlId="formBasicEmail">
                                        <div className="row">
                                            <div className="adminUserBodySignUpItem col-md-5">
                                                <FloatingLabel controlId="floatingInputEmail" label="Email" className="mb-1 ">
                                                    <Form.Control type="email" placeholder="abc@xyz.com" value={email}
                                                        onChange={e => setEmail(e.target.value)} />
                                                </FloatingLabel>
                                            </div>
                                            <div className="adminUserBodySignUpItem col-md-5">
                                                <FloatingLabel controlId="floatingInputUsername" label="UserName" className="mb-1 ">
                                                    <Form.Control type="text" placeholder="UserName" value={username}
                                                        onChange={e => setUsername(e.target.value)} />
                                                </FloatingLabel>
                                            </div>
                                        </div>
                                    </Form.Group>
                                    <Form.Group className="mb-1" controlId="formBasicPassword">
                                        <div className="row">
                                            <div className="adminUserBodySignUpItem col-md-5 ">
                                                <FloatingLabel controlId="floatingPassword" label="Password" className="mb-3">
                                                    <Form.Control type="password" placeholder="Password" value={password}
                                                        onChange={e => setPassword(e.target.value)} />
                                                </FloatingLabel>
                                            </div>
                                            <div className="adminUserBodySignUpItem col-md-5 ">
                                                <FloatingLabel controlId="floatingRePassword" label="RePassword" className="mb-3">
                                                    <Form.Control type="password" placeholder="RePassword" value={rePassword}
                                                        onChange={e => setRePassword(e.target.value)} />
                                                </FloatingLabel>
                                            </div>
                                        </div>
                                    </Form.Group>
                                </div>
                                <div className="adminUserBodySignUpWrapperRight">
                                    <div className="adminUserBodySignUpItem">
                                        <div className="SignUpItemTitle">權限</div>
                                        {root.map((list, index) => (
                                            <div key={list.id}>
                                                <Form.Group className="mb-1" controlId="formBasicIsEnabled">
                                                    <Form.Check type="checkbox"
                                                        id={list.id}
                                                        checked={list.check}
                                                        onChange={changeCheckboxState.bind(this, index)}
                                                        key={list.id}
                                                        label={list.name} />
                                                </Form.Group>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="adminUserBodySignUpItem adminUserBodySignUpItemBtn">
                                <Button variant="contained" onClick={signUp} isLoading={isLoadingSingUp}>
                                    Sign Up
                                </Button>
                            </div>
                        </Form>
                    </div>
                </div>

                <div className="adminUserBody adminUserBodyGrid">
                    <DataGrid
                        rows={userRows_}
                        columns={columns}
                        pageSize={5}
                        rowsPerPageOptions={[5]}
                        disableSelectionOnClick
                    />
                </div>

            </div>
        </div>
    )
}
