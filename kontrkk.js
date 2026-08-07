db.m_kontrak_pengadaan.aggregate([
{$match:{noKontrak:"1174.PJ/DAN.01.01/F01020000/2023 - PT TT",latest:true}},
{$unwind:"$materials"},
{$group:{_id:{_id:"$_id",sku:"$materials.skuId"}}},
{$project:{_id:"$_id._id",sku:"$_id.sku"}}
]);

//CB