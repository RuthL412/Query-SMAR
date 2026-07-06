db.m_new_alokasi_kontrak_unit.find({noAlokasi:"NA20230707-221627",buyerName:"PLN UID Banten",supplierName:"PT NURINDA"});
db.m_new_alokasi_kontrak_unit.find({noAlokasi:"NA20230707-221627",buyerName:"PLN UID Bali",supplierName:"PT ELECTRA INTI PERKASA"});
db.m_new_alokasi_kontrak_unit.find({noAlokasi:"NA20230707-221627",buyerName:"PLN UID Bali",supplierName:"PT PANEL MULIA TOTAL"});
db.m_new_alokasi_kontrak_unit.find({noAlokasi:"NA20230707-221627",buyerName:"PLN UID Sumatera Barat",supplierName:"PT TRAVESINDO MULTI ELEKTRIK"});



db.m_new_alokasi_kontrak_unit.updateOne({noAlokasi:"NA20230707-221757",buyerName:"PLN UID Banten",supplierName:"PT SYMPHOS ELECTRIC"},{$set:{quota:,reservedQuota:,availableQuota:,realisasi:,sumQuota:,persentaseSerap:}});



db.t_purchase_order.find({"details.noAlokasi":{$in:["20240215-002638"]}});

db.t_purchase_order.update({"details.noAlokasi":{$in:["20240215-002638"]}},{$set:{"details.noAlokasi":"20240215-002638"}});




db.m_new_alokasi_kontrak_unit.find({noAlokasi:"NA20230707-221757",supplierName: "PT PANEL MULIA TOTAL"},{quota:1});

