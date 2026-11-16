db.t_purchase_order.aggregate([
    {
        $match: {
            noPoSAP: {
                $in: [
                    
                    "8000028119",
                    "8000028120",
                    "8000028690",
                    "8000029577",
                    "3101677376",
                    "3101680979",
                    "3101695505",
                    "3101697177",
                    "3101698316",
                    "3101799284",
                    "3101799437",
                    "3101800577",
                    "3101804823",
                    "3101804831",
                    "3101804844",
                    "3101804852",
                    "3101804853",
                    "3101804856",
                    "3101806263",
                    "3500422161",
                    "3500458687",
                    "3500458731",
                    "3500458877",
                    "3500460823",
                    "3500461061",
                    "3500461127",
                    "3500464265",
                    "3500464272",
                    "3500464407",
                    "3500464408",
                    "3500470017",
                    "3500470605",
                    "3500472444",
                    "3500489547",
                    "3500491721",
                    "3500492951",
                    "3500493419",
                    "3500493432",
                    "3500493445",
                    "3500494218",
                    "3500494408",
                    "3500495986",
                    "3500496232",
                    "3500496862",
                    "3500497197",
                    "3500497305",
                    "8000026998",
                    "8000027492",
                    "8000027493",
                    "8000028077",
                    "8000028558",
                    "8000028559",
                    "8000028560",
                    "8000028561",
                    "8000028562",
                    "3101793631",
                    "3101834046",
                    "3500465644",
                    "3500465977",
                    "3500479819",
                    "3500482062",
                    "3500482211",
                    "3500482250",
                    "3500484906",
                    "3500484968",
                    "3500484971",
                    "3500484990",
                    "3500485093",
                    "3500495450",
                    "3500496783",
                    "3500497130",
                    "3500497952",
                    "3500498434",
                    "8000006155",
                    "8000017333",
                    "8000017334",
                    "8000027291",
                    "8000027745",
                    "8000027968",
                    "8000028412",
                    "8000028414",
                    "8000028726",
                    "8000028727",
                    "3500470248",
                    "3500470249",
                    "3500470250",
                    "3500470252",
                    "8000017211",
                    "8000017212",
                    "8000017213",
                    "8000017214",
                    "8000017215",
                    "8000017218",
                    "8000027578",
                    "8000027581",
                    "8000027586",
                    "8000027587",
                    "8000027589",
                    "8000028540",
                    "8000028541",
                    "8000028542",
                    "8000028543",
                    "8000028544",
                    "8000028545",
                    "8000028546",
                    "8000028547",
                    "8000028548",
                    "8000029106",
                    "8000029107",
                    "8000029108",
                    "8000029109",
                    "8000028651",
                    "8000028652",
                    "8000029509",
                    "8000029510",
                    "8000029574",
                    "4600083807",
                    "4600081240",
                    "4600081734",
                    "4600081734",
                    
                ]
            },
            
        },
        
    },
    {
        $project: {
            _id: 1,
            noOA: 1,
            "nopoAms": 1,
            "noPoSAP": 1,
            "poEffectiveDateStart": 1,
            "details.poEffectiveDateEnd": 1,
            status: 1,
            buyerId: 1,
            trxType: 1,
            buyerName: 1,
            supplierId: 1,
            "details.unitName": 1,
            "details.noAlokasi": 1,
            "details.sku": 1,
            "details.skuName": 1,
            // "details.maxReceivedDay": 1,
            
        }
    },
		{
    $addFields: {
      // Mengambil tanggal paling baru dari dalam array
      poEffectiveDateEnd: {
        $max: "$details.poEffectiveDateEnd"
      }
    }
  },
    {
        $unwind: {
            path: "$details",
            includeArrayIndex: "indexDetail"
        }
    },
    {
        $group: {
            _id: {
                poEffectiveDateEnd:"$poEffectiveDateEnd",
            "nopoAms": "$nopoAms",
            "noPoSAP": "$noPoSAP",
            "poEffectiveDateStart": "$poEffectiveDateStart",
                "nopo": "$_id",
                            // "nopo": "$_id.nopo",
            "noPoSAP": "$noPoSAP",
                "trxType": "$trxType",
                "noOA": "$noOA",
                "poSendSupplierDate": "$poSendSupplierDate",
                "status": "$status",
                "buyerId": "$buyerId",
                "buyerName": "$buyerName",
                "supplierName": "$supplierName",
                "supplierId": "$supplierId",
                "unitName": "$details.unitName",
                "noAlokasi": "$details.noAlokasi",
                "sku": "$details.sku",
                "skuName": "$details.skuName",
                // // "maxReceivedDay": "$details.maxReceivedDay",
                "index": "$indexDetail"
            }
        }
    },
    {
        $project: {
            _id: 0,
            "nopo": "$_id.nopo",
            "noPoSAP": "$_id.noPoSAP",
            "noOA": "$_id.noOA",
"poEffectiveDateEnd":"$_id.poEffectiveDateEnd",
"nopoAms":"$_id.nopoAms",
"noPoSAP":"$_id.noPoSAP",
"poEffectiveDateStart":"$_id.poEffectiveDateStart",            
            "status": "$_id.status",
            "buyerId": "$_id.buyerId",
            "buyerName": "$_id.buyerName",
            "supplierName": "$_id.supplierName",
            "supplierId": "$_id.supplierId",
            "unitName": "$_id.unitName",
            "noAlokasi": "$_id.noAlokasi",
            "sku": "$_id.sku",
            "trxType": "$_id.trxType",
            "skuName": "$_id.skuName",
            // // "maxReceivedDay": "$_id.maxReceivedDay",
            "index": "$_id.index",
            
        }
    },
    {
        $lookup: {
            from: "m_new_alokasi_kontrak",
            let: {
                alokasi: "$noAlokasi",
                supplier: "$supplierId",
                buyer: "$buyerId",
                
            },
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $and: [{
                                $eq: ["$_id", "$$alokasi"]
                            }]
                        }
                    }
                },
                {
                    $unwind: "$details",
                    
                },
                {
                    $match: {
                        $expr: {
                            $and: [{
                                $eq: ["$details.supplierId", "$$supplier"]
                            }]
                        }
                    }
                },
                {
                    $project: {
                        noAlokasi: "$noAlokasi",
                        noKontrak: "$details.noKontrak",
                        
                    }
                }
            ],
            as: "inEx",
            
        },
        
    },
    {
        $lookup: {
            from: "m_new_alokasi_bulanan_kontrak",
            let: {
                alokasi: "$noAlokasi",
                supplier: "$supplierId",
                buyer: "$buyerId",
                
            },
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $and: [{
                                $eq: ["$_id", "$$alokasi"]
                            }]
                        }
                    }
                },
                {
                    $unwind: "$details",
                    
                },
                {
                    $match: {
                        $expr: {
                            $and: [{
                                $eq: ["$details.supplierId", "$$supplier"]
                            }]
                        }
                    }
                },
                {
                    $project: {
                        noAlokasi: "$noAlokasi",
                        noKontrak: "$details.noKontrak",
                        
                    }
                }
            ],
            as: "bulanan",
            
        },
        
    },
    {
        $addFields: {
            alokasiUnit: {
                $cond: {
                    if : {
                        $eq: ["$trxType", "BULANAN"]
                    },
                    then: "$bulanan",
                    else : "$inEx"
                }
            }
        }
    },
    {
        $unwind: "$alokasiUnit"
    },
    {
        $project: {
            
            "poEffectiveDateEnd":"$poEffectiveDateEnd",
            "nopoAms":"$nopoAms",
            "noPoSAP":"$noPoSAP",
            "nopo":"$nopo",
            "poEffectiveDateStart":"$poEffectiveDateStart",
            "noOA": "$noOA",
            "uid": "$buyerName",
            "supplier": "$supplierName",
            "noKontrak": "$alokasiUnit.noKontrak",
            
        }
    },
    {
        
        $group: {
            _id: {
"poEffectiveDateEnd":"$poEffectiveDateEnd",
"nopoAms":"$nopoAms",
"noPoSAP":"$noPoSAP",
"nopo":"$nopo",
"poEffectiveDateStart":"$poEffectiveDateStart",
"noOA":"$noOA",
"uid":"$uid",
"supplier":"$supplier",
"noKontrak":"$noKontrak",
            }
        }
    },
    {
        $project: {
            _id: 0,
"poEffectiveDateEnd":"$_id.poEffectiveDateEnd",
"nopoAms":"$_id.nopoAms",
"noPoSAP":"$_id.noPoSAP",
"nopo":"$_id.nopo",
"poEffectiveDateStart":"$_id.poEffectiveDateStart",
"noOA":"$_id.noOA",
"uid":"$_id.uid",
"supplier":"$_id.supplier",
"noKontrakKhs":"$_id.noKontrak",
            
        }
    },
    {
        $lookup: {
            from: "m_kontrak_pengadaan",
            let: {
                kontrak: "$noKontrakKhs"
            },
            pipeline: [
                {
                    $match: {
                        first: true,
                        $expr: {
                            $eq: ["$$kontrak", "$noKontrak"]
                        }
                    }
                },
                {
                    $project: {
                        keterangan: 1,
                        _id: 0,
                        
                    }
                }
            ],
            as: "kontrak"
        }
    },
    {
        $unwind: "$kontrak"
    },
    {
        $project: {
            "noPoSAP":"$noPoSAP",
            "noKontrakKhs":"$noKontrakKhs",
            "noKr":"$nopoAms",
            namaKontrak: "$kontrak.keterangan",
            "validityStart":"$poEffectiveDateStart",
            "validtyEnd":"$poEffectiveDateEnd",
            " effectiveDate":"$poEffectiveDateStart",
// "nopo":"$nopo",
// "noOA":"$noOA",
// "uid":"$uid",
// "supplier":"$supplier",
        }
    }
]);

