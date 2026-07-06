db.log_general.aggregate([
{$match:{name:"EDIT_JUMLAH_PRODUKSI_ACTION","details.request.produkId":"AIRBIZZ1583920382809409"}},
{$unwind:"$details"},
{$project:{_id:"$details.request.produkId",jumlahProduksi:"$details.request.jumlahProduksi", tanggal:"$_created"}},
//{$sort:{Vendor:1}}
]);