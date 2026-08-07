db.t_purchase_order.aggregate([
    {
        $match: {
				status:{$in:[
				"REQUESTED", // po sudah dikirim ke penyedia
  "REQUESTED_DIGISIGN_SUPPLIER", // menunggu
  "APPROVED_SUPPLIER", // persetujuan oleh penyedia
  "PROCESSED_BABG", // di upload babg oleh penyedia
  "PROCESSED_SUPPLIER", // telah diproses oleh penyedia (sudah ada DO)
  "RECEIVED", // sudah diterima semua namun belum diberi rating
  "FINISHED",
				]},

				"details.noAlokasi":{$in:["NAB20250411-161503","NA20250110-183518"	]},
//"details.sku": "1636794828510",
//    "supplierId": "577ff483-7984-4ae8-94d3-14ec14a20ee8",
//    "supplierName": "PT SMART METER INDONESIA",
//    "buyerId": "pln_kw_uiw_kaltimra",
//    "buyerName": "UID Kalimantan Timur dan Utara",
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
//				   _id: {
//                $in: [
//                   "PO202500008713"
//                ]
//            }
//
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
		{
		$match:{
		noAlokasi:{$in:["NAB20250411-161503","NA20250110-183518"	]}
		}
		},
{
$group:{
_id:"$supplierName",
qty:{$sum:"$qty"}
}
},
    {
        $sort: {
            //            supplierName: 1,
            status: 1
        }
    }
])


