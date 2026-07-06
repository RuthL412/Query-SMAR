db.t_purchase_order.aggregate([
    {
        $match: {
           categoryId:{$in:[
					 "plnmp077","plnmp086"
					 ]},
//             ratingStatus: {
//                 $exists: true
//             },
//             "slaRating": true,
        }
    },
    {
        $unwind: "$ratingPurchaseOrder"
    }, 
    {
        $project: {
            _id: 0,
						noAlokasi:{
        $arrayElemAt: ["$details.noAlokasi", 0]
      },
            PO: "$_id",
            Buyer: "$buyerName",
            supplierId: "$supplierId",
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
// 		{$match:{
//   $and: [
//     {
//       $or: [
//         { "Quality & Quantity_ratingPurchaseOrder": { $lte: 100 } },
//         { "Quality & Quantity_ratingPurchaseOrder": "n/a" }
//       ]
//     },
//     {
//       $or: [
//         { "Sanksi_ratingPurchaseOrder": { $lte: 100 } },
//         { "Sanksi_ratingPurchaseOrder": "n/a" }
//       ]
//     },
//     {
//       $or: [
//         { "Waktu_ratingPurchaseOrder": { $lte: 100 } },
//         { "Waktu_ratingPurchaseOrder": "n/a" }
//       ]
//     },
//     {
//       $or: [
//         { "Layanan_ratingPurchaseOrder": { $lte: 100 } },
//         { "Layanan_ratingPurchaseOrder": "n/a" }
//       ]
//     }
//   ]
// }
// },
//     
 {
        $lookup: {
            from: "m_new_alokasi_kontrak",
            let: {
                alokasi: "$noAlokasi",
                supplier: "$supplierId",
                
            },
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $and: [{
                                $eq: ["$_id", "$$alokasi"]
                            }]
                        }
                    }
                },
                {
                    $unwind: "$details",
                    
                },
                {
                    $match: {
                        $expr: {
                            $and: [{
                                $eq: ["$details.supplierId", "$$supplier"]
                            }]
                        }
                    }
                },
                {
                    $project: {
										_id:0,
                        noAlokasi: "$noAlokasi",
                        noKontrak: "$details.noKontrak",
                        
                    }
                }
            ],
            as: "alokasiUnit",
            
        },
        
    },
		{
		$unwind:"$alokasiUnit"
		},
		{
  $addFields: {
    noKontrak: "$alokasiUnit.noKontrak"
  }
},
{
  $project: {
    alokasiUnit: 0,noAlokasi:0,supplierId:0
  }},
		
		{
        $sort: {
            "Quality & Quantity_ratingPurchaseOrder": - 1,
            "Sanksi_ratingPurchaseOrder": - 1,
            "Waktu_ratingPurchaseOrder":  - 1,
            "Layanan_ratingPurchaseOrder": - 1
        }
    }
])