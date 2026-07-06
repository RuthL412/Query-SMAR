db.t_purchase_order.aggregate([
    {
        $match: {
            _id: {
                $in: [
                    "PO202500003310",
                    "PO202500003319",
                    "PO202500004471",
										"PO202100001400"
                    
                ]
            }
            //
        }
    },
    {
        $unwind: "$details"
    },
    {
        $group: {
            _id: {
                "supplierId": "$supplierId",
                "supplierName": "$supplierName",
                "buyerId": "$buyerId",
                "buyerName": "$buyerName",
                "noAlokasi": "$details.noAlokasi",
                trxType: "$trxType",
                
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
                    if : {
                        $eq: ["$_id.trxType", "BULANAN"]
                    },
                    then: "$bulanan",
                    else : "$inEx"
                }
            }
        }
    },
    {
        $unwind: "$alokasiUnit"
    },
    {
        $project: {
            _id: 0,
            "supplierName": "$_id.supplierName",
            "supplierId": "$_id.supplierId",
            "buyerName": "$_id.buyerName",
            "buyerId": "$_id.buyerId",
            "trxType": "$_id.trxType",
            noAlokasi: "$_id.noAlokasi",
            stockSiapPesan: "$alokasiUnit.stockSiapPesan",
            quota: "$alokasiUnit.quota",
            
        },
        
    },
    {
        $sort: {
            quota: 1
        }
    }
])

