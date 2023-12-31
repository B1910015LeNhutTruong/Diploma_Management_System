//Quản lý danh mục loại văn bằng
import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';

import './DiplomaType.css';
import Header from '../Header/Header';
import {getAllDiplomaType, addDiplomaType, editDiplomaType, searchDiplomaType, deleteDiplomaType} from '../../redux/apiRequest';
import { useDispatch, useSelector } from 'react-redux';
import Toast from '../Toast/Toast';
import Footer from '../Footer/Footer';
export default function DiplomaType(){
    const dispatch = useDispatch();
    const allDiplomaType = useSelector((state) => state.diplomaType.diplomaTypes?.allDiplomaType);
    const [diplomaName, setDiplomaName] = useState(''); //state đại diện cho input để thêm loại văn bằng mới
    const [diplomaNameEdit, setDiplomaNameEdit] = useState(''); //state đại diện cho input để chỉnh sửa loại văn bằng
    const [_iddiplomaNameEdit, set_IddiplomaNameEdit] = useState(''); //state đại diện cho _id để cập nhật

    const [inputSearch, setInputSearch] = useState(''); //state đại diện để tìm kiếm tên của loại văn bằng

    const user = useSelector((state) => state.auth.login?.currentUser);
    const msg = useSelector((state) => state.diplomaType?.msg);
    const noti = useRef();
    const isError = useSelector((state) => state.diplomaType.diplomaTypes?.error);

    //Gọi useEffect để lấy tất cả Diploma type
    // useEffect(()=>{
    //     getAllDiplomaType(dispatch);
    // }, []);

    //Gọi useEffect để tìm kiếm tên văn bằng
    useEffect(()=>{
        searchDiplomaType(dispatch, inputSearch);
    }, [inputSearch]);

    //Hàm submit thêm loại văn bằng 
    const handleSubmit = async (e) => {
        e.preventDefault();
        const newDiploma = {
            diploma_type_name: diplomaName
        }
        
        await addDiplomaType(newDiploma , dispatch, user.accessToken);
        noti.current.showToast();
        // await getAllDiplomaType(dispatch);
        setTimeout(async () => {
            await searchDiplomaType(dispatch, inputSearch);
        }, 200);
    }
    
    //Hàm submit để edit thông tin loại văn bằng
    const handleSubmitEdit = async (e) => {
        e.preventDefault();
        await editDiplomaType({
            diploma_type_name: diplomaNameEdit
        }, dispatch, user.accessToken, _iddiplomaNameEdit);
        noti.current.showToast();
        // await getAllDiplomaType(dispatch);
        setTimeout(async () => {
            await searchDiplomaType(dispatch, inputSearch);
        }, 200);
    }

    //Hàm xóa diploma Type
    const noti2 = useRef();
    const msgDelete = useSelector((state) => state.diplomaType?.msgDelete);
    const isErrorDelete = useSelector((state) => state.diplomaType.diplomaTypes?.error);

    const handleDeleteDiplomaType = async (_id) => {
        await deleteDiplomaType(dispatch, user.accessToken, _id);
        noti2.current.showToast();
        setTimeout(async() => {
            await searchDiplomaType(dispatch, inputSearch);
        }, 200);
    }

    return(
        <>
            <Header/>
            <div className="container" id='body-diplomatype'>
                <div style={{ backgroundColor: '#ffffff', padding: '10px' }}>
                    <div className="row">
                        <div className="col-md-3">
                            <div className="card">
                                <div className="card-header">
                                    <i className="fa-solid fa-sliders"></i>
                                </div>
                                <ul className="list-group list-group-flush">
                                    <li id='active-diplomatype' className="list-group-item">Danh mục loại văn bằng</li>
                                    <Link style={{textDecoration: 'none'}} to='/decentralize-diploma-management'><li className="list-group-item">Phân quyền quản lý văn bằng</li></Link>
                                    <Link style={{textDecoration: 'none'}} to='/diploma-name'><li className="list-group-item">Danh mục tên văn bằng</li></Link>
                                    <Link style={{textDecoration: 'none'}} to='/diploma-name-management-history'>
                                        <li className="list-group-item">Lịch sử quản lý tên văn bằng</li>
                                    </Link>
                                </ul>
                            </div>
                        </div>
                        <div className="col-md-9">
                            <div className="card p-3">
                                <div>
                                    <button type='button' id='add-diploma-type' data-bs-toggle="modal" data-bs-target="#modalAddDiplomaType"><i className="fa-sharp fa-solid fa-plus"></i> Thêm</button>
                                </div>

                                <div className="row mt-3">
                                    <div className="col-4">
                                    <input 
                                        type="text" 
                                        value={inputSearch}
                                        onChange={(e) => {
                                            setInputSearch(e.target.value);
                                        }}
                                        className='form-control'
                                        placeholder='Nhập tên loại văn bằng muốn tìm kiếm'
                                        />
                                    </div>
                                </div>
                                <div>
                                    <table style={{border: '2px solid #fed25c'}} className='table table-striped table-hover table-bordered mt-3'>
                                        <thead>
                                            <tr style={{textAlign: 'center'}}>
                                                <th scope="col" style={{ backgroundColor: '#fed25c',width: '80px'}}>STT</th>
                                                <th scope="col" style={{ backgroundColor: '#fed25c'}}>Tên loại văn bằng</th>
                                                <th scope="col" style={{ backgroundColor: '#fed25c',width: '100px'}}>Sửa</th>
                                                <th scope="col" style={{ backgroundColor: '#fed25c',width: '100px'}}>Xóa</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                                {
                                                    allDiplomaType?.map((currentValue, index) => {
                                                        return(
                                                            <tr key={index}>
                                                                <th scope="row" style={{textAlign: 'center'}}>{index + 1}</th>
                                                                <td>{currentValue.diploma_type_name}</td>
                                                                <td style={{textAlign: 'center'}}>
                                                                    <i onClick={(e) => {
                                                                        set_IddiplomaNameEdit(currentValue._id);
                                                                        setDiplomaNameEdit(currentValue.diploma_type_name);
                                                                    }} 
                                                                        type='button' 
                                                                        data-bs-toggle="modal" 
                                                                        data-bs-target="#modalEditDiplomaType" 
                                                                        className="fa-solid fa-eye"
                                                                        style={{backgroundColor: "#1b95a2", padding: '7px', borderRadius: '5px', color: 'white'}}
                                                                    >
                                                                    </i>
                                                                </td>
                                                                <td style={{textAlign: 'center'}}>
                                                                    <button
                                                                        className='btn'
                                                                        style={{backgroundColor:'red', width:'32px', height: '30px'}}
                                                                        onClick={(e)=>{
                                                                            handleDeleteDiplomaType(currentValue._id)
                                                                        }}
                                                                    >
                                                                        <i
                                                                            className="fa-solid fa-trash text-center d-block"
                                                                            style={{marginLeft: '-4px', color: 'white'}}
                                                                        ></i></button>
                                                                </td>
                                                            </tr>
                                                        )
                                                    })   
                                                } 
                                        </tbody>
                                    </table>
                                </div>
                                {/* Phần modal để chỉnh sửa thông tin loại văn bằng */}
                                <div className="modal fade" id="modalEditDiplomaType" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="modalEditDiplomaTypeLabel" aria-hidden="true">
                                    <div className="modal-dialog modal-dialog-centered">
                                        <div className="modal-content">
                                        <div className="modal-header" style={{backgroundColor: '#feefbf'}}>
                                            <h1 className="modal-title fs-5" id="modalEditDiplomaTypeLabel">Chỉnh sửa loại văn bằng</h1>
                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <div className="modal-body">
                                            <form 
                                                id='form-edit-diplomatype'
                                                onSubmit={(e)=>{
                                                    handleSubmitEdit(e);
                                                }}>
                                                <div className="row">
                                                    <div className='col-2'>
                                                        <label
                                                            htmlFor='input-edit-diplomatype-diplomatype'
                                                            className='col-form-label text-end d-block'
                                                            style={{ fontSize: '12px', fontStyle: 'italic' }}
                                                        >
                                                            Tên loại văn bằng
                                                        </label>
                                                    </div>
                                                    <div className='col-10'>
                                                        <input
                                                            id='input-edit-diplomatype-diplomatype'
                                                            type='text'
                                                            className='form-control'
                                                            value={diplomaNameEdit}
                                                            onChange={(e) => {
                                                                setDiplomaNameEdit(e.target.value);
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                                            <button 
                                                type="submit"
                                                form='form-edit-diplomatype' 
                                                className="btn"
                                                style={{backgroundColor: '#1b95a2'}}
                                            >Lưu</button>
                                        </div>
                                        </div>
                                    </div>
                                </div>




                                <div className="modal fade" id="modalAddDiplomaType" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="modalAddDiplomaTypeLabel" aria-hidden="true">
                                    <div className="modal-dialog modal-dialog-centered">
                                        <div className="modal-content">
                                        <div className="modal-header" style={{backgroundColor: '#feefbf'}}>
                                            <h1 className="modal-title fs-5" id="modalAddDiplomaTypeLabel">Thêm mới loại văn bằng</h1>
                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <div className="modal-body">
                                            <form 
                                                id='form-add-diplomatype'
                                                onSubmit={(e)=>{
                                                    handleSubmit(e);
                                                }}>
                                                <div className="row">
                                                    <div className='col-2'>
                                                        <label
                                                            htmlFor='input-add-diplomatype-diplomatype'
                                                            className='col-form-label text-end d-block'
                                                            style={{ fontSize: '12px', fontStyle: 'italic' }}
                                                        >
                                                            Tên loại văn bằng
                                                        </label>
                                                    </div>
                                                    <div className='col-10'>
                                                        <input
                                                            id='input-add-diplomatype-diplomatype'
                                                            type='text'
                                                            className='form-control'
                                                            value={diplomaName}
                                                            onChange={(e) => {
                                                                setDiplomaName(e.target.value)
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                                            <button 
                                                type="submit"
                                                form='form-add-diplomatype' 
                                                className="btn"
                                                style={{backgroundColor: '#1b95a2'}}
                                            >Thêm</button>
                                        </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>  
                </div>
            </div>
            <Toast
                message={msg}
                type={isError ? "error" : "success"}
                ref={noti}
            />
            <Toast
                message={msgDelete}
                type={isErrorDelete ? "error" : "success"}
                ref={noti2}
            />
            <Footer/>
        </>
    )
}
