
db.sp_integration_in_out_log.find({
 "name": "POST http://erpapprv.pusat.corp.pln.co.id:8001/api/mp/ifpo?sap-client=100&saml2=disabled",
_created:{$gte:ISODate("2025-02-04T08:11:28.781Z")},
"req.0.no_pengadaan":"PO202500000363"
}).sort({_created:1}).limit(1)

db.sp_integration_in_out_log.find({"req.0.no_pengadaan":{$exists:true},"success": false,}).sort({_created:-1}).limit(1)

db.sp_integration_in_out_log.find({name:{$in:["POST http://erpapprv.pusat.corp.pln.co.id:8001/api/mp/ifpo?sap-client=100&saml2=disabled","POST http://erpapprv.pusat.corp.pln.co.id:8001/api/mp/ifgr?sap-client=100"]}},{success:1,_created:1,name:1,res:1}).sort({_created:-1}).limit(100)



db.sap_outline_agreement.find({agreementNo:"4500186886"})

db.t_delivery_order.find({"detail.noGrSAP":"5007923685"})

db.sap_plant_material.find().sort({_created:-1}).limit(100)


db.t_purchase_order.find({_id:"PO202500000829"})




db.sp_integration_in_out_log.find().limit(1)


db.sp_integration_in_out_log.aggregate([
{$match:{"req.0.no_pengadaan":{$exists:true},"success": false}},
{$unwind:"$req"},
{$group:{_id:{_id:"$req.no_pengadaan"},total: {
                            $sum: 1
                        },}},
												{$project:{_id:"$_id._id",total:"$total"}},
])



db.sp_integration_in_out_log.aggregate([
{$match:{"req.no_pengadaan":{$in:["PO202500000734","PO202500000735","PO202500000769","PO202500000770","PO202500000771","PO202500000780","PO202500000781","PO202500000786","PO202500000788","PO202500000789","PO202500000124","PO202500000128","PO202500000154","PO202500000095","PO202500000097","PO202500000101","PO202500000389","PO202500000287","PO202500000288","PO202500000144","PO202500000185","PO202500000180","PO202500000112","PO202500000182","PO202500000127","PO202500000079","PO202500000174","PO202500000187","PO202500000129","PO202500000080"]}}},
{$unwind:"$req"},
{$project:{
_id:"$req.no_pengadaan",
success:"$success",
errorMessage:"$errorMessage",

}}
])