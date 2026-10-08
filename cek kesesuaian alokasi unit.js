db.m_new_alokasi_bulanan_kontrak_unit.aggregate(
    [{
        $match: {
            noAlokasi: {
                $in: [
                    "NAB20260119-100127"
                ]
            },
            
        }
    }, {
        $unwind: "$listBreakdown"
    }, {
        $group: {
            _id: {
                _id: "$_id",
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
            //             _id: 0,
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
                        $eq: ["$quotaDalam", "$availableQuotaDalam"]
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
    }]
)