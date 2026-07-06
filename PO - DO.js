db.t_purchase_order.aggregate([
    {
        $match: {
            _id: {
                $in: [
                    "PO202500009718",
                    "PO202500009721",
                    "PO202500010163",
                    "PO202500010752",
                    "PO202500011379",
                    "PO202500012791",
                    "PO202500012913",
                    "PO202500012945",
                    "PO202500013077",
                    "PO202500013080",
                    "PO202500013081"
                ]
            }
        }
    },
    {
        $unwind: "$details"
    },
    {
        $project: {
            _id: "$_id",
            noPoSAP: {
                $cond: {
                    if : {
                        $ifNull: ["$noPoSAP", false]
                    },
                    then: "$noPoSAP",
                    else : "-"
                }
            },
            createdDate: "$createdDate",
            statusDate: "$statusDate",
            supplierName: "$supplierName",
            buyerCode: "$buyerCode",
            buyerName: "$buyerName",
            picUserId: "$picUserId",
            nopoAms: "$nopoAms",
            status: "$status",
            poSendSupplierDate: "$poSendSupplierDate",
            details: "$details"
        }
    },
    // GROUP UTAMA (tanpa field aneh2)
        {
        $group: {
            _id: {
                _id: "$_id",
                noPoSAP: "$noPoSAP",
                tglPO: "$createdDate",
                kirimPO: "$statusDate",
                supplierName: "$supplierName",
                buyerCode: "$buyerCode",
                buyerName: "$buyerName",
                picUserId: "$picUserId",
                nopoAms: "$nopoAms",
                unitId: "$details.unitId",
                unitName: "$details.unitName",
                sku: "$details.sku",
                noSap: "$details.noSap",
                productId: "$details.productId",
                skuName: "$details.skuName",
                qty: "$details.qty",
                hargaSatuan: "$details.hargaSatuan",
                hargaBarangTotal: "$details.hargaBarangTotal",
                biayaKirimSatuan: "$details.biayaKirimSatuan",
                ppn: "$details.ppn",
                hargaTotal: "$details.hargaTotal",
                maxReceivedDay: "$details.maxReceivedDay",
                catatan: "$details.catatan",
                status: "$status",
                unitCode: "$details.unitCode",
                poSendSupplierDate: "$poSendSupplierDate"
            },
            
        }
    },
    {
        $project: {
            _id: "$_id._id",
            noPoSAP: "$_id.noPoSAP",
            tglPO: {
                $add: ["$_id.tglPO", 7 * 60 * 60 * 1000]
            },
            kirimPO: {
                $add: ["$_id.kirimPO", 7 * 60 * 60 * 1000]
            },
            supplierName: "$_id.supplierName",
            buyerCode: "$_id.buyerCode",
            buyerName: "$_id.buyerName",
            picUserId: "$_id.picUserId",
            nopoAms: "$_id.nopoAms",
            unitId: "$_id.unitId",
            unitName: "$_id.unitName",
            sku: "$_id.sku",
            noSap: "$_id.noSap",
            productId: "$_id.productId",
            skuName: "$_id.skuName",
            qty: "$_id.qty",
            hargaSatuan: "$_id.hargaSatuan",
            hargaBarangTotal: "$_id.hargaBarangTotal",
            maxReceivedDay: "$_id.maxReceivedDay",
            subTotalPO: {
                $subtract: ["$_id.hargaTotal", "$_id.ppn"]
            },
            biayaKirimSatuan: "$_id.biayaKirimSatuan",
            ppn: "$_id.ppn",
            hargaTotal: "$_id.hargaTotal",
            catatan: "$_id.catatan",
            status: "$_id.status",
            unitCode: "$_id.unitCode",
            poSendSupplierDate: "$_id.poSendSupplierDate",
            
        }
    },
    // LOOKUP DO (AMAN)
    {
        $lookup: {
            from: "t_delivery_order",
            let: {
                idPO: "$_id",
                unitId: "$unitId",
								skuId:"$skuId"
            },
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $and: [
                                {
                                    $eq: ["$nopo", "$$idPO"]
                                },
                                {
                                    $eq: ["$unitId", "$$unitId"]
                                }
                            ]
                        }
                    }
                },
                {
                    $unwind: {
                        path: "$detail",
                        includeArrayIndex: "indexDetail"
                    }
                },
                {
                    $project: {
                        _id: "$_id",
                        doKirim: {
                            $add: ["$submitDate", 7 * 60 * 60 * 1000]
                        },
                        qtyKirim: "$detail.qty",
                        qtyTerima: "$detail.qtyTerima",
                        noekspedisi: "$noekspedisi",
                        namaKurir: "$namaEkspedisi",
                        etd: {
                            $add: ["$etd", 7 * 60 * 60 * 1000]
                        },
                        eta: {
                            $add: ["$eta", 7 * 60 * 60 * 1000]
                        },
                        statusDO: "$detail.status",
                        noGrSAP: "$detail.noGrSAP",
                        index: "$indexDetail"
                    }
                }
            ],
            as: "DO"
        }
    },
    {
        $unwind: {
            path: "$DO",
            preserveNullAndEmptyArrays: true
        }
    },
    // FINAL OUTPUT
    {
        $group: {
            _id: {
                _id: "$_id",
                "No PO SAP": "$noPoSAP",
                "Tanggal PO": "$tglPO",
                "Tanggal PO Dikirim": "$kirimPO",
                "Nama Penyedia": "$supplierName",
                "Kode Unit Pengguna": "$buyerCode",
                "Nama Unit Pengguna": "$buyerName",
                "User Pengguna": "$picUserId",
                "Nomor AMS": "$nopoAms",
                "No SKU": "$sku",
                "No Material SAP": "$noSap",
                "No Produk Item": "$productId",
                "Nama SKU": "$skuName",
                "Qty PO": "$qty",
                "Harga Satuan PO": "$hargaSatuan",
                "Total Harga Satuan PO": "$hargaBarangTotal",
                "Subtotal PO": "$subTotalPO",
                "Biaya Kirim": "$biayaKirimSatuan",
                "PPN": "$ppn",
                "Total PO": "$hargaTotal",
                "Status PO": "$status",
                "No DO": "$DO._id",
                "Tanggal DO": "$DO.doKirim",
                "Qty DO Kirim": "$DO.qtyKirim",
                "Qty DO Terima": "$DO.qtyTerima",
                "No Surat Jalan": "$DO.noekspedisi",
                "Nama Transportir": "$DO.namaKurir",
                "ETD DO": "$DO.etd",
                "ETA DO": "$DO.eta",
                "Status DO": "$DO.statusDO",
                "No GR": "$DO.noGrSAP",
                "index": "$DO.index"
            }
        }
    },
       {
        $project: {
          
            _id:"$_id._id",
                       "No PO SAP": "$_id.No PO SAP",
                       "Tanggal PO": "$_id.Tanggal PO",
                       "Tanggal PO Dikirim": "$_id.Tanggal PO Dikirim",
                       "Nama Penyedia": "$_id.Nama Penyedia",
                       "Kode Unit Pengguna": "$_id.Kode Unit Pengguna",
                       "Nama Unit Pengguna": "$_id.Nama Unit Pengguna",
                       "User Pengguna": "$_id.User Pengguna",
                       "Nomor AMS": "$_id.Nomor AMS",
                       "No SKU": "$_id.No SKU",
                       "No Material SAP": "$_id.No Material SAP",
                       "No Produk Item": "$_id.No Produk Item",
                       "Nama SKU": "$_id.Nama SKU",
                       "Qty PO": "$_id.Qty PO",
                       "Harga Satuan PO": "$_id.Harga Satuan PO",
                       "Total Harga Satuan PO": "$_id.Total Harga Satuan PO",
                       "Subtotal PO": "$_id.Subtotal PO",
                       "Biaya Kirim": "$_id.Biaya Kirim",
                       "PPN": "$_id.PPN",
                       "Total PO": "$_id.Total PO",
                       "Status PO": "$_id.Status PO",
                       "No DO": "$_id.No DO",
                       "Tanggal DO": "$_id.Tanggal DO",
                       "Qty DO Kirim": "$_id.Qty DO Kirim",
                       "Qty DO Terima": "$_id.Qty DO Terima",
                       "No Surat Jalan": "$_id.No Surat Jalan",
                       "Nama Transportir": "$_id.Nama Transportir",
                       "ETD DO": "$_id.ETD DO",
                       "ETA DO": "$_id.ETA DO",
                       "Status DO": "$_id.Status DO",
                       "No GR": "$_id.No GR",
                       "index": "$_id.index"  ,
                  
        }
    },
		{$sort:{
		"No DO":1
		}}
])