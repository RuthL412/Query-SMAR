//db.log_general.find({name:"EDIT_JUMLAH_PRODUKSI_ACTION","details.request.produkId":"PLNMP1703144952170170"})


db.log_general.aggregate([
{$match:{name:"EDIT_JUMLAH_PRODUKSI_ACTION","details.request.produkId":"PLNMP171586993148989"}},
{$unwind:"$details"},
//{$project:{_id:"$details.request.produkId",jumlahProduksi:"$details.request.jumlahProduksi", tanggal:"$_created"}},
//{$sort:{Vendor:1}}
]);

//db.log_general.find({"details.reqData.skuId":"1702630938822","details.reqData.supplier":"d9810e85-07fc-45f3-b469-798da12084db"})
//
//db.log_general.find({name:"ADD_PRODUCT"})


db.log_general.distinct("name")
db.sp_integration_in_out_log.distinct("name")


db.log_general.find({name:"DELETE_DRAFT_DO"}).sort({_created:-1}).limit(1)
db.log_general.find({name:"DELETE_DRAFT_DO","details.reqData":{$in:["DRAFT-DO202600024418"]}}).sort({_created:-1}).limit(1)
db.log_general.find({name:"SUBMIT_DO","details.reqData.noSuratJalan":{$in:["N126000692"]}}).sort({_created:-1}).limit(1)


db.log_general.find({name:{$in:[
"REGISTER_COMPANY_SELLER",
"UPDATE_COMPANY_SELLER"
]},"details.reqData.companyName":"PT Alum Central Mandiri Lestari"})


db.log_general.find({name:"SCHEDULER_REJECT_BY_INTERNAL","details.dataPo._id":"PO202400008988"}).sort({_created:-1})
db.log_general.find({name:"UPDATE_PRODUCT","details.id":"PLNMP1703128183975775"}).sort({_created:-1})
db.log_general.find({"details.reqData.listNopo":"PO202400008322"}).sort({_created:-1})


db.log_general.find({
name:{$in:[ "ADD_DRAFT_DO",]},
//"details.reqData":/DRAFT-D0202500002851/i
"details.reqData.poId":"PO202500000945"
}).sort({_created:-1})


db.sys_scheduler.find({"data.nopo":"PO202400008650"})

db.sys_scheduler.updateOne({"data.nopo":"PO202400008650"},{$set:{"runAt": ISODate("2025-01-17T09:24:32.908Z"),}})
