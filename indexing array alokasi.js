db.m_new_alokasi_bulanan_kontrak.aggregate([
    {
        $match: {
            _id: {
                $in: [
                    "NAB20250411-161503"
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
            noKontrak: "$_id.noKontrak",
            index: "$_id.index" // <= tampilkan indeks
        }
    },
    {
        $lookup: {
            from: "f",
            let: {
                alokasi: "$noAlokasi",
                supplier: "$supplierName"
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
                
            ],
            as: "tambahan"
        }
    },
		{$unwind:"$tambahan"},
		{$project:{
		"noAlokasi":"$noAlokasi",
"supplierName":"$supplierName",
"realisasi":"$totalRealisasi",
tambahan:"$tambahan.addRealisasi",
"noKontrak":"$noKontrak",
"index":"$index",
totalRealisasi:{$add:["$totalRealisasi",{$toInt:"$tambahan.addRealisasi"}]},
query:{$concat:[
"db.m_new_alokasi_bulanan_kontrak.updateOne({_id:'","$noAlokasi","'},{$set:{'details.",{$toString:"$index"},".totalRealisasi':NumberLong('",{$toString:{$add:["$totalRealisasi",{$toInt:"$tambahan.addRealisasi"}]}},"'),'details.",{$toString:"$index"},".tambahanRealisasi':NumberLong('",{$toString:"$tambahan.addRealisasi",},"')}});"
]}


		}},
    {
        $sort: {
            noAlokasi: 1,
						index:1
        }
    }
])