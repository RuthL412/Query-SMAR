db.m_kontrak_pengadaan.aggregate([
    {
        $match: {
noKontrak: { 
$in:[
"0040.PJ/DAN.01.03/F01020000/2026",
"0046.PJ/DAN.01.03/F01020000/2026",
"0048.PJ/DAN.01.03/F01020000/2026",
"0049.PJ/DAN.01.03/F01020000/2026",
"0050.PJ/DAN.01.03/F01020000/2026",
"0052.Pj/DAN.01.03/F01020000/2026",
"0054.PJ/DAN.01.03/F01020000/2026",
"0060.Pj/DAN.01.03/F01020000/2026",
"0345.Pj/DAN.01.03/F01020000/2026",
"0351.Pj/DAN.01.03/F01020000/2026",
"0351.Pj/DAN.01.03/F01020000/2026",
"0351.Pj/DAN.01.03/F01020000/2026",
"0359.Pj/DAN.01.03/F01020000/2026",
"0362.Pj/DAN.01.03/F01020000/2026",
"1904.Pj/DAN.01.01/F01020000/2025",
"1904.Pj/DAN.01.01/F01020000/2025",
"1916.Pj/DAN.01.01/F01020000/2025",
"1916.Pj/DAN.01.01/F01020000/2025",
"1918.Pj/DAN.01.01/F01020000/2025",
"1918.Pj/DAN.01.01/F01020000/2025",
"1918.Pj/DAN.01.01/F01020000/2025",
"1918.Pj/DAN.01.01/F01020000/2025",
"1918.Pj/DAN.01.01/F01020000/2025",
"2009.Pj/DAN.01.01/F01020000/2025",
"2009.Pj/DAN.01.01/F01020000/2025",
"2009.Pj/DAN.01.01/F01020000/2025",
"2009.Pj/DAN.01.01/F01020000/2025",
"2012.PJ/DAN.01.01/F01020000/2025",
"2012.PJ/DAN.01.01/F01020000/2025",
"2012.PJ/DAN.01.01/F01020000/2025",
"2012.PJ/DAN.01.01/F01020000/2025",
"2025.Pj/DAN.01.01/F01020000/2025",
"2044.Pj/DAN.01.01/F01020000/2025",
"2045.Pj/DAN.01.01/F01020000/2025",
"2045.Pj/DAN.01.01/F01020000/2025",
"2045.Pj/DAN.01.01/F01020000/2025",
"2046.Pj/DAN.01.01/F01020000/2025",
]
},
            first: true,
//             status: {
//                 $in: ["AKTIF", "AKTIF_AMD"]
//             }
            //       noKontrak: "0055.Pj/DAN.01.03/F01020000/2026"
        }
    },
    {
        $project: {
            noKontrak: 1,
            supplierName: 1,
            status: 1,
            supplierId: 1,
            startDateKontrak: 1,
            endDateKontrak: 1
        }
    },
    // Lookup 1
    {
        $lookup: {
            from: "m_new_alokasi_bulanan_kontrak",
            let: {
                kontrak: "$noKontrak"
            },
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $in: ["$$kontrak", "$details.noKontrak"]
                        }
                    }
                },
                {
                    $project: {
                        _id: 1
                    }
                }
            ],
            as: "bulanan"
        }
    },
    // Lookup 2
    {
        $lookup: {
            from: "m_new_alokasi_kontrak",
            let: {
                kontrak: "$noKontrak"
            },
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $in: ["$$kontrak", "$details.noKontrak"]
                        }
                    }
                },
                {
                    $project: {
                        _id: 1
                    }
                }
            ],
            as: "inex"
        }
    },
    // Gabungkan dan ekstrak ID alokasi secara langsung
    {
        $addFields: {
            alokasi: {
                $concatArrays: ["$bulanan._id", "$inex._id"]
            }
        }
    },
    // Lookup 3: t_purchase_order
    {
        $lookup: {
            from: "t_purchase_order",
            let: {
                noalokasi: "$alokasi",
                supplier: "$supplierId"
            },
            pipeline: [
                {
                    $match: {
                        buyerId: {
                            $in: [
                                "pln_kw_uiw_bangka_belitung",
                                "pln_kw_uiw_s2jb",
                                "pln_kd_uid_lampung",
                                "pln_kd_uid_jakarta_raya",
                                "pln_kw_uiw_kalselteng",
                                // "1e528304-6543-437c-9965-bde9a26bd675",
                                // "408c011b-3f39-42cd-a16b-864ad9e8993f",
                            ]
                        },
                        $expr: {
                            $and: [
                                // Mengecek apakah ada irisan antara array details.noAlokasi dan array $$noalokasi
                                {
                                    $gt: [
                                        {
                                            $size: {
                                                $setIntersection: ["$details.noAlokasi", "$$noalokasi"]
                                            }
                                        },
                                        0
                                    ]
                                },
                                // Aktifkan jika mau filter berdasarkan supplierId
                                {
                                    $eq: ["$supplierId", "$$supplier"]
                                }
                            ]
                        }
                    }
                },
                {
                    $project: {
                        _id: 1,
                        nopoAms: 1,
                        status: 1,
                        noPoSAP: 1,
                        noOA: 1,
                        supplierName: 1,
                        buyerName: 1,
                        poEffectiveDateStart: 1
                    }
                }
            ],
            as: "PO"
        }
    },
    // Clean up
    {
        $project: {
            _id: 0,
            noKontrak: 1,
            supplierName: 1,
            startDateKontrak: 1,
            endDateKontrak: 1,
            PO: 1
            //       supplierId: 1,
            //       alokasi: 1,
            // 			po:"$PO._id"
        }
    },
		{$unwind:"$PO"},
		{
		$group:{
		_id:{
		            noKontrak: "$noKontrak",
            supplierName: "$supplierName",
            startDateKontrak: "$startDateKontrak",
            endDateKontrak: "$endDateKontrak",
						                buyerName: "$PO.buyerName",
            noOA: "$PO.noOA",
		}
		}
		},
		{$project:{
		_id:0,
		                noKontrak: "$_id.noKontrak",
                supplierName: "$_id.supplierName",
								                buyerName: "$_id.buyerName",
																
                noOA: "$_id.noOA",
                startDateKontrak: "$_id.startDateKontrak",
                endDateKontrak: "$_id.endDateKontrak",
		}},
		{$sort:{
		noKontrak:1
		}},
])