db.t_purchase_order.aggregate([
    {
        $match: {

				"details.noAlokasi":{$in:["NA20260130-093537"	]},
//"details.sku": "1636794828510",
//    "supplierId": "577ff483-7984-4ae8-94d3-14ec14a20ee8",
   "supplierName": "PT MAKMUR JAYA ",
//    "buyerId": "pln_kw_uiw_kaltimra",
   "buyerName": "UID Jawa Timur",
//				status:{$in:[
////				"APPROVED_GM",
//                                        //                                        "APPROVED_MSB",
//                                        //                                        "APPROVED_SRM",
//                                        "APPROVED_SUPPLIER",
//                                        //                                        "CREATED",
//                                        //                                        "DRAFT",
//                                        "FINISHED",
//                                        "PROCESSED_BABG",
//                                        "PROCESSED_SUPPLIER",
//                                        "RECEIVED",
//                                        "REQUESTED",
//                                        //                                        "REQUESTED_DIGISIGN_GM",
//                                        "REQUESTED_DIGISIGN_SUPPLIER"
//				]}
// 				   _id: {
//                 $in: [
// "PO202500013764",
// "PO202500013773",
// "PO202500013848",
// "PO202500013849",
// "PO202500013851",
// "PO202500014071",
// "PO202500014073",
// "PO202500014176",
// "PO202500014177",
// "PO202500014225",
// "PO202500014251",
// "PO202500014251",
//                 ]
//             }
// //
        }
    },
    {
        $unwind: "$details"
    },
    {
        $group: {
            _id: {
                _id: "$_id",
                "supplierId": "$supplierId",
                "supplierName": "$supplierName",
                "buyerId": "$buyerId",
                "buyerName": "$buyerName",
								trxType: "$trxType",
                sku: "$details.sku",
                noAlokasi: "$details.noAlokasi",
                status: "$status",
                
            },
            qty: {
                $sum: "$details.qty"
            },
            
        }
    },
    {
						$lookup: {
            from: "m_new_alokasi_bulanan_kontrak_unit",
            let: {
                alokasi: "$_id.noAlokasi",
                supplier: "$_id.supplierId",
                buyer: "$_id.buyerId",
                
            },
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $and: [{
                                $eq: ["$noAlokasi", "$$alokasi"]
                            }, {
                                $eq: ["$buyerId", "$$buyer"]
                            }, {
                                $eq: ["$supplierId", "$$supplier"]
                            }]
                        }
                    }
                },
                {
                    $addFields: {
                        bulan_sekarang: {
                            $month: "$$NOW"
                        }
                    }
                },
                {
                    $addFields: {
                        data_dibawah_bulan_sekarang: {
                            $filter: {
                                input: "$listBreakdown",
                                as: "item",
                                cond: {
                                    $lte: ["$$item.bulan", "$bulan_sekarang"]
                                }
                            }
                        }
                    }
                },
                {
                    $addFields: {
                        total_qty: {
                            $sum: "$data_dibawah_bulan_sekarang.availableQuota"
                        }
                    }
                },
                {
                    $project: {
                        noAlokasi: "$noAlokasi",
                        stockSiapPesan: "$total_qty",
                        quota: "$quota",
                        
                    }
                }
            ],
            as: "bulanan",
            
        },
        
    },
		    {
        $lookup: {
            from: "m_new_alokasi_kontrak_unit",
            let: {
                alokasi: "$_id.noAlokasi",
                supplier: "$_id.supplierId",
                buyer: "$_id.buyerId",
                
            },
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $and: [{
                                $eq: ["$noAlokasi", "$$alokasi"]
                            }, {
                                $eq: ["$buyerId", "$$buyer"]
                            }, {
                                $eq: ["$supplierId", "$$supplier"]
                            }]
                        }
                    }
                },
                {
                    $project: {
                        noAlokasi: "$noAlokasi",
                        stockSiapPesan: "$availableQuota",
                        quota: "$quota",
                        
                    }
                }
            ],
            as: "inEx",
            
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
            _id: "$_id._id",
            "supplierName": "$_id.supplierName",
            "buyerName": "$_id.buyerName",
            //            sku: "$_id.sku",
            noAlokasi: "$_id.noAlokasi",
            sku: "$_id.sku",
            status: "$_id.status",
            qty: "$qty",
            stockSiapPesan: "$alokasiUnit.stockSiapPesan",
            quota: "$alokasiUnit.quota",
            keterangan: {
                $cond: {
                    if : {
                        $gte: ["$alokasiUnit.stockSiapPesan", "$qty"]
                    },
                    then: "AMAN",
                    else : {
                        $concat: ["$_id._id", " tidak dapat diaktivasi, stock siap pesan pada Alokasi ", "$_id.noAlokasi", " tidak memenuhi qty PO."]
                    }
                }
            }
        }
    },
		{$match:{
		noAlokasi:"NA20260130-093537",
		status:{$nin:[/reject/i]}
		}},

    {
        $sort: {
            //            supplierName: 1,
            status: 1
        }
    }
])

