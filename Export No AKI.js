db.t_purchase_order.find({"isBabg": true,status:"FINISHED"}).sort({_created:-1})

db.log_general.find({"details.actor.id":""}).sort({_created:-1})

db.t_purchase_order.count({buyerName:/jawa timur/i,createdDate:{$gt:ISODate("2021-01-01T00:00:00.153Z")}},{}).sort({_id:1});

db.t_purchase_order.aggregate([
{$match:{supplierName:"PT TRITUNGGAL SWARNA","details.noAlokasi":"NA20230707-203734",status:{$in:["REQUESTED", "APPROVED_SUPPLIER", "PROCESSED_BABG", "PROCESSED_SUPPLIER", "RECEIVED", "FINISHED"]}}},
{$unwind:"$details"},
{$group:{_id:{_id:"$_id",sku:"$details.sku",buyerName:"$buyerName",status:"$status"},qty:{$sum:"$details.qty"}}},
{$group:{_id:{jmbt:"$_id.sku"},qty2:{$sum:"$qty"}}},
{$project:{_id:0,skuu:"$_id.jmbt",qty3:"$qty2"}},
//{$project:{_id:"$_id._id",sku:"$_id.sku",buyerName:"$_id.buyerName",qty:"$qty",status:"$_id.status"}},
{$sort:{skuu:1}}
]);

//db.t_purchase_order.find({"details.noAlokasi":"NA20230707-203734",status:{$not:{$in:[/reject/i]}},"details":{$elemMatch:{sku:"1582014352299"}}})