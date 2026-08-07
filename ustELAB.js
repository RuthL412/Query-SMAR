//db.m_ust_request_mims.find({status:"REJECTED",sku:"1636796091668",supplierName:/abb/i},{_id:0,status:1,jumlahProduksi:1,jumlahPengajuan:1,jumlahHasilUji:1,ustKe:1});
//
//db.m_product.find({jumlahProduksi:{$lte:-1}})
//
//db.m_product.aggregate({})
//
//db.m_product.aggregate([
//{$match:{jumlahProduksi:{$lte:-1}}},
//{$unwind:"$supplier"},
//{$project:{_id:1,Vendor:"$supplier.name",sku:"$skuId",jumlahProduksi:"$jumlahProduksi"}},
//{$sort:{Vendor:1}}
//]);


db.m_ust_request_elab.find({productId:"PLNMP1703144952170170"},{_id:0,productId:1,jumlahProduksi:1,jumlahPengajuan:1,jumlahHasilUji:1,_created:1,status:1,_updated:1});