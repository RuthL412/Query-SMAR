db.t_purchase_order.aggregate([
    {
        $match: {$expr: {
                $and: [{

                    $eq: [{
                        $year: "$createdDate"
                    }, 2024] // 1 untuk Januari},]}
                }]
            },
            status: {
                $in: ["FINISHED","PROCESSED_SUPPLIER","RECEIVED",]
            },
    },
    },
    {
        $unwind: "$details"
    },
    {
        $project: {
            _id: "$_id",
            createdDate: "$createdDate",
            categoryName: "$categoryName",
            supplierName: "$supplierName",
        //    buyerName: "$buyerName",
        //    status: "$status",
            poSendSupplierDate: "$poSendSupplierDate",
            "details": "$details",
            "categoryName": "$categoryName",
            
        }
    },
    {
        $group: {
            _id: {
                _id: "$_id",
                categoryName: "$categoryName",
                tglPO: "$createdDate",
                kirimPO: "$poSendSupplierDate",
                supplierName: "$supplierName",
                categoryName: "$categoryName",
                // // buyerName: "$buyerName",
                "unitId": "$details.unitId",
                "unitName": "$details.unitName",
                "sku": "$details.sku",
                "noSap": "$details.noSap",
                "skuName": "$details.skuName",
                "qty": "$details.qty",
                // // // status: "$status",
                // "unitName": "$details.unitName",
                // // "unitCode": "$details.unitCode",
                
            },
            
        },
        
    },
    {
        $project: {
            _id: "$_id._id",
            tglPO: {
                $add: ["$_id.tglPO", 7 * 60 * 60 * 1000]
            },
            kirimPO: {
                $cond: {
                    if : {
                        $ifNull: ["$_id.kirimPO", false]
                    },
                    then: {
                        $add: ["$_id.kirimPO", 7 * 60 * 60 * 1000]
                    },
                    else : "-",
                    
                }
            },
            supplierName: "$_id.supplierName",
            // // buyerCode: "$_id.buyerCode",
            // // buyerName: "$_id.buyerName",
            "unitId": "$_id.unitId",
            "unitName": "$_id.unitName",
            "sku": "$_id.sku",
            // "productId": "$_id.productId",
            "skuName": "$_id.skuName",
            "qty": "$_id.qty",
            // // status: "$status",
            categoryName: "$_id.categoryName",
            
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
            pipeline: [                {
                    $unwind: "$detail"
                },
                {
                    $match: {
                        $expr: {
                            $and: [{
                                $eq: ["$nopo", "$$idPO"]
                            }, {
                                $eq: ["$detail.sku", "$$skuId"]
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
                        detail: "$detail",
                        
                    }
                },
                {
                    $group: {
                        _id: {
                            _id: "$_id",
                            doKirim: "$submitDate",
                            // qtyKirim: "$detail.qty",
                            tanggalDiterima: "$detail.tanggalDiterima",
                            ratingDate: "$detail.ratingDate",
                            // qtyTerima: "$detail.qtyTerima",
                            // statusDO: "$detail.status",
                            skuDO: "$detail.sku",
                            
                        },
                        
                    },
                    
                },
                {
                    $project: {
                        _id: "$_id._id",
                        doKirim: {
                            $cond: {
                                if : {
                                    $ifNull: ["$_id.doKirim", false],
                                    
                                },
                                then: {
                                    $add: ["$_id.doKirim", 7 * 60 * 60 * 1000]
                                },
                                else : "-"
                            }
                        },
                        // // qtyKirim: "$_id.qtyKirim",
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
                        ratingDate: {
                            $cond: {
                                if : {
                                    $ifNull: ["$_id.ratingDate", false],
                                    
                                },
                                then: {
                                    $add: ["$_id.tanggalDiterima", 7 * 60 * 60 * 1000]
                                },
                                else : "-"
                            }
                        },
                        // qtyTerima: {
                            // $cond: {
                            //     if : {
                                    // $ifNull: ["$_id.qtyTerima", false],
                                    
                                // },
                                // then: "$_id.qtyTerima",
                        //         else : "-"
                        //     }
                        // },
                        statusDO: "$_id.statusDO",
                        
                    }
                }
            ],
            as: "DO",
            
        }
    },//])
    {
        $project: {
            _id: "$_id",
            tglPO: "$tglPO",
            kirimPO: "$kirimPO",
            supplierName: "$supplierName",
            // // buyerCode: "$buyerCode",
            // // buyerName: "$buyerName",
            unitId: "$unitId",
            unitName: "$unitName",
            sku: "$sku",
            productId: "$productId",
            skuName: "$skuName",
            qty: "$qty",
            // // status: "$status",
            categoryName: "$categoryName",
            DO: {
                $cond: {
                    if : {
                        $gt: [{
                            $size: "$DO"
                        }, 0]
                    },
                    then: "$DO",
                    else : [{
                        _id: "-",
                        doKirim: "-",
                        // qtyKirim: "-",
                        tanggalDiterima: "-",
                        ratingDate: "-",
                        // qtyTerima: "-",
                        statusDO: "-",
                        
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
						_id: "$_id",
            tglPO: "$tglPO",
            kirimPO: "$kirimPO",
            supplierName: "$supplierName",
            // // buyerCode: "$buyerCode",
            // // buyerName: "$buyerName",
            unitId: "$unitId",
            unitName: "$unitName",
            sku: "$sku",
            productId: "$productId",
            skuName: "$skuName",
            qty: "$qty",
            // // status: "$status",
            categoryName: "$categoryName",
            "noDO": "$DO._id",
            "doKirim": "$DO.doKirim",
            // // "qtyKirim": "$DO.qtyKirim",
            "tanggalDiterima": "$DO.tanggalDiterima",
            // // "qtyTerima": "$DO.qtyTerima",
            "ratingDate": "$DO.ratingDate",
                
            }
        }
    },
    {
        $project: {
                        _id: "$_id._id",
                        "No PO": "$_id._id",
//            tglPO: "$_id.tglPO",
            "No PO": "$_id.kirimPO",
            "Nama Penyedia": "$_id.supplierName",
            // // buyerCode: "$_id.buyerCode",
            // // buyerName: "$_id.buyerName",
//            "Nama Unit": "$_id.unitId",
            "Nama Unit": "$_id.unitName",
            categoryName: "$_id.categoryName",
            "Nama SKU": "$_id.skuName",
//            sku: "$_id.sku",
//            productId: "$_id.productId",
//            qty: "$_id.qty",
            // // status: "$_id.status",
//            categoryName: "$_id.categoryName",
            "No DO": "$_id.noDO",
            "Tgl DO": "$_id.doKirim",
            // // "qtyKirim": "$_id.qtyKirim",
            "Tgl DO Diterima": "$_id.tanggalDiterima",
            // // "qtyTerima": "$_id.qtyTerima",
            "Tgl DO Rating": "$_id.ratingDate",
            
        }
    },
    {
        $sort: {
            _id: 1,
            "No DO": 1
        }
    },
]);