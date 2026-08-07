db.m_new_alokasi_bulanan_kontrak_unit.aggregate([
    {
        $match: {
            noAlokasi: "NAB20250415-084444",
        }
    },
    {
        $group: {
            _id: {
                noAlokasi: "$noAlokasi",
                supplierName: "$supplierName",
               
            },
						quota : {$sum:"$quota"},
                reservedQuota : {$sum:"$reservedQuota"},
                availableQuota : {$sum:"$availableQuota"},
                realisasi: {$sum:"$realisasi"},
                sumQuota : {$sum:"$sumQuota"}
        }
    },
    {
        $project: {
            _id: 0,
            noAlokasi: "$_id.noAlokasi",
            supplierName: "$_id.supplierName",
						quota : "$quota",
                reservedQuota : "$reservedQuota",
                availableQuota : "$availableQuota",
                realisasi: "$realisasi",
                sumQuota : "$sumQuota"
            
        }
    },
]);
//NAB20250415-084444	PT DUTA TERANG RUBBERINDO	3552	1055	2497	3682	7234
//NAB20250415-084444	PT DUTA TERANG RUBBERINDO	3552	0	3552	3682	7234