db.m_new_alokasi_bulanan_kontrak_unit.aggregate([{
    $match: {
        "buyerId": {
            $in: ["pln_kw_uiw_sumatera_barat", "pln_kw_uiw_sumatera_utara", "pln_kw_uiw_aceh"]
        },
        sumQuota: {
            $gt: 0
        },
        "listBreakdown.8.purchaseOrderAlokasiLog": {
            $exists: true
        }
//"listBreakdown.8.sumQuota": {
//            $gt: 0
//        }
    }
}, {
    $project: {
        _id: 0,
        dataDesember: {
            $arrayElemAt: ["$listBreakdown", - 1]
        }
    }
}, {
    $unwind: "$dataDesember"
}, {
    $project: {
        "noAlokasi": "$dataDesember.noAlokasi",
        "supplierId": "$dataDesember.supplierId",
        "supplierName": "$dataDesember.supplierName",
        "buyerId": "$dataDesember.buyerId",
        "buyerName": "$dataDesember.buyerName",
        "bulan": "$dataDesember.bulan",
        "tahun": "$dataDesember.tahun",
        "status": "$dataDesember.status",
        "sweepAlokasi": "$dataDesember.sweepAlokasi",
        "quota": "$dataDesember.quota",
        "reservedQuota": "$dataDesember.reservedQuota",
        "availableQuota": "$dataDesember.availableQuota",
        "realisasi": "$dataDesember.realisasi",
        "sumQuota": "$dataDesember.sumQuota",
        "spb": "$dataDesember.spb",
        "persentaseSerap": "$dataDesember.persentaseSerap",
        "purchaseOrderAlokasiLog": "$dataDesember.purchaseOrderAlokasiLog",
        
    }
}, {
    $unwind: "$purchaseOrderAlokasiLog"
}, {
    $group: {
        _id: {
            "noAlokasi": "$noAlokasi",
            "supplierName": "$supplierName",
            "buyerName": "$buyerName",
            "sumQuota": "$sumQuota",
            "nopo": "$purchaseOrderAlokasiLog.nopo",
            "status": "$purchaseOrderAlokasiLog.status",
            
        },
        qtyPO: {
            $sum: "$purchaseOrderAlokasiLog.qtyUsed"
        }
    }
}, {
    $project: {
        _id: 0,
        "noAlokasi": "$_id.noAlokasi",
        "supplierName": "$_id.supplierName",
        "buyerName": "$_id.buyerName",
        "sumQuota": "$_id.sumQuota",
        "nopo": "$_id.nopo",
        "statusPO": "$_id.status",
        qtyPO: "$qtyPO"
    }
}, {
    $match: {
        statusPO: {
            $nin: [/reject/i]
        }
    }
}, {
    $project: {
        "noAlokasi": "$noAlokasi",
        "supplierName": "$supplierName",
        "buyerName": "$buyerName",
        "sumQuota": "$sumQuota",
        "nopo": "$nopo",
        "statusPO": "$statusPO",
        reserved: {
            $cond: [
                {
                    $eq: ["$statusPO", "CREATED"]
                },
                "$qtyPO",
                0
            ]
        },
        realisasi: {
            $cond: [
                {
                    $eq: ["$statusPO", "REQUESTED"]
                },
                "$qtyPO",
                0
            ]
        },
        qtyPO: "$qtyPO"
    }
}, {
    $group: {
        _id: {
            "noAlokasi": "$noAlokasi",
            "supplierName": "$supplierName",
            "buyerName": "$buyerName",
            "sumQuota": "$sumQuota",
            
        },
        reserved: {
            $sum: "$reserved"
        },
        realisasi: {
            $sum: "$realisasi"
        },
        qtyPO: {
            $sum: "$qtyPO"
        }
    }
}, {
    $project: {
        _id: 0,
        "noAlokasi": "$_id.noAlokasi",
        "supplierName": "$_id.supplierName",
        "buyerName": "$_id.buyerName",
        "sumQuota": "$_id.sumQuota",
        reserved: "$reserved",
        realisasi: "$realisasi",
        qtyPO: "$qtyPO"
    }
}, {
    $lookup: {
        from: "m_new_alokasi_bulanan_kontrak",
        let: {
            noAlokasi: "$noAlokasi"
        },
        pipeline: [
            {
                $match: {
                    $expr: {
                        $and: [
                            {
                                $eq: ["$_id", "$$noAlokasi"]
                            }
                        ]
                    }
                }
            },
            {
                $unwind: "$listSKU"
            },
            {
                $project: {
                    _id: 0,
                    sku: "$listSKU.namaSku",
                    category: "$categoryLv1Name"
                }
            }
        ],
        as: "sku"
    }
}, {
    $unwind: "$sku"
}, {
    $project: {
        "UID": "$buyerName",
        "Penyedia": "$supplierName",
        "Kategori": "$sku.category",
        "Nama SKU": "$sku.sku",
				"Alokasi Terbit": "$sumQuota",
        "Reserved": "$reserved",
        "Realisasi": "$realisasi",
        "Qty PO": "$qtyPO",
        "noAlokasi": "$noAlokasi",
        
    }
}])




