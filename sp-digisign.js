
db.digi.find(query)

db.m_trx_digisign.find({noTrx:"DO202500000567","typeTrx": "TUG3Karantina",})
	db.sp_integration_in_out_log.find({"req.nomorPengajuan": "20250929-15-8600"}).sort({_created:-1}).limit(3);


db.sp_integration_in_out_log.distinct("name")
db.sp_integration_in_out_log.distinct("name",{name:/ust/i})
db.sp_integration_in_out_log.distinct("name",{name:{$nin:[/status/i]}})

db.sp_integration_in_out_log.find({
    name:{$in:[
//    "POST /o/digi-sign-open-api/upload-file",
//    "POST https://plnsign.id/api/auth/generate-token",
       "POST https://plnsign.id/api/doc-sign",
// 				"POST /o/digi-sign-open-api/upload-file",
//    "POST https://plnsign.id/api/auth/generate-token",
//    "POST https://plnsign.id/api/doc-sign",
//    "POST https://plnsign.id/api/doc-sign/status",
//    "POST https://plnsign.id/api/verify-pdf"
//				"POST https://plnsign.id/api/verify-pdf",
    //		 "POST https://amskorporat.pln.co.id/api/nde/documentbk/dynamic/",
//        "POST https://amskorporat.pln.co.id/api/nde/documentbk/upload_v2/F16110000/5462297/",
//        "POST https://amskorporat.pln.co.id/api/nde/documentbk/upload_v2/F16110000/5462301/",
//        "POST https://amskorporat.pln.co.id/api/nde/documentbk/upload_v2/F16110000/5462774/",
    ]},
//    "req": {
//        $in: [
//            /PO202600004738/i,
// //            
//        ]
//    }
// "req.noTrx":"PO202600004738" 
//"req.noTrx":"PO202500010257" 
//success:false
}).sort({
    _created:  - 1
}).limit(1);


db.sp_integration_in_out_log.find({name:/upload_v2/i}).sort({
    _created:  - 1
}).limit(1);
db.sp_integration_in_out_log.find({name:/amskorporat/i, }).sort({
    _created:  - 1
}).limit(100);

db.sp_integration_in_out_log.aggregate([{
$match:{name:/amskorporat/i }
},{$limit:10000}])