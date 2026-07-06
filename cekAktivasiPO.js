db.t_purchase_order.aggregate([
    {
        $match: {
				"details.noAlokasi":"NA20250611-143703",
				"supplierId": "pt_rahmat_kurnia_abadi",
//    "supplierName": "PT RAHMAT KURNIA ABADI",
    "buyerId": "pln_kw_uiw_sumatera_barat",
            //            
//            _id: {
//                $in: [
//"PO202500003197",
//                    
//                ]
//            }
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
            status: "$_id.status",
            noAlokasi: "$_id.noAlokasi",
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
            sku: 1,
            status: 1
        }
    }
])
