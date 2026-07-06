db.t_purchase_order.aggregate([
    {
        $match: {
                  "details.noAlokasi": /NAB/i,
////"details.noAlokasi": "NAB20250411-150417",
//supplierName: "PT PLN (Persero) PUSHARLIS",
//    "buyerName": "UID Jawa Barat",
//    "details.noAlokasi": "NAB20250417-154140",
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
            qty: {
                $sum: "$details.qty"
            }
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
                                {
                                    $eq: ["$noAlokasi", "$$alokasi"]
                                },
                                {
                                    $eq: ["$buyerId", "$$buyer"]
                                },
                                {
                                    $eq: ["$supplierId", "$$supplier"]
                                }
                            ]
                        }
                    }
                },
                        {
                          $project: {
													"noAlokasi": 1,
                            "supplierId": 1,
                            "supplierName": 1,
                            "buyerId": 1,
                            "buyerName": 1,
                            "quota": 1,
                            "reservedQuota": 1,
                            "availableQuota": 1,
                            "realisasi": 1,
                            "sumQuota": 1,
                            listBreakdown: { $slice: ["$listBreakdown", 1, { $size: "$listBreakdown" }] }
                          }
                        },
												
                {
                    $unwind: "$listBreakdown"
                },
                {
                    $group: {
                        _id: {
                            "noAlokasi": "$noAlokasi",
                            "supplierId": "$supplierId",
                            "supplierName": "$supplierName",
                            "buyerId": "$buyerId",
                            "buyerName": "$buyerName",
                            "quota": "$quota",
                            "reservedQuota": "$reservedQuota",
                            "availableQuota": "$availableQuota",
                            "realisasi": "$realisasi",
                            "sumQuota": "$sumQuota",
                            
                        },
                        quotaLuar: {
                            $sum: "$listBreakdown.quota"
                        },
                        reservedQuotaLuar: {
                            $sum: "$listBreakdown.reservedQuota"
                        },
                        availableQuotaLuar: {
                            $sum: "$listBreakdown.availableQuota"
                        },
                        sumQuotaLuar: {
                            $sum: "$listBreakdown.sumQuota"
                        },
                        
                    }
                },
                {
                    $project: {
                        "noAlokasi": "$_id.noAlokasi",
                        "supplierId": "$_id.supplierId",
                        "supplierName": "$_id.supplierName",
                        "buyerId": "$_id.buyerId",
                        "buyerName": "$_id.buyerName",
                        "quota": "$_id.quota",
                        "reservedQuota": "$_id.reservedQuota",
                        "availableQuota": "$_id.availableQuota",
                        "realisasi": "$_id.realisasi",
                        "sumQuota": "$_id.sumQuota",
                        quotaLuar: "$quotaLuar",
                        reservedQuotaLuar: "$reservedQuotaLuar",
                        availableQuotaLuar: "$availableQuotaLuar",
                        sumQuotaLuar: "$sumQuotaLuar",
                        
                    }
                },
                
            ],
            as: "alokasiUnit"
        }
    },
    {
        $unwind: "$alokasiUnit"
    },
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
                {
                    $unwind: "$details"
                },
                {
                    $match: {
                        $expr: {
                            $and: [
                                {
                                    $eq: ["$details.noAlokasi", "$$noAlokasi"]
                                },
                                {
                                    $eq: ["$buyerName", "$$buyer"]
                                },
                                {
                                    $eq: ["$supplierName", "$$supplier"]
                                }
                            ]
                        }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        nopo: "$_id",
                        qty: "$details.qty",
                        qtyUsed: "$details.qty",
                        status: "$status",
                        unitId: "$details.unitId",
                        qtyReserved: "$details.qty",
                        domicileId: "$details.domicileId",
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
                    {
                        $toString: "$alokasiUnit.reservedQuota"
                    },
                    "'), 'listBreakdown.0.availableQuota': NumberLong('",
                    {
                        $toString: {
                            $subtract: ["$alokasiUnit.availableQuota", "$alokasiUnit.availableQuotaLuar", ]
                        }
                    },
                    "'),'listBreakdown.0.quota': NumberLong('",
                    {
                        $toString: {
                            $subtract: ["$alokasiUnit.quota", "$alokasiUnit.quotaLuar", ]
                        }
                    },
                    "'),'listBreakdown.0.realisasi': NumberLong('",
                    {
                        $toString: "$alokasiUnit.realisasi"
                    },
                    "'),'listBreakdown.0.sumQuota': NumberLong('",
                    {
                        $toString:{ $subtract: ["$alokasiUnit.sumQuota", "$alokasiUnit.sumQuotaLuar", ]}
                    },
                    "')"
                    //          { $toString: "$units" },
                ]
            },
            'listBreakdownWKWK0WKWKpurchaseOrderAlokasiLog': "$units",
            tutup: "}})",
//            "cek":"$alokasiUnit"
        }
    },
    {
        $sort: {
            supplierName: 1,
            noAlokasi: 1
        }
    }
])
