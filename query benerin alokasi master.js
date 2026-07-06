db.m_new_alokasi_bulanan_kontrak.aggregate([
    {
        $match: {
            _id: {
                $in: [
                    "NAB20260112-143418","NAB20260112-163020","NAB20260119-100127","NAB20260119-155054","NAB20260119-171604","NAB20260119-172909","NAB20260120-092535","NAB20260120-092845","NAB20260120-093122","NAB20260122-101048","NAB20260122-101233","NAB20260122-101354","NAB20260122-101536","NAB20260122-101625","NAB20260122-133557","NAB20260122-134147","NAB20260122-134548","NAB20260122-134747","NAB20260122-134859","NAB20260122-135017","NAB20260122-135138","NAB20260122-135338","NAB20260122-135704","NAB20260122-135808","NAB20260122-135859","NAB20260122-135943","NAB20260122-140032","NAB20260122-140120","NAB20260123-140205","NAB20260123-140545","NAB20260123-140849","NAB20260123-141114","NAB20260123-141522","NAB20260123-141830"
                ]
            }
        }
    },
    {
        $unwind: {
            path: "$details",
            includeArrayIndex: "indexDetail" // <= menambahkan indeks
        }
    },
    {
        $group: {
            _id: {
                noAlokasi: "$_id",
                supplierName: "$details.supplierName",
                totalRealisasi: "$details.totalRealisasi",
                totalQuota: "$details.totalQuota",
                noKontrak: "$details.noKontrak",
                index: "$indexDetail" // <= tambahkan indeks ke _id grup
            }
        }
    },
    {
        $project: {
            _id: 0,
            noAlokasi: "$_id.noAlokasi",
            supplierName: "$_id.supplierName",
            totalRealisasi: "$_id.totalRealisasi",
            totalQuota: "$_id.totalQuota",
            noKontrak: "$_id.noKontrak",
            index: "$_id.index" // <= tampilkan indeks
        }
    },
    {
        $lookup: {
            from: "m_new_alokasi_bulanan_kontrak_unit",
            let: {
                alokasi: "$noAlokasi",
                supplier: "$supplierName",
                
            },
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $and: [{
                                $eq: ["$noAlokasi", "$$alokasi"]
                            }, {
                                $eq: ["$supplierName", "$$supplier"]
                            }]
                        }
                    }
                },
                {
                    $unwind: "$listBreakdown"
                },
                {
                    $group: {
                        _id: {
                            noAlokasi: "$noAlokasi",
                            supplierName: "$supplierName",
                            
                        },
                        "realisasi": {
                            $sum: "$listBreakdown.realisasi"
                        },
                        "quota": {
                            $sum: "$listBreakdown.quota"
                        },
                        
                    }
                },
                {
                    $project: {
                        realisasi: 1,
                        quota: 1,
                        _id: 0
                    }
                }
            ],
            as: "alokasi_unit"
        }
    },
    {
        $unwind: "$alokasi_unit"
    },
    {
        $project: {
             Ketquota2: {
                $cond: [
                    {
                        $eq: ["$totalQuota", "$alokasi_unit.quota"]
                    },
                    "AMAN",
                    "TIDAK AMAN"
                ]
            },
						Ketquota: {
                $cond: [
                    {
                        $eq: ["$totalRealisasi", "$alokasi_unit.realisasi"]
                    },
                    "AMAN",
                    "TIDAK AMAN"
                ]
            },
            noAlokasi: "$noAlokasi",
            supplierName: "$supplierName",
            totalRealisasi: "$totalRealisasi",
            totalQuota: "$totalQuota",
            noKontrak: "$noKontrak",
            index: "$index",
            realisasi: "$alokasi_unit.realisasi",
            quota: "$alokasi_unit.quota",
						 query: {
      $concat: [
        "db.m_new_alokasi_bulanan_kontrak.updateOne({_id:'",
        "$noAlokasi",
        "'},{$set:{'details.",
        { $toString: "$index" },
        ".totalRealisasi': NumberLong('",
        { $toString: "$alokasi_unit.realisasi" },
        "'),'details.",
        { $toString: "$index" },
        ".totalQuota': NumberLong('",
        { $toString: "$alokasi_unit.quota" },
        "') }})"
      ]
    }
            
        }
    },
		{$sort:{Ketquota2:-1}}
])