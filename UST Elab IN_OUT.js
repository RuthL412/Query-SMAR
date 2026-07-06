
// 
// db.sp_integration_in_out_log.find({name:/ust/i})
// 
// 
	db.sp_integration_in_out_log.find({
	"_created": {$gte:ISODate("2026-02-13T06:40:17.882Z"),},
	"req.nomorPengajuan": "20260213-1-185"}).sort({_created:-1}).limit(1);

db.sp_integration_in_out_log.find({"name": "POST http://10.1.81.182/api/elab/pengujian/ust-rutin/store-data",}).sort({_created:-1})

db.sp_integration_in_out_log.distinct("name")

db.m_ust_request_elab.find({noPengajuan:"20231125-3-193"})
db.m_ust_request_elab.find({noPengajuan:"20241029-12-3842"})
// 

db.getCollection("sp_integration_in_out_log").find({"name": {
    $regex:"web-integrasi-smar/pengajuannew"
}, 
//"success": true
}).sort({_created:-1})


db.m_setting_sla_mims_history.find({"categoryLv1Id": "biz063",})
db.m_setting_sla_mims.find({"_id": "biz063",})
db.m_setting_sla_mims.find({})