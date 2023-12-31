import Header from "../Header/Header";
import "./ManageUserPermission.css";
import { Link } from 'react-router-dom';
import Select from "react-select";
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useSelector } from "react-redux";
import Toast from '../Toast/Toast';
import Footer from "../Footer/Footer";

export default function ManageUserPermission(){
    const user = useSelector((state) => state.auth.login?.currentUser);
    const noti = useRef();
    const noti1 = useRef();

    // 1.
    //Hàm call api lấy danh sách các đơn vị quản lý
    const [allManagementUnit, setAllManagementUnit] = useState([]); // state lấy ra all MU
    const getAllManagementUnit = async () => {
        try{
            const res = await axios.get("http://localhost:8000/v1/management_unit/get_all_management_unit");
            setAllManagementUnit(res.data);
            return res.data;
        }catch(error){
            console.log(error);
        }
    }

    //Gọi useEffect để lấy ra all MU
    useEffect(()=>{
        getAllManagementUnit();
    }, [])

    // 2.
    //gọi useEffect để tạo option khi allManagementUnit thay đổi
    const [optionAllManagementUnit, setOtionAllManagementUnit] = useState([]); //state này là option được tạo ra từ allManagementUnit dùng cho select có id = select-management-unit-MUP
    useEffect(()=>{
        let resultOption = [];
        allManagementUnit.forEach((currentValue) => {
            if(currentValue.management_unit_id != 13){
                const newOption = { 
                    value: currentValue.management_unit_id, 
                    label: currentValue.management_unit_name 
                };
                resultOption = [...resultOption, newOption];
            }
        })
        setOtionAllManagementUnit(resultOption);
    }, [allManagementUnit]);
    
    // 3.
    const [selectOptionMU, setSelectOtionMU] = useState() //state đại diện cho đơn vị quản lý được chọn của select có id = select-management-unit-MUP
    const [allDiplomaNameByMU, setAllDiplomaNameByMU] = useState([]); //state này đại diện cho các văn bằng thuộc đơn vị quản lý của tài khoản
    const handleChangeSelectOptionMU = (selectedOption) => {
        setSelectOtionMU(selectedOption);
    }

    //Hàm lấy ra các tên (loại văn bằng) được quản lý bởi đơn vị quản lý của tài khoản cán bộ
    const getAllDiplomaNameByMU = async (management_unit_id) => {
        try{
            const res = await axios.get(`http://localhost:8000/v1/diploma_name/get_all_diplomaNameByMU/${management_unit_id}`);
            setAllDiplomaNameByMU(res.data);
        }catch(error){
            console.log(error);
        }
    }

    //Gọi useEffect khi select có id = select-management-unit-MUP thay đổi thì set lại allDiplomaNameByMU
    // useEffect(()=>{
    //     if(selectOptionMU != undefined){
    //         getAllDiplomaNameByMU(selectOptionMU.value);
    //     }         
    // }, [selectOptionMU])

    // 4.
    // Hàm call api lấy ra all user có quyền Diploma importer của đơn vị quản lý được chọn trong select có id = select-management-unit-MUP
    const [allUserImporterByMU, setAllUserImporterByMU] = useState([]);//state này đại diện cho all user có quyền import của 1 MU
    const [allUserReviewerByMU, setAllUserReviewerByMU] = useState([]);//state đại diện cho all user có quyền review của 1 MU
    const [diplomaNameIdSelected, setDiplomaNameIdSelected] = useState();//state này đại diện cho diploma name id được chọn để phân quyền
    const [showUser, setShowUser] = useState(false); //state này để true thì show tài khoản, false thì không show

    //Hàm lấy all user có quyền duyệt của 1 đơn vị quản lý
    const getAllUserReviewByMU = async (management_unit_id) => {
        try{
            const res = await axios.get(`http://localhost:8000/v1/user_account/get_all_useraccount_review/${management_unit_id}`);
            setAllUserReviewerByMU(res.data);
        }catch(error){
            console.log(error);
        }
    }

    //Hàm lấy all user có quyền import của 1 đơn vị quản lý
    const getAllUserImportByMU = async (management_unit_id) => {
        try{
            const res = await axios.get(`http://localhost:8000/v1/user_account/get_all_useraccount_import/${management_unit_id}`);
            setAllUserImporterByMU(res.data);
        }catch(error){
            console.log(error);
        }
    }

    useEffect(()=>{
        if(selectOptionMU != undefined){
            getAllDiplomaNameByMU(selectOptionMU.value);
            getAllUserImportByMU(selectOptionMU.value);
            getAllUserReviewByMU(selectOptionMU.value);
        }  
        // if(selectOptionMU != undefined){
        //     getAllUserImportByMU(selectOptionMU.value);
        // }
        //Khi thay đổi đơn vị quản lý thì bỏ dòng tr màu xanh
        const currentElement = document.querySelector(".item-selected-MUP");
        if (currentElement) {
            currentElement.classList.remove("item-selected-MUP");
        }
        //và cho state là undefined
        setDiplomaNameIdSelected(undefined);
        setShowUser(false);
    }, [selectOptionMU]);

    //5. 
    //Nếu diplomaNameIdSelected thay đổi thì lấy ra danh sách các _id của các user có quyền nhập loại văn bằng được chọn bởi diplomaNameIdSelected
    //Tạo state để lưu các giá trị checkbox của tài khoản importer
    const [checkImport, setCheckImport] = useState([]);
    //Tạo state để lưu các giá trị checkbox của tài khoản reviewer
    const [checkReview, setCheckReview] = useState([]);

    function handleCheckImport(mssv_cb) {
        setCheckImport((prev) => {
          const exist = checkImport.includes(mssv_cb);
          if (exist) {
            return prev.filter((currentValue) => {
              return currentValue != mssv_cb;
            });
          } else {
            return [...prev, mssv_cb];
          }
        });
    }

    function handleCheckReview(mssv_cb){
        setCheckReview((prev) => {
            const exist = checkReview.includes(mssv_cb);
            if(exist){
                return prev.filter((currentValue) => {
                    return currentValue != mssv_cb;
                });    
            }else{
                return [...prev, mssv_cb];
            }
        });
    }

    //Hàm lấy danh sách mscb có quyền nhập 1 loại văn bằng
    const getListOfMSCB = async (diploma_name_id) => {
        try{
            const res = await axios.get(`http://localhost:8000/v1/user_account/get_list_mscb_import_by_diploma_name_id/${diploma_name_id}`);
            setCheckImport(res.data);
        }catch(error){
            console.log(error)
        }
    }

    //Hàm lấy danh sách mscb có quyền duyệt 1 loại văn bằng
    const getListOfMSCBReview = async (diploma_name_id) => {
        try{
            const res = await axios.get(`http://localhost:8000/v1/user_account/get_list_mscb_review_by_diploma_name_id/${diploma_name_id}`);
            setCheckReview(res.data);
        }catch(error){
            console.log(error);
        }
    }

    //Nếu diplomaNameIdSelected thì set lại checkImport  = [] và checkReview = [] và lấy danh sách các user có quyền nhập và duyệt tên(loại) văn bằng dc chọn ra và chạy setCheckImport setCheckReview
    useEffect(()=>{
        setCheckImport(prev => []);
        setCheckReview(prev => []);
        //
        if(diplomaNameIdSelected != undefined){
            getListOfMSCB(diplomaNameIdSelected);
            getListOfMSCBReview(diplomaNameIdSelected);
        }
    }, [diplomaNameIdSelected])

    // 6.Xử lý khi nhấn nút Lưu 
    const handleSubmit = async () => {
        // Tạo ra 1 danh sách các tài khoản không có dấu check và 1 danh sách các tài khoản có dấu check
        let userNotCheck = [];
        let userCheck = [];
        if(allUserImporterByMU != []){
            allUserImporterByMU.forEach((user)=>{
                if(checkImport.includes(user.mssv_cb)){
                    userCheck = [...userCheck, user];
                }else{
                    userNotCheck = [...userNotCheck, user];
                }
            })
        }
        // Lặp qua danh sách user check để thêm diploma_name_id được chọn vào trường listOfDiplomaNameImport cho từng user
        for(let i = 0; i < userCheck.length; i++){
            await handleAddDiplomaNameIntoUser(diplomaNameIdSelected, userCheck[i]._id, user.accessToken);
        }
        
        for(let j = 0; j < userNotCheck.length; j++){
            await handleDeleteDiplomaNameFromUser(diplomaNameIdSelected, userNotCheck[j]._id, user.accessToken);
        }
        noti.current.showToast();
        // console.log("User check: ", userCheck);
        // console.log("User not check: ", userNotCheck);
    };

    const handleAddDiplomaNameIntoUser = async (diploma_name_id, _id_user, accessToken) => {
        try{
            const res = await axios.put(`http://localhost:8000/v1/user_account/add_diploma_name_id_into_user/${diploma_name_id}/${_id_user}`, _id_user, {
                headers: {token: `Bearer ${accessToken}`}
            });
        }catch(error){
            console.log(error);
            noti1.current.showToast();
        }
    }

    const handleDeleteDiplomaNameFromUser = async (diploma_name_id, _id_user, accessToken) => {
        try{
            const res = await axios.put(`http://localhost:8000/v1/user_account/delete_diploma_name_id_from_user/${diploma_name_id}/${_id_user}`, _id_user, {
                headers: {token: `Bearer ${accessToken}`}
            });
        }catch(error){
            console.log(error);
            noti1.current.showToast();
        }
    }
    
    const handleAddDiplomaNameIntoUserReview = async (diploma_name_id, _id_user, accessToken) =>{
        try{
            const res = await axios.put(`http://localhost:8000/v1/user_account/add_diploma_name_id_into_user_review/${diploma_name_id}/${_id_user}`, _id_user, {
                headers: {token: `Bearer ${accessToken}`}
            });
        }catch(error){
            console.log(error);
            noti1.current.showToast();
        }
    }

    const handleDeleteDiplomaNameFromUerReview = async (diploma_name_id, _id_user, accessToken) => {
        try{
            const res = await axios.put(`http://localhost:8000/v1/user_account/delete_diploma_name_id_from_user_review/${diploma_name_id}/${_id_user}`, _id_user, {
                headers: {token: `Bearer ${accessToken}`}
            });
        }catch(error){
            console.log(error);
            noti1.current.showToast();
        }
    }

    const handleSubmitReview = async () => {
        // Tạo ra 1 danh sách các tài khoản không có dấu check và 1 danh sách các tài khoản có dấu check
        let userNotCheck = [];
        let userCheck = [];
        if(allUserReviewerByMU != []){
            allUserReviewerByMU.forEach((user)=>{
                if(checkReview.includes(user.mssv_cb)){
                    userCheck = [...userCheck, user];
                }else{
                    userNotCheck = [...userNotCheck, user];
                }
            })
        }
        // Lặp qua danh sách user check để thêm diploma_name_id được chọn vào trường listOfDiplomaNameImport cho từng user
        for(let i = 0; i < userCheck.length; i++){
            // await handleAddDiplomaNameIntoUser(diplomaNameIdSelected, userCheck[i]._id, user.accessToken);
            await handleAddDiplomaNameIntoUserReview(diplomaNameIdSelected, userCheck[i]._id, user.accessToken);
        }
        
        for(let j = 0; j < userNotCheck.length; j++){
            // await handleDeleteDiplomaNameFromUser(diplomaNameIdSelected, userNotCheck[j]._id, user.accessToken);
            await handleDeleteDiplomaNameFromUerReview(diplomaNameIdSelected, userNotCheck[j]._id, user.accessToken);
        }
        noti.current.showToast();
    }

    return(
        <>
            <Header/>
            <div className="container" id="body-MUP">
                <div style={{ backgroundColor: '#ffffff', padding: '10px' }}>
                    <div className="row">
                        <div className="col-md-3">
                            <div className="card">
                                <div className="card-header">
                                    <i className="fa-solid fa-sliders"></i>
                                </div>
                                <ul className="list-group list-group-flush">
                                    <Link style={{textDecoration: 'none'}} to='/user-account-management'>
                                        <li className="list-group-item">Thêm tài khoản</li>
                                    </Link>
                                    <li id='active-MUP' className="list-group-item">Phân quyền người dùng quản lý</li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-md-9">
                            <div className="card p-3">
                                <div>
                                    <Select
                                        id="select-management-unit-MUP"
                                        placeholder='Hãy chọn đơn vị quản lý muốn thực hiện phân quyền'
                                        options={optionAllManagementUnit}
                                        value={selectOptionMU}
                                        onChange={handleChangeSelectOptionMU}
                                    />
                                </div>
                                <div className="mt-4">
                                    Danh sách văn bằng được quản lý bởi <span style={{fontWeight: 'bold', color:"#0b619d"}}>{ selectOptionMU ? (selectOptionMU.label) : ""}</span> 
                                </div>
                                <div className="mt-2">
                                    <table 
                                        // className="table table-bordered"
                                        id="table-show-diplomaNameByMU"
                                        >
                                        <thead>
                                            <tr>
                                                <th style={{width: '50px'}}></th>
                                                <th style={{padding: '10px'}}>Tên văn bằng</th>
                                                <th style={{padding: '10px', width: '20%'}}>Quản lý từ ngày</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                allDiplomaNameByMU?.map((currentValue, index) => {
                                                    return(
                                                        <tr 
                                                            key={index}
                                                            onClick={(e) => {
                                                                //Đổi màu cho dòng tr được chọn
                                                                const currentElement = document.querySelector(".item-selected-MUP");
                                                                if (currentElement) {
                                                                    currentElement.classList.remove("item-selected-MUP");
                                                                }
                                                                e.target.parentNode.classList.add("item-selected-MUP");

                                                                // Lấy ra diploma_name_id của tên(loại) văn bằng được chọn
                                                                setDiplomaNameIdSelected(currentValue.diploma_name_id);
                                                                //set lại state show bằng true
                                                                setShowUser(true);
                                                            }}
                                                        >
                                                            <th scope="row" style={{textAlign: 'center'}}>{index + 1}</th>            
                                                            <td>{currentValue.diploma_name_name}</td>
                                                            <td>{currentValue.from}</td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Table chứa các tài khoản được nhập loại văn bằng được chọn */}
                    
                    {
                        showUser ? (
                            <>
                                    <div className="row p-3">
                                        <p 
                                            className="text-center mt-2" 
                                            style={{fontWeight: 'bold'}}
                                        >DANH SÁCH CÁC TÀI KHOẢN CÓ QUYỀN NHẬP </p>
                                        <table 
                                            className="table table-bordered">
                                            <thead>
                                                <tr>
                                                    <th style={{width: '5%'}}  scope="col"></th>
                                                    <th style={{width: '25%'}} scope="col">Tên cán bộ</th>
                                                    <th style={{width: '15%'}} scope="col">MSCB</th>
                                                    <th style={{width: '45%'}} scope="col">Email</th>
                                                    <th style={{width: '10%'}} scope="col">Phân quyền</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    allUserImporterByMU?.map((currentValue, index)=>{
                                                        return(
                                                            <tr key={index}>
                                                                <th style={{textAlign: 'center'}} scope="row">{index + 1}</th>
                                                                <td>{currentValue.fullname}</td>
                                                                <td>{currentValue.mssv_cb}</td>
                                                                <td>{currentValue.email}</td>
                                                                <td style={{textAlign: 'center'}}>
                                                                    <input 
                                                                        type="checkbox" 
                                                                        checked={checkImport.includes(currentValue.mssv_cb)}
                                                                        onChange={(e)=>{
                                                                            handleCheckImport(currentValue.mssv_cb);
                                                                        }}
                                                                    />
                                                                </td>
                                                            </tr>
                                                        )
                                                    })
                                                }
                                            </tbody>
                                        </table>
                                        <div className="d-flex justify-content-end">                            
                                            <button 
                                                style={{width: '80px', backgroundColor: '#1b95a2'}} 
                                                className="btn"
                                                onClick={(e)=>{
                                                    handleSubmit()
                                                }}
                                            >Lưu</button>
                                            <button 
                                                style={{width: '80px'}} 
                                                className="ms-3 btn btn-danger"
                                                onClick={(e)=>{
                                                    setShowUser(false);
                                                    setDiplomaNameIdSelected(undefined);
                                                    const currentElement = document.querySelector(".item-selected-MUP");
                                                    if (currentElement) {
                                                        currentElement.classList.remove("item-selected-MUP");
                                                    }
                                                }}
                                            >Hủy</button>
                                        </div>
                                    </div>

                                    <div className="row p-3">
                                        <p 
                                            className="text-center mt-2" 
                                            style={{fontWeight: 'bold'}}
                                        >DANH SÁCH CÁC TÀI KHOẢN CÓ QUYỀN DUYỆT </p>
                                        <table 
                                            className="table table-bordered">
                                            <thead>
                                                <tr>
                                                    <th style={{width: '5%'}} scope="col"></th>
                                                    <th style={{width: '25%'}} scope="col">Tên cán bộ</th>
                                                    <th style={{width: '15%'}} scope="col">MSCB</th>
                                                    <th style={{width: '45%'}} scope="col">Email</th>
                                                    <th style={{width: '10%'}} scope="col">Phân quyền</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    allUserReviewerByMU?.map((currentValue, index)=>{
                                                        return(
                                                            <tr
                                                                key={index}
                                                            >   
                                                                <th style={{textAlign: 'center'}} scope="row">{index+1}</th>
                                                                <td>{currentValue.fullname}</td>
                                                                <td>{currentValue.mssv_cb}</td>
                                                                <td>{currentValue.email}</td>
                                                                <td style={{textAlign: 'center'}}>
                                                                    <input 
                                                                        type="checkbox" 
                                                                        checked={checkReview.includes(currentValue.mssv_cb)}
                                                                        onChange={(e)=>{
                                                                            handleCheckReview(currentValue.mssv_cb);
                                                                        }}
                                                                    />
                                                                </td>
                                                            </tr>
                                                        )
                                                    })    
                                                }
                                            </tbody>
                                        </table>
                                        <div className="d-flex justify-content-end">
                                            <button
                                                className="btn"
                                                style={{width: '80px', backgroundColor: '#1b95a2'}} 
                                                onClick={(e)=>{
                                                    handleSubmitReview();
                                                }}
                                            >Lưu</button>
                                            <button
                                                className="ms-3 btn btn-danger"
                                                style={{width: '80px'}} 
                                                onClick={(e)=>{
                                                    setShowUser(false);
                                                    setDiplomaNameIdSelected(undefined);
                                                    const currentElement = document.querySelector(".item-selected-MUP");
                                                    if (currentElement) {
                                                        currentElement.classList.remove("item-selected-MUP");
                                                    }
                                                }}
                                            >Hủy</button>
                                        </div>
                                    </div>
                            </>
                        ) : (
                            ""
                        )
                    }
                </div>
            </div>
            <Toast
                message="Phân quyền người dùng thành công"
                type="success"
                ref={noti}
            />
            <Toast
                message="Có lỗi xảy ra khi phân quyền người dùng thành công"
                type="error"
                ref={noti1}
            />
            <Footer/>
        </>
    )
}