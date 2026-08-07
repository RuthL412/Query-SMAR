db.m_kontrak_pengadaan.aggregate([
  {
    $match: {
      noKontrak: {
        $in: [
"1990.PJ/DAN.01.01/F01020000/2023"
				]
      }
    }
  },
  {
    $unwind: {
      path: "$materials",
      includeArrayIndex: "indexDetail" // <= menambahkan indeks
    }
  },
  {
    $group: {
      _id: {
        noKontrak: "$_id",
        supplierName: "$supplierName",
        qtyKHS: "$materials.jumlahSuplai",
        skuId: "$materials.skuId",
        skuId: "$materials.skuId",
        noKontrak: "$noKontrak",
        index: "$indexDetail" // <= tambahkan indeks ke _id grup
      }
    }
  },
  {
    $project: {
      _id: 0,
      noKontrak: "$_id._id",
      supplierName: "$_id.supplierName",
      qtyKHS: "$_id.qtyKHS",
      skuId: "$_id.skuId",
      noKontrak: "$_id.noKontrak",
      index: "$_id.index" // <= tampilkan indeks
    }
  }, {$sort:{index:1}},
{$match:{skuId:{$in:[

]}}}
])