db.t_delivery_order.find({_id:"DO202300022349"})

db.m_product_sku.find({isKhs:true,status:"ACTIVE"},{status:1});


db.m_alokasi_kontrak.find({_id:"20240215-092228"})


db.m_alokasi_kontrak.find({"noSku":"1582014701685"})

db.m_new_alokasi_kontrak.find({"listSKU.noSku":"1582014701685"}).sort({_created:-1});

db.m_new_alokasi_kontrak.find({_id:"NA20240117-082744"}).sort({_created:-1});

db.m_product.find({skuId:"1582014701685", "status":"ACTIVE"})

db.m_product_sku.find({_id:"1582014352299"})

db.t_history_new_alokasi_kontrak.find({"noAlokasi": "NA20230707-221627","supplierName": /nurinda/i});