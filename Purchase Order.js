// 
// db.t_purchase_order.find({_id:{$in:[
// "PO202300006512",
// "PO202300006287",
// "PO202300005800",
// "PO202300005799"]}},{"purchaseOrderLogList":1});

// db.t_purchase_order.find({"details.sku":{$in:["1582014732336"]},"status":{$in:[/appro/i,/created/i]}},{supplierName:1,"details.sku":1,qty:1, status:1})

db.t_purchase_order.find({"details.noAlokasi":"20240215-002638", supplierName:"PT SYMPHOS ELECTRIC"},{"details.sku":1,"supplierName":1,"details.qty":1,status:1,_updated:1,qty:1});


db.t_purchase_order.find({"details.noAlokasi":"20240215-002638", supplierName:"PT PANEL MULIA TOTAL"},{"details.sku":1,"supplierName":1,"details.qty":1,status:1,_updated:1,qty:1,"details.noAlokasi":1});


db.t_purchase_order.find({"details.noAlokasi":"20240215-002638", supplierName:"PT TRITUNGGAL SWARNA"},{"details.sku":1,"supplierName":1,"details.qty":1,status:1,_updated:1,qty:1});








db.t_purchase_order.find({"details.purchaseOrderLogList.2._created":{$lte:ISODate("2024-02-19T00:00:00.599Z")}})
PO202400000543
PO202400000542
PO202400000540
PO202400000511



db.t_purchase_order.find({"digiSignStatus": {$exists:true},"digiSign": {$exists:false}, _id:/PO2024/i}).sort({_created:-1});

db.t_purchase_order.find({_id:"PO202400000543"}).sort({_created:-1});

db.t_purchase_order.find({"details.noAlokasi":"20240215-150553"});


db.m_setting_sla_digisign.find()