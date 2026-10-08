db.sp_integration_in_out_log.count({
name:{$in:[

// "POST https://mims.pln.co.id/web-integrasi-smar/cancelPenerimaanDo",
// "POST https://mims.pln.co.id/web-integrasi-smar/backdatePenerimaanDo",
"POST https://mims.pln.co.id/web-integrasi-smar/finishPenerimaanDo",
// "GET https://mims.pln.co.id/web-integrasi-smar/submitQtyDo",
//"POST https://mims.pln.co.id/web-integrasi-smar/createPengirimanNoToken",
	

]},

_created:{$gte:ISODate("2026-07-23T09:12:06.556Z")},
// req:{$regex:"DO202600029941"}
}).sort({_created:-1}).limit(1);
