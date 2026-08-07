db.t_purchase_order.find({_id:"PO202500006004"})
db.t_purchase_order.distinct("status")

db.m_trx_digisign.find({noTrx:"PO202500006004"})


db.t_delivery_order.find({_id:"DO202500014451"})

db.sap_outline_agreement.find({agreementNo:"4500187778"})

db.sp_integration_in_out_log.find({
 "name": "POST https://plnsign.id/api/doc-sign/status",
//     "POST https://plnsign.id/api/doc-sign",
    "io": "OUT",
		req: { $regex: "\"noTrx\":\"DO202500019316\"" }
}).sort({_created:-1}).limit(3);

db.sp_integration_in_out_log.find({
 "name": "POST https://plnsign.id/api/doc-sign",
    "io": "OUT",
		 $and: [
    { req: { $regex: "\"noTrx\"\\s*:\\s*\"PO202500010445\"" } },
    { req: { $regex: "\"typeTrx\"\\s*:\\s*\"PO\"" } }
  ]
//		req: /PO202500004512/i,
}).sort({_created:-1}).limit(1);

db.sp_integration_in_out_log.find({
 "name": "POST https://plnsign.id/api/doc-sign",
    "io": "OUT",
		 $and: [
    { req: { $regex: "MEQNoVVBMQTbH8K9" } },
//    { req: { $regex: "\"typeTrx\"\\s*:\\s*\"TUG3Persediaan\"" } }
  ]
//		req: /PO202500004512/i,
}).sort({_created:-1}).limit(1);


db.sp_integration_in_out_log.find({"_id": ObjectId("688ffd873dfe575b9e141b6d")})

TUG3Karantina
TUG4
TUG3Persediaan
PO