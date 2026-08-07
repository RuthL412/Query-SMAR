db.t_purchase_order.aggregate([
    {
        $match: {
// 				_id:/PO2026/i,
// 				status:{$nin:[/reject/i]},
$or:[{srmSubBidang:/lisdes/i},{isLisdes:true}],
//             _id: {
//                 $in: [
//                     "PO202600009426",
//                     "PO202600007937",
//                     "PO202100001405",
//                     
//                 ]
//             }
                        $expr: {
                            $and: [
// 														{
//                                 $eq: [{
//                                     $month: "$createdDate"
//                                 }, 10] // 1 untuk Januari
//                             }, 
														{
                                $eq: [{
                                    $year: "$createdDate"
                                }, 2026] // 1 untuk Januari},]}
                            }]
                        },
        },
        
    },
    {
        $unwind: "$details"
    },
    {
        $project: {
            _id: "$_id",
            "noPoSAP": {
                $ifNull: ["$noPoSAP", "-"]
            },
            "isLisdes": {
                $ifNull: ["$isLisdes", false]
            },
            "statusInvoicePayment": {
                $ifNull: ["$statusInvoicePayment", "-"]
            },
            "srmSubBidang": {
                $ifNull: ["$srmSubBidang", "-"]
            },
            trxType: "$trxType",
            supplierName: "$supplierName",
            buyerId: "$buyerId",
            createdDate: "$createdDate",
            purchaseOrderLogList: "$purchaseOrderLogList",
            statusDate: "$statusDate",
            supplierId: "$supplierId",
            supplierName: "$supplierName",
            buyerCode: "$buyerCode",
            buyerName: "$buyerName",
            picUserId: "$picUserId",
            nopoAms: "$nopoAms",
            status: "$status",
            poSendSupplierDate: "$poSendSupplierDate",
            "bankGaransi": {
                $ifNull: ["$bankGaransi", {
                    "noBankGaransi": "-",
                    "tanggalBankGaransi": ISODate("2000-08-11T17:00:00.000Z"),
                    "lampiran": "-",
                    
                }]
            },
            "babgConfirmedDate": {
                $ifNull: ["$babgConfirmedDate", ISODate("2000-08-11T17:00:00.000Z")]
            },
            "details": "$details",
            rating: {
                $ifNull: ["$rating", {
                    "deliveryTotal": "-",
                    "responsivenessTotal": "-",
                    "qualityTotal": "-",
                    "summaryTotal": "-",
                    "ratingCount": "-",
                    "deliveryAverage": "-",
                    "responsivenessAverage": "-",
                    "qualityAverage": "-",
                    "summaryAverage": "-",
                    "updated": "-",
                    
                }]
            },
            
        }
    },
    {
        $group: {
            _id: {
                "isLisdes": "$isLisdes",
                "statusInvoicePayment": "$statusInvoicePayment",
                "srmSubBidang": "$srmSubBidang",
                _id: "$_id",
                trxType: "$trxType",
                noPoSAP: "$noPoSAP",
                tglPO: "$createdDate",
                kirimPO: {
                    $ifNull: ["$poSendSupplierDate", "-"]
                },
                supplierId: "$supplierId",
                supplierName: "$supplierName",
                buyerId: "$buyerId",
                buyerCode: "$buyerCode",
                buyerName: "$buyerName",
                picUserId: "$picUserId",
                nopoAms: "$nopoAms",
                "unitId": "$details.unitId",
                "unitName": "$details.unitName",
                "sku": "$details.sku",
                "noSap": "$details.noSap",
                "productId": "$details.productId",
                "skuName": "$details.skuName",
                "qty": "$details.qty",
                "noAlokasi": "$details.noAlokasi",
                "hargaSatuan": "$details.hargaSatuan",
                "hargaBarangTotal": "$details.hargaBarangTotal",
                "max_pengiriman": "60",
                "biayaKirimSatuan": "$details.biayaKirimSatuan",
                "ppn": "$details.ppn",
                "hargaTotal": "$details.hargaTotal",
                maxReceivedDay: "$details.maxReceivedDay",
                "catatan": "$details.catatan",
                status: "$status",
                "unitName": "$details.unitName",
                "unitCode": "$details.unitCode",
                poSendSupplierDate: "$poSendSupplierDate",
                "babgConfirmedDate": "$babgConfirmedDate",
                
            },
            noBankGaransi: {
                $first: "$bankGaransi.noBankGaransi"
            },
            tanggalBankGaransi: {
                $first: "$bankGaransi.tanggalBankGaransi"
            },
            msb: {
                $push: "$purchaseOrderLogList"
            },
            rating: {
                $push: "$rating"
            }
        }
    },
    {
        $lookup: {
            from: "m_new_alokasi_bulanan_kontrak",
            let: {
                alokasi: "$_id.noAlokasi",
                supplier: "$_id.supplierId",
                buyer: "$_id.buyerId",
                
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
        $lookup: {
            from: "m_new_alokasi_kontrak",
            let: {
                alokasi: "$_id.noAlokasi",
                supplier: "$_id.supplierId",
                buyer: "$_id.buyerId",
                
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
        $addFields: {
            alokasiUnit: {
                $cond: {
                    if : {
                        $eq: ["$_id.trxType", "BULANAN"]
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
        $unwind: "$msb"
    },
    {
        $project: {
            "isLisdes": "$_id.isLisdes",
            "statusInvoicePayment": "$_id.statusInvoicePayment",
            "srmSubBidang": "$_id.srmSubBidang",
            "noAlokasi": "$_id.noAlokasi",
            "noKontrak": "$alokasiUnit.noKontrak",
            _id: "$_id._id",
            noPoSAP: "$_id.noPoSAP",
            tglPO: {
                $add: ["$_id.tglPO", 7 * 60 * 60 * 1000]
            },
            kirimPO: {
                $cond: {
                    
                    if : {
                        $ne: ["$_id.kirimPO", "-"]
                    },
                    then: {
                        $add: ["$_id.kirimPO", 7 * 60 * 60 * 1000]
                    },
                    else : "-"
                }
            },
            kodePenyedia: "-",
            kodeUnitSAP: "-",
            supplierName: "$_id.supplierName",
            buyerCode: "$_id.buyerCode",
            buyerName: "$_id.buyerName",
            picUserId: "$_id.picUserId",
            picUserName: {
                $cond: {
                    if : {
                        $ifNull: [{
                            $arrayElemAt: ["$msb.createdName", 0]
                        }, false]
                    },
                    then: {
                        $arrayElemAt: ["$msb.createdName", 0]
                    },
                    else : "-"
                }
                    //                $arrayElemAt: ["$msb.createdName", 1]
            },
            nopoAms: "$_id.nopoAms",
            rating: {
                
                $cond: {
                    if : {
                        $ifNull: ["$rating", false]
                    },
                    then: {
                        $arrayElemAt: ["$rating.summaryAverage", 0]
                    },
                    else : "-",
                    
                }
            },
            "unitId": "$_id.unitId",
            "unitName": "$_id.unitName",
            "sku": "$_id.sku",
            "noSap": "$_id.noSap",
            "productId": "$_id.productId",
            "skuName": "$_id.skuName",
            "qty": "$_id.qty",
            "hargaSatuan": "$_id.hargaSatuan",
            "hargaBarangTotal": "$_id.hargaBarangTotal",
            "maxReceivedDay": "$_id.maxReceivedDay",
            "subTotalPO": {
                $subtract: ['$_id.hargaTotal', '$_id.ppn']
            },
            "biayaKirimSatuan": "$_id.biayaKirimSatuan",
            "ppn": "$_id.ppn",
            "hargaTotal": "$_id.hargaTotal",
            "catatan": "$_id.catatan",
            status: "$_id.status",
            noBankGaransi: {
                
                $cond: {
                    if : {
                        $ifNull: ["$noBankGaransi", false]
                    },
                    then: "$noBankGaransi",
                    else : "-",
                    //                    else : "-",
                }
            },
            tanggalBankGaransi: {
                
                $cond: {
                    if : {
                        $gt: [{
                            $year: "$tanggalBankGaransi"
                        }, 2009]
                    },
                    then: {
                        $add: ["$tanggalBankGaransi", 7 * 60 * 60 * 1000]
                    },
                    else : "-",
                    
                }
            },
            uploadBankGaransi: {
                
                $cond: {
                    if : {
                        $gt: [{
                            $year: "$tanggalBankGaransi"
                        }, 2009]
                    },
                    then: {
                        $add: ["$tanggalBankGaransi", 7 * 60 * 60 * 1000]
                    },
                    else : "-",
                    
                }
            },
            "unitName": "$_id.unitName",
            "unitCode": "$_id.unitCode",
            msb: {
                $ifNull: [
                    {
                        $arrayElemAt: [
                            {
                                $map: {
                                    input: {
                                        $filter: {
                                            input: "$msb",
                                            as: "x",
                                            cond: {
                                                $eq: ["$$x.status", "APPROVED_MSB"]
                                            }
                                        }
                                    },
                                    as: "x",
                                    in: "$$x.createdName"
                                }
                            },
                            0
                        ]
                    },
                    "-"
                ]
            },
            msbTanggal: {
                $ifNull: [
                    {
                        $arrayElemAt: [
                            {
                                $map: {
                                    input: {
                                        $filter: {
                                            input: "$msb",
                                            as: "x",
                                            cond: {
                                                $eq: ["$$x.status", "APPROVED_MSB"]
                                            }
                                        }
                                    },
                                    as: "x",
                                    in: "$$x.createdDate"
                                }
                            },
                            0
                        ]
                    },
                    "-"
                ]
            },
            srm: {
                $ifNull: [
                    {
                        $arrayElemAt: [
                            {
                                $map: {
                                    input: {
                                        $filter: {
                                            input: "$msb",
                                            as: "x",
                                            cond: {
                                                $eq: ["$$x.status", "APPROVED_SRM"]
                                            }
                                        }
                                    },
                                    as: "x",
                                    in: "$$x.createdName"
                                }
                            },
                            0
                        ]
                    },
                    "-"
                ]
            },
            srmTanggal: {
                $ifNull: [
                    {
                        $arrayElemAt: [
                            {
                                $map: {
                                    input: {
                                        $filter: {
                                            input: "$msb",
                                            as: "x",
                                            cond: {
                                                $eq: ["$$x.status", "APPROVED_SRM"]
                                            }
                                        }
                                    },
                                    as: "x",
                                    in: "$$x.createdDate"
                                }
                            },
                            0
                        ]
                    },
                    "-"
                ]
            },
            gm: {
                $ifNull: [
                    {
                        $arrayElemAt: [
                            {
                                $map: {
                                    input: {
                                        $filter: {
                                            input: "$msb",
                                            as: "x",
                                            cond: {
                                                $eq: ["$$x.status", "APPROVED_GM"]
                                            }
                                        }
                                    },
                                    as: "x",
                                    in: "$$x.createdName"
                                }
                            },
                            0
                        ]
                    },
                    "-"
                ]
            },
            gmTanggal: {
                $ifNull: [
                    {
                        $arrayElemAt: [
                            {
                                $map: {
                                    input: {
                                        $filter: {
                                            input: "$msb",
                                            as: "x",
                                            cond: {
                                                $eq: ["$$x.status", "APPROVED_GM"]
                                            }
                                        }
                                    },
                                    as: "x",
                                    in: "$$x.createdDate"
                                }
                            },
                            0
                        ]
                    },
                    "-"
                ]
            },
            poSendSupplierDate: {
                $cond: {
                    if : {
                        $ifNull: ["$_id.poSendSupplierDate", false]
                    },
                    then: "$_id.poSendSupplierDate",
                    else : "-"
                }
            },
            tanggalConfirmPO: {
                $ifNull: [
                    {
                        $arrayElemAt: [
                            {
                                $map: {
                                    input: {
                                        $filter: {
                                            input: "$msb",
                                            as: "x",
                                            cond: {
                                                $eq: ["$$x.status", "APPROVED_SUPPLIER"]
                                            }
                                        }
                                    },
                                    as: "x",
                                    in: "$$x.createdDate"
                                }
                            },
                            0
                        ]
                    },
                    "-"
                ]
            },
            //             uploadBankGaransi: {
            //                         $ifNull: ["$tanggalBankGaransi", false]
            //                     },
            //                     then: {
            //                         $add: [{
            //                             $arrayElemAt: ["$msb.createdDate", 6]
            //                         }, 7 * 60 * 60 * 1000],
            //                         
            //                     },
            //                     else : "-",
            //                     
            //                 }
            //             },
            babgConfirmedDate: {
                
                $cond: {
                    if : {
                        $ifNull: ["$_id.babgConfirmedDate", false]
                    },
                    then: {
                        $add: ["$_id.babgConfirmedDate", 7 * 60 * 60 * 1000]
                    },
                    else : "-",
                    
                }
            },
            jumlahStok: "$marketCond.jumlahStok",
            mdp: "$marketCond.mdp",
            stokPenyedia: "$marketCond.stokPenyedia",
            alokasiStok: "$marketCond.alokasiStok",
            rop: "$marketCond.rop",
            maxStock: "$marketCond.maxStock",
            //            marketCond: "$marketCond",
        }
    },
    {
        $lookup: {
            from: "t_delivery_order",
            let: {
                idPO: "$_id",
                skuId: "$sku",
                unitId: "$unitId",
                productId: "$productId",
                
            },
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $and: [{
                                $eq: ["$nopo", "$$idPO"]
                            }, {
                                $eq: ["$unitId", "$$unitId"]
                            }, ]
                        }
                    }
                },
                {
                    $project: {
                        _id: "$_id",
                        submitDate: "$submitDate",
                        noekspedisi: "$noekspedisi",
                        namaKurir: "$namaKurir",
                        namaEkspedisi: "$namaEkspedisi",
                        etd: "$etd",
                        eta: "$eta",
                        unitCode: "$unitCode",
                        unitName: "$unitName",
                        receiveByName: "$receivedByName",
                        detail: "$detail",
                        rating: {
                            
                            $cond: {
                                if : {
                                    $ifNull: ["$rating", false]
                                },
                                then: "$rating",
                                else : [{
                                    
                                    "deliveryTotal": 0,
                                    "responsivenessTotal": 0,
                                    "qualityTotal": 0,
                                    "summaryTotal": 0,
                                    "ratingCount": 0,
                                    "deliveryAverage": 0,
                                    "responsivenessAverage": 0,
                                    "qualityAverage": 0,
                                    "summaryAverage": 0,
                                    "updated": 0,
                                    
                                }],
                                
                            }
                        },
                        
                    }
                },
                {
                    $unwind: "$detail"
                },
                {
                    $unwind: "$rating"
                },
                {
                    $group: {
                        //                        {
                        _id: {
                            _id: "$_id",
                            doKirim: "$submitDate",
                            qtyKirim: "$detail.qty",
                            tanggalDiterima: "$detail.tanggalDiterima",
                            qtyTerima: "$detail.qtyTerima",
                            noekspedisi: "$noekspedisi",
                            namaKurir: "$namaKurir",
                        namaEkspedisi: "$namaEkspedisi",
                            etd: "$etd",
                            eta: "$eta",
                            tanggalTerima: "$detail.tanggalDiterima",
                            unitCode: "$unitCode",
                            unitName: "$unitName",
                            NamaUserPenggunaUnitPelaksana: "-",
                            receiveByName: "$receivedByName",
                            catatan: "-",
                            statusDO: "$detail.status",
                            skuDO: "$detail.sku",
                            itemId: "$detail.itemId",
                            
                        },
                        grSAP: {
                            $push: "$detail.noGrSAP"
                        },
                        rating: {
                            $push: "$rating"
                        },
                        //                        }
                    }
                },
                {
                    $project: {
                        _id: "$_id._id",
                        doKirim: {
                            $add: ["$_id.doKirim", 7 * 60 * 60 * 1000]
                        },
                        qtyKirim: "$_id.qtyKirim",
                        tanggalDiterima: {
                            $cond: {
                                if : {
                                    $ifNull: ["$_id.tanggalDiterima", false],
                                    
                                },
                                then: {
                                    $add: ["$_id.tanggalDiterima", 7 * 60 * 60 * 1000]
                                },
                                else : "-"
                            }
                        },
                        qtyTerima: {
                            $cond: {
                                if : {
                                    $ifNull: ["$_id.qtyTerima", false],
                                    
                                },
                                then: "$_id.qtyTerima",
                                else : "-"
                            }
                        },
                        noekspedisi: "$_id.noekspedisi",
                        namaKurir: {
                            $cond: {
                                if : {
                                    $ifNull: ["$_id.namaKurir", false],
                                    
                                },
                                then: "$_id.namaKurir",
                                else : "-"
                            }
                        },
												namaEkspedisi: {
                            $cond: {
                                if : {
                                    $ifNull: ["$_id.namaEkspedisi", false],
                                    
                                },
                                then: "$_id.namaEkspedisi",
                                else : "-"
                            }
                        },
                        etd: {
                            $add: ["$_id.etd", 7 * 60 * 60 * 1000]
                        },
                        eta: {
                            $add: ["$_id.eta", 7 * 60 * 60 * 1000]
                        },
                        unitCode: "$_id.unitCode",
                        unitName: "$_id.unitName",
                        NamaUserPenggunaUnitPelaksana: "-",
                        receiveByName: {
                            $cond: {
                                if : {
                                    $ifNull: ["$_id.receiveByName", false],
                                    
                                },
                                then: "$_id.receiveByName",
                                else : "-"
                            }
                        },
                        catatan: "-",
                        statusDO: "$_id.statusDO",
                        skuDO: "$_id.sku",
                        itemId: "$_id.itemId",
                        //                        rating: "$rating",
                            ratingDOSummary: {
                            
                            $cond: {
                                if : {
                                    $ifNull: ["$rating", false]
                                },
                                then: {
                                    $arrayElemAt: ["$rating.summaryAverage", 0]
                                },
                                else : "-",
                                
                            }
                        },
                        responsivenessAverage: {
                            
                            $cond: {
                                if : {
                                    $ifNull: ["$rating", false]
                                },
                                then: {
                                    $arrayElemAt: ["$rating.responsivenessAverage", 0]
                                },
                                else : "-",
                                
                            }
                        },
                        qualityAverage: {
                            
                            $cond: {
                                if : {
                                    $ifNull: ["$rating", false]
                                },
                                then: {
                                    $arrayElemAt: ["$rating.qualityAverage", 0]
                                },
                                else : "-",
                                
                            }
                        },
                        deliveryAverage: {
                            
                            $cond: {
                                if : {
                                    $ifNull: ["$rating", false]
                                },
                                then: {
                                    $arrayElemAt: ["$rating.deliveryAverage", 0]
                                },
                                else : "-",
                                
                            }
                        },
                        ratingMaterial: "0",
                        produkId: {
                            $cond: {
                                if : {
                                    $and: [{
                                        $eq: ["$detail.itemId", "$$productId"]
                                    }]
                                },
                                then: "$$productId",
                                else : null,
                                
                            }
                        },
                        noGrSAP: {
                            
                            $cond: {
                                if : {
                                    $ifNull: ["$_id.grSAP", false]
                                },
                                then: "$_id.grSAP",
                                else : "-",
                                
                            }
                        },
                        
                    }
                }
            ],
            as: "DO",
            
        }
    },
    {
        $project: {
            "isLisdes": "$isLisdes",
            "statusInvoicePayment": "$statusInvoicePayment",
            "srmSubBidang": "$srmSubBidang",
            "noAlokasi": "$noAlokasi",
            "noKontrak": "$noKontrak",
            _id: "$_id._id",
            _id: "$_id",
            noPoSAP: "$noPoSAP",
            tglPO: "$tglPO",
            kirimPO: "$kirimPO",
            kodePenyedia: "-",
            kodeUnitSAP: "-",
            supplierName: "$supplierName",
            buyerCode: "$buyerCode",
            buyerName: "$buyerName",
            picUserName: "$picUserName",
            picUserId: "$picUserId",
            nopoAms: "$nopoAms",
            rating: "$rating",
            "unitId": "$unitId",
            "unitName": "$unitName",
            "sku": "$sku",
            "noSap": "$noSap",
            "productId": "$productId",
            "skuName": "$skuName",
            "qty": "$qty",
            "hargaSatuan": "$hargaSatuan",
            "hargaBarangTotal": "$hargaBarangTotal",
            "maxReceivedDay": "$maxReceivedDay",
            "subTotalPO": "$subTotalPO",
            "biayaKirimSatuan": "$biayaKirimSatuan",
            "ppn": "$ppn",
            "hargaTotal": "$hargaTotal",
            "catatan": "$catatan",
            status: "$status",
            noBankGaransi: "$noBankGaransi",
            tanggalBankGaransi: "$tanggalBankGaransi",
            "unitName": "$unitName",
            "unitCode": "$unitCode",
            msb: "$msb",
            msbTanggal: "$msbTanggal",
            srm: "$srm",
            srmTanggal: "$srmTanggal",
            gm: "$gm",
            gmTanggal: "$gmTanggal",
            poSendSupplierDate: "$poSendSupplierDate",
            tanggalConfirmPO: "$tanggalConfirmPO",
            uploadBankGaransi: "$uploadBankGaransi",
            babgConfirmedDate: "$babgConfirmedDate",
            jumlahStok: "$jumlahStok",
            mdp: "$mdp",
            stokPenyedia: "$stokPenyedia",
            alokasiStok: "$alokasiStok",
            rop: "$rop",
            maxStock: "$maxStock",
            DO: {
                $cond: {
                    if : {
                        $gt: [{
                            $size: "$DO"
                        }, 0]
                    },
                    then: "$DO",
                    else : [{
                        "_id": "-",
                        "doKirim": "-",
                        "qtyKirim": "-",
                        "tanggalDiterima": "-",
                        "qtyTerima": "-",
                        "noekspedisi": "-",
                        "namaEkspedisi": "-",
                        "namaKurir": "-",
                        "etd": "-",
                        "eta": "-",
                        "unitCode": "-",
                        "unitName": "-",
                        "NamaUserPenggunaUnitPelaksana": "-",
                        "receiveByName": "-",
                        "catatan": "-",
                        "itemId": "-",
                        "ratingDOSummary": "-",
                        "responsivenessAverage": "-",
                        "qualityAverage": "-",
                        "deliveryAverage": "-",
                        "ratingMaterial": "-",
                        "produkId": "-",
                        "noGrSAP": "-",
                        "statusDO": "-",
                        
                    }],
                    
                }
            }
        }
    },
    {
        $unwind: "$DO"
    },
    {
        $group: {
            _id: {
                "isLisdes": "$isLisdes",
                "statusInvoicePayment": "$statusInvoicePayment",
                "srmSubBidang": "$srmSubBidang",
                "noAlokasi": "$noAlokasi",
                "noKontrak": "$noKontrak",
                _id: "$_id",
                noPoSAP: "$noPoSAP",
                tglPO: "$tglPO",
                kirimPO: "$kirimPO",
                kodePenyedia: "-",
                kodeUnitSAP: "-",
                supplierName: "$supplierName",
                buyerCode: "$buyerCode",
                buyerName: "$buyerName",
                picUserName: "$picUserName",
                picUserId: "$picUserId",
                nopoAms: "$nopoAms",
                rating: "$rating",
                "unitId": "$unitId",
                "unitName": "$unitName",
                "sku": "$sku",
                "noSap": "$noSap",
                "productId": "$productId",
                "skuName": "$skuName",
                "qty": "$qty",
                "hargaSatuan": "$hargaSatuan",
                "hargaBarangTotal": "$hargaBarangTotal",
                "maxReceivedDay": "$maxReceivedDay",
                "subTotalPO": "$subTotalPO",
                "biayaKirimSatuan": "$biayaKirimSatuan",
                "ppn": "$ppn",
                "hargaTotal": "$hargaTotal",
                "catatanPO": "$catatan",
                status: "$status",
                noBankGaransi: "$noBankGaransi",
                tanggalBankGaransi: "$tanggalBankGaransi",
                "unitName": "$unitName",
                "unitCode": "$unitCode",
                msb: "$msb",
                msbTanggal: "$msbTanggal",
                srm: "$srm",
                srmTanggal: "$srmTanggal",
                gm: "$gm",
                gmTanggal: "$gmTanggal",
                poSendSupplierDate: "$poSendSupplierDate",
                tanggalConfirmPO: "$tanggalConfirmPO",
                uploadBankGaransi: "$uploadBankGaransi",
                babgConfirmedDate: "$babgConfirmedDate",
                jumlahStok: "$jumlahStok",
                mdp: "$mdp",
                stokPenyedia: "$stokPenyedia",
                alokasiStok: "$alokasiStok",
                rop: "$rop",
                maxStock: "$maxStock",
                "noDO": "$DO._id",
                "doKirim": "$DO.doKirim",
                "qtyKirim": "$DO.qtyKirim",
                "tanggalDiterima": "$DO.tanggalDiterima",
                "qtyTerima": "$DO.qtyTerima",
                "noekspedisi": "$DO.noekspedisi",
                "namaKurir": "$DO.namaKurir",
                "namaEkspedisi": "$DO.namaEkspedisi",
                "etd": "$DO.etd",
                "eta": "$DO.eta",
                "unitCode": "$DO.unitCode",
                "unitName": "$DO.unitName",
                "NamaUserPenggunaUnitPelaksana": "$DO.NamaUserPenggunaUnitPelaksana",
                "receiveByName": "$DO.receiveByName",
                "catatan": "$DO.catatan",
                "itemId": "$DO.itemId",
                "ratingDOSummary": "$DO.ratingDOSummary",
                "responsivenessAverage": "$DO.responsivenessAverage",
                "qualityAverage": "$DO.qualityAverage",
                "deliveryAverage": "$DO.deliveryAverage",
                "ratingMaterial": "$DO.ratingMaterial",
                "produkId": "$DO.produkId",
                "noGrSAP": "$DO.noGrSAP",
                "statusDO": "$DO.statusDO",
                
            }
        }
    },
{
    $project: {
        _id: 0,
        "No PO": "$_id._id",
        "No PO SAP": "$_id.noPoSAP",
        "Tanggal PO": {
            $cond: {
                if : {
                    $or: [
                        {
                            $eq: ["$_id.tglPO", null]
                        },
                        {
                            $eq: ["$_id.tglPO", "-"]
                        }
                    ]
                },
                then: "-",
                else : {
                    $dateToString: {
                        format: "%d-%m-%Y",
                        date: "$_id.tglPO"
                    }
                }
            }
        },
        "Tanggal PO Dikirim": {
            $cond: {
                if : {
                    $or: [
                        {
                            $eq: ["$_id.kirimPO", null]
                        },
                        {
                            $eq: ["$_id.kirimPO", "-"]
                        }
                    ]
                },
                then: "-",
                else : {
                    $dateToString: {
                        format: "%d-%m-%Y",
                        date: "$_id.kirimPO"
                    }
                }
            }
        },
        "Nama Penyedia": "$_id.supplierName",
        "Nama Unit Pengguna": "$_id.buyerName",
        "Bidang": "$_id.srmSubBidang", // blm ada
        "Rating PO": "$_id.rating",
        "No AMS": "$_id.nopoAms",
        "No Kontrak": "$_id.noKontrak", // blm ada DONE
        "No Alokasi": "$_id.noAlokasi", // blm ada DONE
        "No SKU": "$_id.sku",
        "No Material SAP": "$_id.noSap",
        "Nama SKU": "$_id.skuName",
        "Qty PO": "$_id.qty",
        "Harga Satuan PO": "$_id.hargaSatuan",
        "Total Harga Satuan PO": "$_id.hargaBarangTotal",
        "Max Waktu Pengiriman": "$_id.maxReceivedDay",
        "Subtotal PO": "$_id.subTotalPO",
        "Biaya Kirim": "$_id.biayaKirimSatuan",
        "PPN": "$_id.ppn",
        "Total PO": "$_id.hargaTotal",
        "Tanggal BABG": {
            $cond: {
                if : {
                    $or: [
                        {
                            $eq: ["$_id.tanggalBankGaransi", null]
                        },
                        {
                            $eq: ["$_id.tanggalBankGaransi", "-"]
                        }
                    ]
                },
                then: "-",
                else : {
                    $dateToString: {
                        format: "%d-%m-%Y",
                        date: "$_id.tanggalBankGaransi"
                    }
                }
            }
        },
        "Kategori PO": "$_id.isLisdes", // blm ada, lisdes2an
        "Status PO": "$_id.status",
        "Status Payment": "$_id.statusInvoicePayment", // blm ada payment vip keknya
        "No DO": "$_id.noDO",
        "Tanggal DO": {
            $cond: {
                if : {
                    $or: [
                        {
                            $eq: ["$_id.doKirim", null]
                        },
                        {
                            $eq: ["$_id.doKirim", "-"]
                        }
                    ]
                },
                then: "-",
                else : {
                    $dateToString: {
                        format: "%d-%m-%Y",
                        date: "$_id.doKirim"
                    }
                }
            }
        },
        "Qty DO Kirim": "$_id.qtyKirim",
        "Qty DO Terima": "$_id.qtyTerima",
        "Tanggal Penerimaan DO": {
            $cond: {
                if : {
                    $or: [
                        {
                            $eq: ["$_id.tanggalDiterima", null]
                        },
                        {
                            $eq: ["$_id.tanggalDiterima", "-"]
                        }
                    ]
                },
                then: "-",
                else : {
                    $dateToString: {
                        format: "%d-%m-%Y",
                        date: "$_id.tanggalDiterima"
                    }
                }
            }
        },
        "Nama Pengguna UP3": "$_id.unitName",
        // "Tanggal Penerimaan DO": {
        //     $cond: {
        //         if : {
        //             $or: [
        //                 {
        //                     $eq: ["$_id.tanggalDiterima", null]
        //                 },
        //                 {
        //                     $eq: ["$_id.tanggalDiterima", "-"]
        //                 }
        //             ]
        //         },
        //         then: "-",
        //         else : {
        //             $dateToString: {
        //                 format: "%d-%m-%Y",
        //                 date: "$_id.tanggalDiterima"
        //             }
        //         }
        //     }
        // },
        // "Nama Pengguna Unit Pelaksana": "$_id.unitCode",
        // "Nama User Pengguna Unit Pelaksana": "$_id.unitName",
        // "NamaUserPenggunaUnitPelaksana": "$_id.NamaUserPenggunaUnitPelaksana",
        // "Nama Persetujuan Pengguna (Manager)": "$_id.msb",
        "Tanggal Persetujuan Pengguna (Manager)": {
            $cond: {
                if : {
                    $or: [
                        {
                            $eq: ["$_id.msbTanggal", null]
                        },
                        {
                            $eq: ["$_id.msbTanggal", "-"]
                        }
                    ]
                },
                then: "-",
                else : {
                    $dateToString: {
                        format: "%d-%m-%Y",
                        date: "$_id.msbTanggal"
                    }
                }
            }
        },
        // "Nama Persetujuan Pengguna (SRM)": "$_id.srm",
        "Tanggal Persetujuan Pengguna (SRM)": {
            $cond: {
                if : {
                    $or: [
                        {
                            $eq: ["$_id.srmTanggal", null]
                        },
                        {
                            $eq: ["$_id.srmTanggal", "-"]
                        }
                    ]
                },
                then: "-",
                else : {
                    $dateToString: {
                        format: "%d-%m-%Y",
                        date: "$_id.srmTanggal"
                    }
                }
            }
        },
        // "Nama Persetujuan Pengguna (GM / PLH GM)": "$_id.gm",
        "Tanggal Persetujuan Pengguna (GM / PLH GM)": {
            $cond: {
                if : {
                    $or: [
                        {
                            $eq: ["$_id.gmTanggal", null]
                        },
                        {
                            $eq: ["$_id.gmTanggal", "-"]
                        }
                    ]
                },
                then: "-",
                else : {
                    $dateToString: {
                        format: "%d-%m-%Y",
                        date: "$_id.gmTanggal"
                    }
                }
            }
        },
        "Tanggal Confirm PO": {
            $cond: {
                if : {
                    $or: [
                        {
                            $eq: ["$_id.tanggalConfirmPO", null]
                        },
                        {
                            $eq: ["$_id.tanggalConfirmPO", "-"]
                        }
                    ]
                },
                then: "-",
                else : {
                    $dateToString: {
                        format: "%d-%m-%Y",
                        date: "$_id.tanggalConfirmPO"
                    }
                }
            }
        },
        "Tanggal Upload BABG": {
            $cond: {
                if : {
                    $or: [
                        {
                            $eq: ["$_id.uploadBankGaransi", null]
                        },
                        {
                            $eq: ["$_id.uploadBankGaransi", "-"]
                        }
                    ]
                },
                then: "-",
                else : {
                    $dateToString: {
                        format: "%d-%m-%Y",
                        date: "$_id.uploadBankGaransi"
                    }
                }
            }
        },
        "Tanggal Confirm BABG": {
            $cond: {
                if : {
                    $or: [
                        {
                            $eq: ["$_id.babgConfirmedDate", null]
                        },
                        {
                            $eq: ["$_id.babgConfirmedDate", "-"]
                        }
                    ]
                },
                then: "-",
                else : {
                    $dateToString: {
                        format: "%d-%m-%Y",
                        date: "$_id.babgConfirmedDate"
                    }
                }
            }
        },
        "Status DO": "$_id.statusDO",
        "Rating DO Responsiveness": "$_id.responsivenessAverage",
        "Rating DO Quality": "$_id.qualityAverage",
        "Rating DO Waktu Pengiriman": "$_id.deliveryAverage",
         "No Surat Jalan": "$_id.noekspedisi",
        "Nama Kurir": "$_id.namaKurir",
        "Nama Transportir": "$_id.namaEkspedisi",
        "Waktu Jalan": {
            $cond: {
                if : {
                    $or: [
                        {
                            $eq: ["$_id.etd", null]
                        },
                        {
                            $eq: ["$_id.etd", "-"]
                        }
                    ]
                },
                then: "-",
                else : {
                    $dateToString: {
                        format: "%d-%m-%Y",
                        date: "$_id.etd"
                    }
                }
            }
        },
        "Perkiraan sampai": {
            $cond: {
                if : {
                    $or: [
                        {
                            $eq: ["$_id.eta", null]
                        },
                        {
                            $eq: ["$_id.eta", "-"]
                        }
                    ]
                },
                then: "-",
                else : {
                    $dateToString: {
                        format: "%d-%m-%Y",
                        date: "$_id.eta"
                    }
                }
            }
        },
    }
}, 
    {
        $sort: {
            "No PO": 1
        }
    }
],{allowDiskUse:true})
//
//