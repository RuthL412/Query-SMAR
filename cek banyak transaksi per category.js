//db.t_purchase_order.distinct("status")
//db.t_purchase_order.find({categoryName:"LIGHTNING ARRESTER TT"})

db.t_purchase_order.aggregate([
{$match:{status:{$in:
[
//    "APPROVED_GM",
//    "APPROVED_MSB",
//    "APPROVED_SRM",
    "APPROVED_SUPPLIER",
//    "CREATED",
//    "DRAFT",
    "FINISHED",
    "PROCESSED_BABG",
    "PROCESSED_SUPPLIER",
    "RECEIVED",
//    "REJECTED_GM",
//    "REJECTED_MSB",
//    "REJECTED_REGULATOR",
//    "REJECTED_SRM",
//    "REJECTED_SUPPLIER",
//    "REJECTED_SYS_INTERNAL",
//    "REJECTED_SYS_POSEND",
//    "REJECTED_SYS_SUPPLIER_BABG",
//    "REJECTED_SYS_SUPPLIER_CONFIRM",
    "REQUESTED",
//    "REQUESTED_DIGISIGN_GM",
    "REQUESTED_DIGISIGN_SUPPLIER"
]

}}},
{$group:{
_id:"$categoryName",
jumlahPO:{$sum:1}
}},
{$sort:{jumlahPO:-1}}
])