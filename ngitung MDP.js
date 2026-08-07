db.t_purchase_order.aggregate([
  {
    $match: {
// 		_id:{$in:[/PO2025/i]},
// "_created": {$gt:ISODate("2024-12-30T08:15:15.872Z")},
      status: {
        $in: [
          "APPROVED_GM",
          "APPROVED_MSB",
          "APPROVED_SRM",
          "CREATED",
          "DRAFT",
          "REQUESTED_DIGISIGN_GM",
          "PROCESSED_SUPPLIER",
					"APPROVED_SUPPLIER"
        ]
      }
    }
  },
  {
    $unwind: "$details"
  },
  {
    $match: {
      "details.sku": "1702630938822",
			"details.detailStatus":"CREATED",
      "details.unitId": {
        $in: [
          "pln_kd_uid_jawa_timur-pln_up3_surabaya_barat",
          "pln_kd_uid_jawa_timur-pln_up3_surabaya_selatan"
        ]
      }
    }
  },
  {
    $group: {
      _id: {
        buyerId: "$buyerId",
        buyerName: "$buyerName",
        unitId: "$details.unitId",
        unitName: "$details.unitName",
        sku: "$details.sku"
      },
      qty: {
        $sum: "$details.qty"
      }
    }
  },
  {
    $project: {
      _id: 0,
      buyerName: "$_id.buyerName",
      unitName: "$_id.unitName",
      sku: "$_id.sku",
      qty: 1
    }
  },
  {
    $sort: {
      buyerName: 1
    }
  }
])