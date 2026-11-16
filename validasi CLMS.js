db.m_kontrak_pengadaan.aggregate([
    {
        $match: {
noKontrak: { 
  $regex: "0255\\.Pj/DAN\\.01\\.01/F01020000/2025|0255\\.Pj/DAN\\.01\\.01/F06000000/2025|0345\\.PJ/DAN\\.01\\.01/F06000000/2025|0346\\.PJ/DAN\\.01\\.01/F06000000/2025|1950\\.Pj/DAN\\.01\\.01/F01020000/2024", 
  $options: "i" 
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
//             PO: 1
            //       supplierId: 1,
            //       alokasi: 1,
            // 			po:"$PO._id"
        }
    }
])