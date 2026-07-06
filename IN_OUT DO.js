db.sp_integration_in_out_log.find({"req.0.ref_doc_no": /2025000368070200/i}).sort({_created:-1}).limit(1)

db.sp_integration_in_out_log.find({ "name": "POST http://erpapprv.pusat.corp.pln.co.id:8001/api/mp/ifgr?sap-client=100","req.0.ref_doc_no":{$in:[
"2025000337160600",
]}}).sort({_created:-1}).limit(1)

db.sp_integration_in_out_log.find({"req.0.ref_doc_no": "2025000157270100"}).sort({_created:-1}).limit(1)
db.sp_integration_in_out_log.find({"req.0.ref_doc_no": {$exists:true}},{res:1,_id:0}).sort({_created:-1}).limit(1000)


db.sp_integration_in_out_log.find({"req.0.gm_item.po_number": "8000005885"}).sort({_created:-1})


db.sp_integration_in_out_log.find({"req.0.ref_doc_no": {$exists:true}}).sort({_created:-1})

db.sp_integration_in_out_log.find({"success": true,"req.0.ref_doc_no":{$exists:true}}).sort({_created:-1})

db.sp_integration_in_out_log.find({name:"POST http://erpapprv.pusat.corp.pln.co.id:8000/api/mp/ifgr?sap-client=100"}).sort({_created:-1})





db.sp_integration_in_out_log.aggregate([
{$match:{"req.0.ref_doc_no":{$exists:true},"success": false}},
{$unwind:"$req"},
{$group:{_id:{_id:"$req.ref_doc_no"},total: {
                            $sum: 1
                        },}},
												{$project:{_id:"$_id._id",total:"$total"}},
])


db.t_delivery_order.find({_id:"DO202400009434"})