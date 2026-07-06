db.t_purchase_order.aggregate([
    {
        $match: {
				_id:"PO202500003548"
//            supplierName: /PT GUNABANGSA TEKNIK INDUSTRI/i,
//            //            
//            "details.noAlokasi": {
//                $in: [
//                    "NAB20250415-084444",
//                    
//                ]
//            }
            //"details.noAlokasi":/NAB/i
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
                //                sku: "$details.sku",
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
            as: "alokasiUnit",
            
        },
        
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
        $sort: {
            //            supplierName: 1,
            status: 1
        }
    }
])

