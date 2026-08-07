db.m_stock_properties_history.aggregate([
    {
        $match: {
            companyId: {$in:["pln_kd_uid_jawa_barat","pln_kd_uid_jawa_timur"]},
            savedDate: {
    $gte: ISODate("2025-10-01T00:00:00+07:00"),
    $lte:  ISODate("2025-10-02T00:00:00+07:00")
  },
						categoryLv1Id:{$in:[
						"biz063",
						 "biz064",
						 "biz065",
						]}
        }
    },
    {
        $project: {
				_id:0,
            "Nama Material": "$skuName",
            "Unit Induk": "$companyName",
            "Unit Pelaksana": "$unitName",
            "Tanggal Realisasi":  {
        $add: ["$savedDate", 7 * 60 * 60 * 1000]   // +7 jam
      },
            "Stok Temporary": "$stokTemp",
            "Stok": "$jumlahStok",
            "Stok MDP + Reserved": "$mdp",
            "ROP": "$rop",
            "Max": "$maxStock",
            
        }
    }
])

//db.m_stock_properties.find()