db.m_kontrak_pengadaan.aggregate([
    {
        $match: {
            "materials.categoryName": {
                $in: ["CUBICLE", "TRAFO DISTRIBUSI", "CONDUCTOR", "ISOLATOR", ]
            },
            status: {
                $in: ["AKTIF"]
            },
//						first:true,
            latest: true,
						kontrakParentId:{$exists:true}
        }
    },
    {
        $unwind: "$materials"
    },
    {
        $group: {
            _id: {
                noKontrak: "$noKontrak",
                penyedia: "$supplierName",
                kategori: "$materials.categoryName",
                variant: "$materials.skuName",
								startDateKontrak:"$startDateKontrak",
								endDateKontrak:"$endDateKontrak",
								volumeKontrak:"$materials.jumlahSuplai"
            }
        }
    },
    {
        $project: {
            _id: 0,
            noKontrak: "$_id.noKontrak",
            penyedia: "$_id.penyedia",
            kategori: "$_id.kategori",
            variant: "$_id.variant",
//						oi:'',
//						oo:'',
						startDateKontrak:"$_id.startDateKontrak",
						endDateKontrak:"$_id.endDateKontrak",
						oi:'',
						volumeKontrak:"$_id.volumeKontrak"
        }
    },
    {
        $sort: {
            noKontrak: 1,variant:1
        }
    }
])