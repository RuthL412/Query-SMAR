	db.sp_integration_in_out_log.find({name:{$in:[
// 	"GET https://mims.pln.co.id/web-integrasi-smar/addTrxWorkerCreatePengirimanDo",
	"POST https://mims.pln.co.id/web-integrasi-smar/createPengirimanNoToken",
	//"POST https://mims.pln.co.id/web-integrasi-smar/cancelPenerimaanDo",
// 	"GET https://mims.pln.co.id/web-integrasi-smar/submitQtyDo",
	//    "POST https://mims.pln.co.id/web-integrasi-smar/cancelPenerimaanDo",
// 	    "POST https://mims.pln.co.id/web-integrasi-smar/checkNoPackaging",
// 			"POST https://mims.pln.co.id/web-integrasi-smar/createPo",
	//    "POST https://mims.pln.co.id/web-integrasi-smar/finishPenerimaanDo",
// 	    "POST https://mims.pln.co.id/web-integrasi-smar/getSerialNumberKomplain",
	//    "POST https://mims.pln.co.id/web-integrasi-smar/pengajuannew",
	//    "POST https://mims.pln.co.id/web-integrasi-smar/sendFileUstMims",
	//    "POST https://mims.pln.co.id/web-integrasi-smar/updatebankgaransi"
	]},
// 	"req.noPoSmar":{$in:[
// 	"PO202500009022",
// 	]}
//"errorMessage": "class java.util.concurrent.ExecutionException java.net.ConnectException: General SSLEngine problem",
	}).sort({_created:-1}).limit(10);

