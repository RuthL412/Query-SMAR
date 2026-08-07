db.t_purchase_order.aggregate([
    {
        $match: {
            //				
            //				_id:{$in:[
            //"PO202500004540",
            //"PO202500004542",
            //"PO202500004543",
            //"PO202500004544",
            //"PO202500004546",
            //"PO202500004548",
            //"PO202500004550",
            //"PO202500004552",
            //"PO202500004554",
            //"PO202500002971",
            //"PO202500007474",
            //
            //				]},
            ratingStatus: {
                $exists: true
            },
            "slaRating": true,
            //            nopoAms: {$in:[
            //"0013.Pj/DAN.01.01/F11000000/2025",
            //"0055.Pj/DAN.01.01/F09000000/2025",
            //"0267.Pj/DAN.01.01/F01050000/2025",
            //"0090.Pj/DAN.01.01/F15000000/2025",
            //"0128.Pj/DAN.01.01/F14000000/2025",
            //"0335.Pj/DAN.01.01/F02000000/2025",
            //"0166.Pj/DAN.01.01/F30000000/2025",
            //"0183.Pj/DAN.01.01/F14000000/2025",
            //"0192.Pj/DAN.01.01/F14000000/2025",
            //"0137.Pj/DAN.01.01/F24000000/2025",
            //"0136.Pj/DAN.01.01/F24000000/2025",
            //"0515.Pj/DAN.01.01/F08000000/2025",
            //"0633.Pj/DAN.01.01/F02000000/2025",
            //"0177.Pj/DAN.01.01/F23000000/2025",
            //"0179.Pj/DAN.01.01/F23000000/2025",
            //"0350.Pj/DAN.01.01/F11000000/2025",
            //
            //						]}
        }
    },
    {
        $unwind: "$ratingPurchaseOrder"
    },
    {
        $project: {
            _id: 0,
            PO: "$_id",
            Buyer: "$buyerName",
            Supplier: "$supplierName",
            "No KR": "$nopoAms",
            "Kategori": "$categoryName",
            "Tanggal KR": {
                $cond: [
                    {
                        $ne: ["$poEffectiveDateStart", null]
                    },
                    {
                        $dateToString: {
                            format: "%Y-%m-%d %H:%M:%S",
                            date: {
                                $add: [
                                    "$poEffectiveDateStart",
                                    7 * 60 * 60 * 1000 // tambah 7 jam
                                ]
                            }
                        }
                    },
                    null
                ]
            },
            "QTT (pcs/m)": "$qty",
            "Nilai KR Excl(RP)": {
                $add: ["$hargaBarangTotal", "$hargaKirimTotal"]
            },
            "PO Finish ": {
                $cond: {
                    if : {
                        $eq: ["$ratingStatus", "COMPLETED"]
                    },
                    then: "YES",
                    else : "NO"
                }
            },
            "Status PO": "$status",
            "Quality & Quantity_ratingPurchaseOrder": {
                $ifNull: ["$ratingPurchaseOrder.qualityAndQuantity", "n/a"]
            },
            "Sanksi_ratingPurchaseOrder": {
                $ifNull: ["$ratingPurchaseOrder.sangksi", "n/a"]
            },
            "Waktu_ratingPurchaseOrder": {
                $ifNull: ["$ratingPurchaseOrder.deliveryTime", "n/a"]
            },
            "Layanan_ratingPurchaseOrder": {
                $ifNull: ["$ratingPurchaseOrder.layanan", "n/a"]
            }
        }
    },
		{$match:{
  $and: [
    {
      $or: [
        { "Quality & Quantity_ratingPurchaseOrder": { $lte: 100 } },
        { "Quality & Quantity_ratingPurchaseOrder": "n/a" }
      ]
    },
    {
      $or: [
        { "Sanksi_ratingPurchaseOrder": { $lte: 100 } },
        { "Sanksi_ratingPurchaseOrder": "n/a" }
      ]
    },
    {
      $or: [
        { "Waktu_ratingPurchaseOrder": { $lte: 100 } },
        { "Waktu_ratingPurchaseOrder": "n/a" }
      ]
    },
    {
      $or: [
        { "Layanan_ratingPurchaseOrder": { $lte: 100 } },
        { "Layanan_ratingPurchaseOrder": "n/a" }
      ]
    }
  ]
}
},
    {
        $sort: {
            "Quality & Quantity_ratingPurchaseOrder": - 1,
            "Sanksi_ratingPurchaseOrder": - 1,
            "Waktu_ratingPurchaseOrder":  - 1,
            "Layanan_ratingPurchaseOrder": - 1
        }
    }
])