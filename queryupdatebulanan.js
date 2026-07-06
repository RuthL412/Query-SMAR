db.t_purchase_order.aggregate([
  {
    $match: {
//      "details.noAlokasi": /NAB/i,
//      status: { $not: /reject/i }
//_id:"PO202500002709"
    }
  },
  {
    $unwind: "$details"
  },
  {
    $group: {
      _id: {
        supplierId: "$supplierId",
        supplierName: "$supplierName",
        buyerId: "$buyerId",
        buyerName: "$buyerName",
        noAlokasi: "$details.noAlokasi"
      },
      qty: { $sum: "$details.qty" }
    }
  },
  {
    $lookup: {
      from: "m_new_alokasi_bulanan_kontrak_unit",
      let: {
        alokasi: "$_id.noAlokasi",
        supplier: "$_id.supplierId",
        buyer: "$_id.buyerId"
      },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ["$noAlokasi", "$$alokasi"] },
                { $eq: ["$buyerId", "$$buyer"] },
                { $eq: ["$supplierId", "$$supplier"] }
              ]
            }
          }
        },
        {
          $project: {
            noAlokasi: 1,
            listBreakdown: { $arrayElemAt: ["$listBreakdown", 0] }
          }
        }
      ],
      as: "alokasiUnit"
    }
  },
  { $unwind: "$alokasiUnit" },

  // Tambahan lookup untuk mengambil units
  {
    $lookup: {
      from: "t_purchase_order",
      let: {
        noAlokasi: "$_id.noAlokasi",
        buyer: "$_id.buyerName",
        supplier: "$_id.supplierName"
      },
      pipeline: [
        { $unwind: "$details" },
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ["$details.noAlokasi", "$$noAlokasi"] },
                { $eq: ["$buyerName", "$$buyer"] },
                { $eq: ["$supplierName", "$$supplier"] }
              ]
            }
          }
        },
        {
          $project: {
            _id: 0,
            po: "$_id",
            unitId: "$details.unitId",
            unitName: "$details.unitName",
            qty: "$details.qty",
            qtyUsed: "$details.qty",
            status: "$status"
          }
        }
      ],
      as: "units"
    }
  },

  {
    $project: {
      _id: "$_id._id",
//      supplierName: "$_id.supplierName",
//      buyerName: "$_id.buyerName",
//      noAlokasi: "$_id.noAlokasi",
//      qty: "$qty",
//      avalaibleQuota: "$alokasiUnit.listBreakdown.avalaibleQuota",
//      quota: "$alokasiUnit.listBreakdown.quota",
//      units: 1,
      query: {
        $concat: [
          "db.m_new_alokasi_bulanan_kontrak_unit.updateOne({supplierName: '",
          "$_id.supplierName",
          "',buyerName: '",
          "$_id.buyerName",
          "', noAlokasi: '",
          "$_id.noAlokasi",
          "'}, {$set: { 'listBreakdown.0.reservedQuota': NumberLong('",
          { $toString: "$qty" },
          "'), 'listBreakdown.0.availableQuota': NumberLong('",
          { $toString: { $subtract: ["$alokasiUnit.listBreakdown.quota", "$qty"] } },
          "'),",
//          { $toString: "$units" },
         
        ]
      },
       'listBreakdownWKWK0WKWKpurchaseOrderAlokasiLog':"$units",
			 tutup: "}})",
    }
  },
  {
    $sort: {
      supplierName: 1,
      noAlokasi: 1
    }
  }
])
