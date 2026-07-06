db.m_ust_request_elab.aggregate([
    {
        $match: {
            productId: {$in:[
"AIRBIZZ157906528475151",
						]},
            status: "VERIFIED"
        }
    },
    {
        $group: {
            _id: {
                _id: "$productId",
                skuId: "$sku",
                supplierId: "$supplierId"
            },
            qtyLolosUst: {
                $sum: "$jumlahHasilUji"
            }
        }
    },
    {
        $project: {
            _id: 0,
            productId: "$_id._id",
            supplierId: "$_id.supplierId",
            skuId: "$_id.skuId",
            qtyLolosUst: "$qtyLolosUst"
        }
    },
    {
        $lookup: {
            from: "m_ust_request",
            let: {
                productIdVar: "$productId"
            },
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $and: [
                                {
                                    $eq: ["$productId", "$$productIdVar"]
                                },
                                {
                                    $eq: ["$status", "VERIFIED"]
                                },
                                
                            ]
                        }
                    },
                    
                },
                {
                    $group: {
                        _id: "$productId",
                        qtyLolosUst: {
                            $sum: "$jumlahHasilUji"
                        }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        qtyLolosUst: {
                            $cond: {
                                if : {
                                    $ifNull: ["$qtyLolosUst", false]
                                },
                                then: "$qtyLolosUst",
                                else : 0,
                                
                            },
                            
                        },
                        
                    },
                    
                },
                
            ],
            as: "Elab"
        }
    },
    {
        $lookup: {
            from: "m_ust_request_mims",
            let: {
                productIdVar: "$productId"
            },
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $and: [
                                {
                                    $eq: ["$productId", "$$productIdVar"]
                                },
                                {
                                    $eq: ["$status", "VERIFIED"]
                                },
                                
                            ]
                        }
                    },
                    
                },
                {
                    $group: {
                        _id: "$productId",
                        qtyLolosUst: {
                            $sum: "$jumlahHasilUji"
                        }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        qtyLolosUst: {
                            $cond: {
                                if : {
                                    $ifNull: ["$qtyLolosUst", false]
                                },
                                then: "$qtyLolosUst",
                                else : 0,
                                
                            },
                            
                        },
                        
                    },
                    
                },
                
            ],
            as: "mims"
        }
    },
    {
        $lookup: {
            from: "t_delivery_order",
            let: {
                productIdVar: "$productId"
            },
            pipeline: [
                
                {
                    $unwind: "$detail"
                },
                {
                    $match: {
                        $expr: {
                            $and: [
                                {
                                    $eq: ["$detail.itemId", "$$productIdVar"]
                                },
                                {
                                    $in: ["$status", ["FINISHED", "PROCCESSED"]]
                                },
                                
                            ]
                        }
                    },
                    
                },
                {
                    $group: {
										
										_id:{_id:"$_id",product:"$detail.itemId",qty:"$detail.qty",qtyTerima:"$detail.qtyTerima"}
//                        _id: "$detail.itemId",
//                        qtyDO: {
//                            $sum: "$detail.qty"
//                        },
//                        qtyTerima: {
//                            $sum: "$detail.qtyTerima"
//                        },
                        
                    }
                },
                {
                    $project: {
                        _id: "$_id._id",
                        productId: "$_id.product",
                        qtyDO: 
//												"$qtyDO",
                        {
                            $cond: {
                                if : {
                                    $eq: [{
                                        $subtract: ["$_id.qty", "$_id.qtyTerima"]
                                    }, "$_id.qty"]
                                },
                                then: "$_id.qty",
                                else : "$_id.qtyTerima",
                                
                            }
                        },
//                        
                    },
                    
                },
								{$group:{_id:"$productId",qtyDO:{$sum:"$qtyDO"}}},
                
            ],
            as: "DO"
        }
    },
    {
        $lookup: {
            from: "t_operasional",
            let: {
                skuVar: "$skuId",
                supplierVar: "$supplierId",
                
            },
            pipeline: [
                
                {
                    $unwind: "$listData"
                },
                {
                    $match: {
                        $expr: {
                            $and: [
                                {
                                    $eq: ["$listData.sku", "$$skuVar"]
                                },
                                {
                                    $eq: ["$listData.supplierId", "$$supplierVar"]
                                },
                                {
                                    $eq: ["$tipeOperasional", "REVISI_STOK_PENYEDIA"]
                                }, {
                                    $eq: ["$status", "SUCCESS",]
                                },
                                
                            ]
                        }
                    },
                    
                },
                {
                    $group: {
                        _id: {
                            sku: "$listData.sku",
                            supplierId: "$listData.supplierId",
                            
                        },
                        stokRevisi: {
                            $sum: "$listData.stokRevisi"
                        },
                        stokRevisiSebelum: {
                            $sum: "$listData.stokRevisiSebelum"
                        },
                        
                    },
                    
                },
                {
                    
                    $project: {
                        _id: 0,
                        stokRevisi: {
                            $cond: {
                                if : {
                                    $ifNull: ["$stokRevisi", false]
                                },
                                then: "$stokRevisi",
                                else : 0
                            }
                        },
                        stokRevisiSebelum: {
                            $cond: {
                                if : {
                                    $ifNull: ["$stokRevisiSebelum", false]
                                },
                                then: "$stokRevisiSebelum",
                                else : 0
                            }
                        },
                        revisi: {
                            $cond: {
                                if : {
                                    "$or": [
                                        {
                                            "$ifNull": ["$stokRevisi", false]
                                        },
                                        {
                                            "$ifNull": ["$stokRevisiSebelum", false]
                                        },
                                        
                                    ]
                                },
                                then: {
                                    $subtract: ["$stokRevisi", "$stokRevisiSebelum"]
                                },
                                else : 0
                            }
                        }
                    },
                    
                },
                
            ],
            as: "revisi"
        },
        
    },
    //    {
        //        $unwind: "$DO"
    //    },
    //    {
    //        $unwind: "$Elab"
    //    },
    //    {
    //        $unwind: "$mims"
    //    },
    //    {
    //        $unwind: "$revisi"
    //    },
    {
        $project: {
            _id: "$productId",
            sku: "$skuId",
            supplierId: "$supplierId",
            revisi: 
{
    $cond: {
        if : {
            $eq: [{
                $size: "$revisi"
            }, 0]
        },
        then: 0,
        else : {
            $arrayElemAt: ["$revisi.revisi", 0]
        },
        
    }
}, 
            lolosUstSMAR: "$qtyLolosUst",
            lolosUstELAB: {
                $cond: {
                    if : {
                        $eq: [{
                            $size: "$Elab"
                        }, 0]
                    },
                    then: 0,
                    else : {
                        $arrayElemAt: ["$Elab.qtyLolosUst", 0]
                    },
                    
                }
            },
            lolosUstMIMS: {
                $cond: {
                    if : {
                        $eq: [{
                            $size: "$mims"
                        }, 0]
                    },
                    then: 0,
                    else : {
                        $arrayElemAt: ["$mims.qtyLolosUst", 0]
                    },
                    
                }
            },
            qtyDO: {
                $cond: {
                    if : {
                        $eq: [{
                            $size: "$DO"
                        }, 0]
                    },
                    then: 0,
                    else : {
                        $arrayElemAt: ["$DO.qtyDO", 0]
                    },
                    
                }
            },
        }
//        }
    },
    {
        $project: {
            "_id": "$_id",
            "sku": "$sku",
            "supplierId": "$supplierId",
            "revisi": "$revisi",
            "lolosUstElab": "$lolosUstSMAR",
            "lolosUstSMAR": "$lolosUstELAB",
            "lolosUstMIMS": "$lolosUstMIMS",
            "qtyDO": "$qtyDO",
                                    TotalStock: {
                                        $add: ["$lolosUstSMAR", "$lolosUstELAB", "$lolosUstMIMS", "$revisi"]
                                    },
                                    "CoveringLatter": {
                                        $subtract: [{
                                            $add: ["$lolosUstSMAR", "$lolosUstELAB", "$lolosUstMIMS", "$revisi"]
                                        }, "$qtyDO"]
                                    },
        }
    },
    
]);


//db.m_product.find({_id:"AIRBIZZ1583459957376576"});

//db.m_ust_request_mims.find({_id:"AIRBIZZ1583459957376576"})

//db.t_delivery_order.find({"detail.itemId":"AIRBIZZ1583459957376576"})