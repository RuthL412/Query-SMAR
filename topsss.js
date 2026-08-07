//db.t_operasional.find({tipeOperasional:'REVISI_STOK_PENYEDIA',"listData.sku":"1582009921773","listData.supplierId": "pt_asata_utama_electrical_industries",});


db.t_operasional.aggregate([
    {
        $match: {
            tipeOperasional: 'REVISI_STOK_PENYEDIA',
            "listData.sku": "1636796091668",
            "listData.supplierId": "e74e3845-95fb-4e8b-bfc9-5bc64a8fc93f",
            
        }
    },
    {
        $unwind: "$listData"
    },
    {
        $group: {
            _id: "$listData.sku",
            stokRevisi: {
                $sum: "$listData.stokRevisi"
            },
            stokRevisiSebelum: {
                $sum: "$listData.stokRevisiSebelum"
            },
            
        }
    },
		{$project:{
		stokRevisi:"$stokRevisi",
		stokRevisiSebelum:"$stokRevisiSebelum",
		hasil:{
                                    $subtract: ["$stokRevisi", "$stokRevisiSebelum"]
                                }
		}}
])
