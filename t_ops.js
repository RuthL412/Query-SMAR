db.t_operasional.find({"listData.nodo":{$in:[
"DO202500034564"
]}})

db.t_operasional_history.find({"listData.nodo":{$in:[
"DO202500034564"
]}})

db.t_operasional_history.find({})
db.t_operasional.deleteOne({"_id": "PB202500000077",})
//db.t_operasional.find({
//"listData.sku":"1636794828510",
//"listData.supplierId":"577ff483-7984-4ae8-94d3-14ec14a20ee8",
//})
//184,186+92,519
db.t_operasional.find({"tipeOperasional":"REVISI_QTY_KHS","listData.noKontrak": "1973.Pj/DAN.01.01/F01020000/2024",}).sort({_created:-1});
//
//db.t_operasional.find({tipeOperasional:'REVISI_STOK_PENYEDIA',"listData.sku":"1582014701685","listData.supplierId": "pt_travesindo_multi_elektrik",});
//184186+(-191252)
//db.t_operasional.distinct("tipeOperasional")
//
//db.t_operasional.find({"_id": "RSP202500000008",})
//
//db.t_operasional.updateOne({"_id": "RSP202500000008",},{$set:{"listData.0.stokRevisi": NumberInt("17067")}})
//"stokRevisi": NumberInt("17067")
//
//
//db.t_operasional.find({tipeOperasional:'REVISI_STOK_PENYEDIA'}).sort({_created:-1})
//
//db.t_delivery_order.find({"status":/PROCCESSED/i}).sort({_created:-1});
//
//db.t_purchase_order.find({status:/RECEIVED/i})
//
//db.m_kontrak_pengadaan.find({"materials.productId":"PLNMP1651117877943843"});
//
//db.m_kontrak_pengadaan.updateOne({"_id": NumberLong("1210"),
//    "kontrakParentId": NumberLong("279")},{$set:{"endDateKontrak": ISODate("2025-01-31T16:59:59.999Z"),status:"TIDAK_AKTIF"}});
//		
//		
//		db.t_operasional_history.find()
//
//
//db.collection.find(query)
//



db.t_operasional.find({tipeOperasional:'REVISI_STOK_PENYEDIA',"listData.sku":"1582009868781","listData.supplierId": "pt_symphos_electric","status": "SUCCESS",});

db.t_operasional.updateOne({"_id": "RSP202300000024"},{$set:{ "listData.5.stokRevisi": NumberInt("245"),"listData.0.stokRevisiBefore": NumberInt("0")}});

db.m_product.find({_id:"AIRBIZZ1583400603044344"})

db.m_kontrak_pengadaan.find({"materials.productName":""})