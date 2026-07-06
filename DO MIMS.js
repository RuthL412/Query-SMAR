db.sp_integration_in_out_log.find({
_created:{$gte:ISODate("2026-02-25T02:33:55.943Z")},
name:{$in:[

"POST https://mims.pln.co.id/web-integrasi-smar/cancelPenerimaanDo",
"POST https://mims.pln.co.id/web-integrasi-smar/backdatePenerimaanDo",
"POST https://mims.pln.co.id/web-integrasi-smar/finishPenerimaanDo",
"GET https://mims.pln.co.id/web-integrasi-smar/submitQtyDo",
//"POST https://mims.pln.co.id/web-integrasi-smar/createPengirimanNoToken",
	

]},
req:{$regex:"DO202600006468"}
}).sort({_created:-1}).limit(1);

db.sp_integration_in_out_log.distinct("name",{name:{$regex:"/web-integrasi-smar/createPengirimanNoToken"}})

db.t_delivery_order.find({"detail.jumlahPackaging":{$gte:1},"detail.listDoBarcode.noSerial":{$exists:false}}).sort({_created:-1})
db.sys_auth_user.find({_id:"ondy.tulus.p"})