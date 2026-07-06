db.t_purchase_order.find({"details.noAlokasi":{$in:[
"20240215-002638",
"20240215-092228",
"20240215-145641",
"20240215-150553",
"20240215-091636",
"20240215-150244"
]}},{"details.sku":1,"supplierName":1,"details.qty":1,status:1,_updated:1,qty:1});


db.t_purchase_order.find({"details.noAlokasi":"20240215-150244"},{"details.sku":1,"supplierName":1,"details.qty":1,status:1,qty:1,buyerName:1});


db.t_purchase_order.find({_id:"PO202400000662"});





db.m_new_alokasi_kontrak.find()



db.m_new_alokasi_kontrak_unit.find({noAlokasi:"NA20230310-181436",buyerName:"PLN KW UIW NTT",supplierName:"PT SINARINDO WIRANUSA ELEKTRIK" });

db.m_new_alokasi_kontrak_unit.find({noAlokasi:"NA20230310-181436",buyerName:"PLN KW UIW NTT"});





