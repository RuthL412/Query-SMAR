db.m_new_alokasi_bulanan_kontrak_unit.aggregate(
    [{
        $match: {
            noAlokasi: {
                $in: [
                    "NAB20260112-143418","NAB20260112-163020","NAB20260119-100127","NAB20260119-155054","NAB20260119-171604","NAB20260119-172909","NAB20260120-092535","NAB20260120-092845","NAB20260120-093122","NAB20260122-101048","NAB20260122-101233","NAB20260122-101354","NAB20260122-101536","NAB20260122-101625","NAB20260122-133557","NAB20260122-134147","NAB20260122-134548","NAB20260122-134747","NAB20260122-134859","NAB20260122-135017","NAB20260122-135138","NAB20260122-135338","NAB20260122-135704","NAB20260122-135808","NAB20260122-135859","NAB20260122-135943","NAB20260122-140032","NAB20260122-140120","NAB20260123-140205","NAB20260123-140545","NAB20260123-140849","NAB20260123-141114","NAB20260123-141522","NAB20260123-141830"
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