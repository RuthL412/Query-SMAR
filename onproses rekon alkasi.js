db.t_purchase_order.aggregate([
    {
        $match: {
				buyerCode:{$in:[
"6600", "6500", "6700", "5400", "7100"
]},
            "details.noAlokasi": {
                $in: [
                    "NAB20260112-143418",
                    "NAB20260112-163020",
                    "NAB20260112-163700",
                    "NAB20260119-100127",
                    "NAB20260119-155054",
                    "NAB20260119-171604",
                    "NAB20260119-172909",
                    "NAB20260120-092535",
                    "NAB20260120-092845",
                    "NAB20260120-093122",
                    "NAB20260122-101048",
                    "NAB20260122-101233",
                    "NAB20260122-101354",
                    "NAB20260122-101536",
                    "NAB20260122-101625",
                    "NAB20260122-133557",
                    "NAB20260122-134147",
                    "NAB20260122-134548",
                    "NAB20260122-134747",
                    "NAB20260122-134859",
                    "NAB20260122-135017",
                    "NAB20260122-135138",
                    "NAB20260122-135338",
                    "NAB20260122-135704",
                    "NAB20260122-135808",
                    "NAB20260122-135859",
                    "NAB20260122-135943",
                    "NAB20260122-140032",
                    "NAB20260122-140120",
                    "NAB20260123-140205",
                    "NAB20260123-140545",
                    "NAB20260123-140849",
                    "NAB20260123-141114",
                    "NAB20260123-141522",
                    "NAB20260123-141830",
                    
                ]
            },
            noPoSAP: {
                $exists: true
            }
        }
    },
    {
        $project: {
            _id: 1,
            noOA: 1,
            buyerId: 1,
            buyerName: 1,
            buyerId: 1,
            supplierId: 1,
            supplierName: 1,
            //             "details.unitName": 1,
            "details.noAlokasi": 1,
            //             "details.sku": 1,
            //             "details.skuName": 1,
            //             "details.maxReceivedDay": 1,
        }
    },
    {
        $unwind: {
            path: "$details",
            
        }
    },
    {
        $group: {
            _id: {
                "noOA": "$noOA",
                "supplierName": "$supplierName",
                "supplierId": "$supplierId",
                "buyerId": "$buyerId",
                "noAlokasi": "$details.noAlokasi",
                
            }
        }
    },
    {
        $project: {
            _id: 0,
            "noOA": "$_id.noOA",
            "supplierName": "$_id.supplierName",
            "supplierId": "$_id.supplierId",
            "buyerId": "$_id.buyerId",
            "noAlokasi": "$_id.noAlokasi",
            
        }
    },
    {
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
                        totalKHSPenyedia: "$details.totalKHSPenyedia",
                        totalQuota: "$details.totalQuota",
                        totalRealisasi: "$details.totalRealisasi",
                        
                    }
                }
            ],
            as: "alokasiUnit",
            
        },
        
    },
    {
        $unwind: "$alokasiUnit"
    },
    {
        $project: {
            "NoOA": "$noOA",
            supplierId: "$supplierId",
            "noAlokasi": "$noAlokasi",
            "noKontrak": "$alokasiUnit.noKontrak",
            "totalKHSPenyedia": "$alokasiUnit.totalKHSPenyedia",
            sisaKhs: {
                $subtract: ["$alokasiUnit.totalKHSPenyedia", {
                    $add: ["$alokasiUnit.totalRealisasi", "$alokasiUnit.totalQuota"]
                }]
            },
            totalAlokasi: {
                $add: ["$alokasiUnit.totalRealisasi", "$alokasiUnit.totalQuota"]
            }
        }
    },
    {
        $lookup: {
            from: "m_new_alokasi_bulanan_kontrak_unit",
            let: {
                alokasi: "$noAlokasi",
                supplier: "$supplierId",
                
            },
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $and: [{
                                $eq: ["$noAlokasi", "$$alokasi"]
                            },{
                                $eq: ["$supplierId", "$$supplier"]
                            }]
                        }
                    }
                },
//                 {
//                     $unwind: "$listBreakdown"
//                 },
                {
                    $group: {
                        _id: "$noAlokasi",
                        januari: {
                            $sum: {
                                $arrayElemAt: ["$listBreakdown.sumQuota", 0]
                            }
                        },
                        februari: {
                            $sum: {
                                $arrayElemAt: ["$listBreakdown.sumQuota", 1]
                            }
                        },
                        maret: {
                            $sum: {
                                $arrayElemAt: ["$listBreakdown.sumQuota", 2]
                            }
                        },
                        april: {
                            $sum: {
                                $arrayElemAt: ["$listBreakdown.sumQuota", 3]
                            }
                        },
                        mei: {
                            $sum: {
                                $arrayElemAt: ["$listBreakdown.sumQuota", 4]
                            }
                        },
                        juni: {
                            $sum: {
                                $arrayElemAt: ["$listBreakdown.sumQuota", 5]
                            }
                        },
                        juli: {
                            $sum: {
                                $arrayElemAt: ["$listBreakdown.sumQuota", 6]
                            }
                        },
                        agustus: {
                            $sum: {
                                $arrayElemAt: ["$listBreakdown.sumQuota", 7]
                            }
                        },
                        september: {
                            $sum: {
                                $arrayElemAt: ["$listBreakdown.sumQuota", 8]
                            }
                        },
                        oktober: {
                            $sum: {
                                $arrayElemAt: ["$listBreakdown.sumQuota", 9]
                            }
                        },
                        november: {
                            $sum: {
                                $arrayElemAt: ["$listBreakdown.sumQuota", 10]
                            }
                        },
                        desember: {
                            $sum: {
                                $arrayElemAt: ["$listBreakdown.sumQuota", 11]
                            }
                        }
                    }
                }
            ],
            as: "bulanan",
            
        },
        
    },
		{
		$unwind:"$bulanan"
		},
		{
		$project:{
		noAlokasi:"$noAlokasi",
		noKontrak:"$noKontrak",
		noOA:"$NoOA",
		OAnum:"",
		version:"1",
		AU:"",
		sisaKhs:"$sisaKhs",
		totalAlokasi:"$totalAlokasi",
		januari: "$bulanan.januari",
  februari: "$bulanan.februari",
  maret: "$bulanan.maret",
  april: "$bulanan.april",
  mei: "$bulanan.mei",
  juni: "$bulanan.juni",
  juli: "$bulanan.juli",
  agustus: "$bulanan.agustus",
  september: "$bulanan.september",
  oktober: "$bulanan.oktober",
  november: "$bulanan.november",
  desember: "$bulanan.desember"
		}
		},
    {
        $sort: {
            "noKontrak": 1,
            index: 1
        }
    },
    //    {
    //        $limit: 1
    //    }
]);


//No PO |Tgl PO Dibuat | Tgl Po Dikirim | Unit INduk | UP3 tujuan | No Kontrak | SKU | Nama Material | SLA



//db.t_purchase_order.find({_id:"PO202500011160"})