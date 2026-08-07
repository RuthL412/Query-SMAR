db.m_product.aggregate([
{$match:{"status": "ACTIVE",}},
{$unwind:"$supplier"},
{$group:{
_id:{
supplierId:"$supplier._id",
supplierName:"$supplier.name",
categoryLv1Name:"$categoryLv1Name",
}
}},
{$project:{
_id:0,
"Penyedia":"$_id.supplierName",
"Kategori":"$_id.categoryLv1Name"
}},
{$sort:{"Penyedia":1}}
])