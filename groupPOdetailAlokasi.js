db.t_purchase_order.aggregate([
    {
        $match: {
            _id: {
                $in: [
                    "PO202500005726",
                    "PO202500003310",
                    "PO202100001400"
                ]
            }
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
            _id: "$_id._id",
            "supplierName": "$_id.supplierName",
            "buyerName": "$_id.buyerName",
            noAlokasi: "$_id.noAlokasi",
            status: "$_id.status",
            qty: "$qty",
            stockSiapPesan: "$alokasiUnit.stockSiapPesan",
            quota: "$alokasiUnit.quota",
            
        }
    },
    {
        $group: {
            _id: "$_id",
            details: {
                $push: {
                    "supplierName": "$supplierName",
                    "buyerName": "$buyerName",
                    noAlokasi: "$noAlokasi",
                    status: "$status",
                    qty: "$qty",
                    
                }
            }
        }
    },
		{$project:{
		_id:0,
		nopo:"$_id",
		details:"$details"
		}}
    
])

