db.t_operasional_history.find({"listData.nodo":"DO202300022350"});

db.t_operasional.find({"tipeOperasional": "REVISI_STOK_PENYEDIA",}).sort({_created:-1})

db.t_operasional.aggregate([
{$match:{"tipeOperasional": "REVISI_STOK_PENYEDIA",}},
{$unwind:"$listData"},
{$group:{_id:{_id:"$listData.skuName"},stokRevisi:{$sum:"$listData.stokRevisi"}}},
{$project:{_id:0, sku:"$_id._id",stokRevisi:"$stokRevisi"}},
{$sort:{sku:1}}
])