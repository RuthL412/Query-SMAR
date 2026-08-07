db.m_kontrak_pengadaan.aggregate([
{$match:{status:{$in:["AKTIF","AKTIF_AMD"]},first:true}},
{$unwind:"$materials"},
{$group:{
_id:{
noKontrak:"$noKontrak",
supplierName:"$supplierName",
startDateKontrak:"$startDateKontrak",
endDateKontrak:"$endDateKontrak",
status:"$status",
skuId:"$materials.skuId",
skuName:"$materials.skuName",
price:"$materials.contractPrice",
jumlahSuplai:"$materials.jumlahSuplai",
}
}},
{$project:{
_id:0,
"Nomor Kontrak":"$_id.noKontrak",
"Vendor":"$_id.supplierName",
"start date kontrak":"$_id.startDateKontrak",
"end Date Kontrak":"$_id.endDateKontrak",
status:"$_id.status",
skuId:"$_id.skuId",
skuName:"$_id.skuName",
price:"$_id.price",
"Volume KHS":"$_id.jumlahSuplai",
}},
{$sort:{"Nomo Kontrak":1}}
])

//db.m_kontrak_pengadaan.find()