const DiplomaTypeModel = require("../models/DiplomaType");
const DiplomaNameModel = require("../models/DiplomaName");
const diplomaTypeControllers = {
    getAllDiplomaType: async (req, res) => {
        try{
            const allDiplomaType = await DiplomaTypeModel.find();
            return res.status(200).json(allDiplomaType);
        }catch(err){
            return res.status(500).json(err)
        }
    },
    addDiplomaType: async (req, res) => {
        try{
            const lastedDiplomaType = await DiplomaTypeModel.findOne({}, {}, { sort: { 'createdAt': -1 } });
            const allDiplomaType = await DiplomaTypeModel.find();
            let isFault = false;
            allDiplomaType.forEach((currentValue) => {
                if(currentValue.diploma_type_name == req.body.diploma_type_name){
                    isFault = true;
                }
            })

            if(isFault){
                return res.status(400).json("Loại văn bằng này đã tồn tại, hãy nhập tên mới");
            }

            const newDiplomaType = new DiplomaTypeModel({
                diploma_type_id: lastedDiplomaType.diploma_type_id+1,
                diploma_type_name: req.body.diploma_type_name
            });

            const diplomaTypeSaved = await newDiplomaType.save();
            return res.status(200).json(diplomaTypeSaved);
        }catch(error){
            return res.status(500).json(error);
        }
    },
    editDiplomaType: async (req, res) => {
        try{

            const allDiplomaType = await DiplomaTypeModel.find();
            let isFault = false;
            allDiplomaType.forEach((currentValue) => {
                if(currentValue.diploma_type_name == req.body.diploma_type_name){
                    isFault = true;
                }
            })

            if(isFault){
                return res.status(400).json("Loại văn bằng này đã tồn tại, hãy nhập tên mới");
            }
            
            const options = {returnDocument: "after"};
            const updateDoc = {
                diploma_type_name: req.body.diploma_type_name
            }
            const diplomaTypeUpdate = await DiplomaTypeModel.findByIdAndUpdate(req.params.id, updateDoc, options);
            return res.status(200).json(diplomaTypeUpdate);
        }catch(error){
            return res.status(500).json(error);
        }
    },
    searchDiplomaType: async (req, res) => {
        try{
            const keyword = req.query.keyword;
            const listOfDiplomaType = await DiplomaTypeModel.find({diploma_type_name:{ $regex: `${keyword}`, $options: 'i'}});
            return res.status(200).json(listOfDiplomaType);
        }catch(error){
            return res.status(500).json(error);
        }
    },
    deleteDiplomaType: async (req, res) => {
        try{
            //_id của diploma type cần xóa
            const _IdOfDiplomaType = req.params._id;
            //Lấy ra thông tin về diploma type cần xóa
            const currentDiplomaType = await DiplomaTypeModel.findById(_IdOfDiplomaType);

            //Lấy ra các document trong collection diplomanames,  nếu ko có document nào có diploma_type_id thì được xóa
            const allDiplomaNameByDiplomaTypeID = await DiplomaNameModel.find({diploma_type_id: currentDiplomaType.diploma_type_id});

            if(allDiplomaNameByDiplomaTypeID.length>0){
                return res.status(400).json("Đã có tên văn bằng thuộc loại này tồn tại, không thể xóa");
            }

            const deleteDiplomaType = await DiplomaTypeModel.findByIdAndDelete(_IdOfDiplomaType);

            return res.status(200).json(deleteDiplomaType);
        }catch(error){
            return res.status(500).json(error);
        }
    }
}

module.exports = diplomaTypeControllers;