db.t_purchase_order.aggregate([
    {
        $match: {
// _id:"PO202400008684"
				createdDate: {
    $gte: ISODate("2025-01-01T00:00:00.000Z"),
     $lte: new Date()
  }
//            $expr: {
//                $and: [{
//                    
//                    $eq: [{
//                        $year: "$createdDate"
//                    }, 2025] // 1 untuk Januari},]}
//                }]
//            },
//            "categoryId": {
//                $in: ["plnmp086", "plnmp077"]
//            },
            //    "categoryName": {$in:["TRAFO POWER","MTU AIS"]},
        }
    },
    {
        $project: {
            _id: 1,
            createdDate: 1,
						"slaRating": 1,
            poSendSupplierDate: 1,
            status: 1,
            buyerId: 1,
            buyerName: 1,
            supplierId: 1,
            noPoSAP: 1,
            supplierName: 1,
            "details.unitName": 1,
            "details.noAlokasi": 1,
						noAlokasi: {
      $arrayElemAt: ["$details.noAlokasi", 0]
    },
            "details.sku": 1,
            "details.skuName": 1,
            "details.maxReceivedDay": 1,
            "ratingPurchaseOrder.ratingDate": 1,
            
        }
    },
    {
        $unwind: {
            path: "$details",
            includeArrayIndex: "indexDetail"
        }
    },
    {
        $group: {
            _id: {
                "nopo": "$_id",
                "createdDate": "$createdDate",
                "poSendSupplierDate": "$poSendSupplierDate",
                "noPoSAP": "$noPoSAP",
                "slaRating": "$slaRating",
                "noPoSAP": "$noPoSAP",
                "status": "$status",
                "buyerId": "$buyerId",
                "buyerName": "$buyerName",
                "supplierName": "$supplierName",
                "supplierId": "$supplierId",
//                 "unitName": "$details.unitName",
                "noAlokasi": "$noAlokasi",
//                 "sku": "$details.sku",
//                 "skuName": "$details.skuName",
//                 "maxReceivedDay": "$details.maxReceivedDay",
                "ratingDate": "$ratingPurchaseOrder.ratingDate",
//                 "index": "$indexDetail"
            }
        }
    },
    {
        $project: {
            _id: 0,
            "nopo": "$_id.nopo",
            "createdDate": "$_id.createdDate",
            "poSendSupplierDate": {
                $ifNull: ["$_id.poSendSupplierDate", "-"]
            },
            "status": "$_id.status",
            "noPoSAP": "$_id.noPoSAP",
            "slaRating": "$_id.slaRating",
            "buyerId": "$_id.buyerId",
            "buyerName": "$_id.buyerName",
            "supplierName": "$_id.supplierName",
            "supplierId": "$_id.supplierId",
            "unitName": "$_id.unitName",
            "noAlokasi": "$_id.noAlokasi",
            "sku": "$_id.sku",
            "skuName": "$_id.skuName",
            "maxReceivedDay": "$_id.maxReceivedDay",
            "ratingDate": "$_id.ratingDate",
            "index": "$_id.index",
            
        }
    },
    {
        $lookup: {
            from: "m_new_alokasi_kontrak",
            let: {
                alokasi: "$noAlokasi",
                supplier: "$supplierId",
                buyer: "$buyerId",
                
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
                        noAlokasi: "$noAlokasi",
                        noKontrak: "$details.noKontrak",
                        
                    }
                }
            ],
            as: "inEx",
            
        },
        
    },    {
        $lookup: {
            from: "m_new_alokasi_bulanan_kontrak",
            let: {
                alokasi: "$noAlokasi",
                supplier: "$supplierId",
                buyer: "$buyerId",
                
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
                        noAlokasi: "$noAlokasi",
                        noKontrak: "$details.noKontrak",
                        
                    }
                }
            ],
            as: "bulanan",
            
        },
        
    },
				 {
    $addFields: {
      alokasiUnit: {
        $cond: {
          if: { $eq: ["$_id.trxType", "BULANAN"] },
          then: "$bulanan",
          else: "$inEx"
        }
      }
    }
  },
    {
        $unwind: "$alokasiUnit"
    },
    {
        $project: {
            "No PO": "$nopo",
            "TGL PO Dibuat": "$createdDate",
//             "Tgl Po Dikirim": "$poSendSupplierDate",
            "No PO SAP": "$noPoSAP",
            //"buyerId": "$buyerId",
//             "Unit Induk": "$buyerName",
//             "Penyedia": "$supplierName",
            //"supplierId": "$supplierId",
            "status": "$status",
//             "UP3 Tujuan": "$unitName",
//             "Nomor Alokasi": "$noAlokasi",
            "Nomor Kontrak": "$alokasiUnit.noKontrak",
//             "SKU": "$sku",
//             "Nama Material": "$skuName",
//             "SLA": "$maxReceivedDay",
            "SLA Rating": "$slaRating",
            "Rating Date": "$ratingDate",
//             "index": "$index",
        }
    },
// 		{$match:{
// 		SLA:{$lt:240}
// 		}},
    {
        $sort: {
            "No PO":  1,
            index: 1
        }
    },
    //    {
    //        $limit: 1
    //    }
]);


//No PO |Tgl PO Dibuat | Tgl Po Dikirim | Unit INduk | UP3 tujuan | No Kontrak | SKU | Nama Material | SLA



//db.t_purchase_order.find({_id:"PO202500011160"})