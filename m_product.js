

// db.m_product.find()
// 
// 	db.m_product.find({"skuId":"1636778435904","supplier._id":"pt_bambang_djaja"},{stock:-1});
	
	db.m_product.find({"skuId":"1636795865468","supplier._id":/e74e3845-95fb-4e8b-bfc9-5bc64a8fc93f/i});
	
	db.m_product.find({"skuId":"1636795865468","supplier._id":/e74e3845-95fb-4e8b-bfc9-5bc64a8fc93f/i});

// db.t_historikal_stok_produk.find({"sku":"1636795066451","supplierName":/edmi/i}).sort({_created:-1});

db.m_product.find({"skuId":"1582014656427","noAlokasi":"20240215-002638"},{"stockAlokasi":1,"supplier.name":1,stockSiapPesan:1});


db.m_product.updateOne({_id:"xxxxx"}, {$set:{"stockAlokasi": NumberLong("xx")}});