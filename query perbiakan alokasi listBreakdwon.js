db.m_new_alokasi_bulanan_kontrak_unit.aggregate(
    [{
        $match: {
            
            noAlokasi: {
                $in: [
                    "NAB20260112-143418",
                    "NAB20260112-163020",
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
                    "NAB20260123-141830"
                ]
            },
            //             "listBreakdown.purchaseOrderAlokasiLog": {
            //                 $exists: true
            //             }
        }
    }, {
        $project: {
            //             juni: {
            //                 $slice: ["$listBreakdown", 6]
            //             },
            "listBreakdown": "$listBreakdown",
            noAlokasi: "$noAlokasi",
            supplierName: "$supplierName",
            buyerName: "$buyerName",
            "quota": "$quota",
            "reservedQuota": "$reservedQuota",
            "availableQuota": "$availableQuota",
            "realisasi": "$realisasi",
            "sumQuota": "$sumQuota",
            
        }
    }, {
        $unwind: "$listBreakdown"
    }, {
        $group: {
            _id: {
                _id: "$_id",
                "juni": "$juni",
                noAlokasi: "$noAlokasi",
                supplierName: "$supplierName",
                buyerName: "$buyerName",
                "quota": "$quota",
                "reservedQuota": "$reservedQuota",
                "availableQuota": "$availableQuota",
                "realisasi": "$realisasi",
                "sumQuota": "$sumQuota",
                
            },
            "quotaDalam": {
                $sum: "$listBreakdown.quota"
            },
            "reservedQuotaDalam": {
                $sum: "$listBreakdown.reservedQuota"
            },
            "availableQuotaDalam": {
                $sum: "$listBreakdown.availableQuota"
            },
            "realisasiDalam": {
                $sum: "$listBreakdown.realisasi"
            },
            "sumQuotaDalam": {
                $sum: "$listBreakdown.sumQuota"
            },
            
        }
    }, {
        $project: {
            _id: 0,
            //             juni: "$_id.juni",
            noAlokasi: "$_id.noAlokasi",
            supplierName: "$_id.supplierName",
            buyerName: "$_id.buyerName",
            "quota": "$_id.quota",
            "reservedQuota": "$_id.reservedQuota",
            "availableQuota": "$_id.availableQuota",
            "realisasi": "$_id.realisasi",
            "sumQuota": "$_id.sumQuota",
            "quotaDalam": "$quotaDalam",
            "reservedQuotaDalam": "$reservedQuotaDalam",
            "availableQuotaDalam": "$availableQuotaDalam",
            "realisasiDalam": "$realisasiDalam",
            "sumQuotaDalam": "$sumQuotaDalam",
            Ketquota: {
                $cond: [
                    {
                        $or: [
                            //                             {
                            //                                 $eq: ["$_id.quota", "$availableQuotaDalam"]
                            //                             },
                            {
                                $eq: ["$_id.availableQuota", "$availableQuotaDalam"]
                            }
                        ]
                    },
                    "AMAN",
                    "TIDAK AMAN"
                ]
            }
        }
    }, {
        $match: {
            Ketquota: "TIDAK AMAN"
        }
    }, {
        $lookup: {
            from: "m_new_alokasi_bulanan_kontrak_unit",
            let: {
                alokasi: "$noAlokasi",
                supplier: "$supplierName",
                buyer: "$buyerName",
                
            },
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $and: [{
                                $eq: ["$noAlokasi", "$$alokasi"]
                            }, {
                                $eq: ["$buyerName", "$$buyer"]
                            }, {
                                $eq: ["$supplierName", "$$supplier"]
                            }]
                        }
                    }
                },
                {
                    $unwind: {
                        path: "$listBreakdown",
                        includeArrayIndex: "index"
                    }
                },
                {
                    $match: {
                        $expr: {
                            $ne: [
                                "$listBreakdown.quota",
                                "$listBreakdown.availableQuota"
                            ]
                        }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        index: 1,
                        listBreakdown: 1
                    }
                }
            ],
            as: "alokasi_unit"
        }
    }, {
        $project: {
            alokasi_unit: 1
        }
    }, {
        $unwind: "$alokasi_unit"
    }, {
        $group: {
            _id: {
                "noAlokasi": "$alokasi_unit.listBreakdown.noAlokasi",
                "buyerName": "$alokasi_unit.listBreakdown.buyerName",
                "supplierName": "$alokasi_unit.listBreakdown.supplierName",
                "index": "$alokasi_unit.index",
                "quota": "$alokasi_unit.listBreakdown.quota",
                "reservedQuota": "$alokasi_unit.listBreakdown.reservedQuota",
                "availableQuota": "$alokasi_unit.listBreakdown.availableQuota",
                "realisasi": "$alokasi_unit.listBreakdown.realisasi",
                "sumQuota": "$alokasi_unit.listBreakdown.sumQuota",
                
            }
        }
    }, {
        $project: {
            _id: 0,
            "noAlokasi": "$_id.noAlokasi",
            "buyerName": "$_id.buyerName",
            "supplierName": "$_id.supplierName",
            "index": "$_id.index",
            "quota": "$_id.quota",
            "reservedQuota": "$_id.reservedQuota",
            "availableQuota": "$_id.availableQuota",
            "realisasi": "$_id.realisasi",
            "sumQuota": "$_id.sumQuota",
            query: {
                $concat: [
                    "db.m_new_alokasi_bulanan_kontrak_unit.updateOne({",
                    "noAlokasi:'",
                    "$_id.noAlokasi",
                    "',buyerName:'",
                    "$_id.buyerName",
                    "',supplierName:'",
                    "$_id.supplierName",
                    "'},{$set:{",
                    "'listBreakdown.",
                    {
                        $toString: "$_id.index"
                    },
                    ".quota':NumberLong('",
                    {
                        $toString: {
                            $add: ["$_id.quota", "$_id.availableQuota"]
                        }
                    },
                    "'),",
                    "'listBreakdown.",
                    {
                        $toString: "$_id.index"
                    },
                    ".sumQuota':NumberLong('",
                    {
                        $toString: {
                            $add: ["$_id.sumQuota", "$_id.availableQuota"]
                        }
                    },
                    "')",
                    "}})"
                ]
            }
            }
        }])