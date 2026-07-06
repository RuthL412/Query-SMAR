db.m_new_alokasi_bulanan_kontrak.aggregate([
    {
        $match: {
//            "categoryLv1Id": "biz066",
            startDate: {
                $lte: new Date()
            },
            endDate: {
                $gte: new Date()
            },
            //            "categoryLv1Name": "CUBICLE",
//						"_id": {$in:[
//						"NA20250108-141800","NA20250108-142011","NA20250108-142505","NA20250108-143158","NA20250108-143339","NA20250108-143522","NA20250108-144010","NA20250108-144138","NA20250108-144612","NA20250108-145629","NA20250110-172552","NA20250108-145709","NA20250108-143650","NA20250108-143022","NA20240314-101923","NA20240314-101301","NA20240314-101018","NA20240314-101537","NA20240314-101740","NA20250110-182938","NA20250110-183331","NA20250110-183154","NA20250110-183518","NA20250110-195653","NA20250110-194954","NA20250110-195222","NA20250120-172305","NA20250120-173756","NA20250121-082619","NA20250121-083710","NA20250121-083945","NA20250121-084255","NA20240109-124654"
//						]},
        }
    },
    {
        $lookup: 
        {
            from: 't_purchase_order',
            let: {
                alokasi: "$_id",
                categoryId: "$categoryLv1Id",
                
            },
            pipeline: [
                {
                    $unwind: "$details"
                },
                {
                    $match: {
                        $expr: {
                            $and: [{
                                $eq: ["$categoryId", "$$categoryId"]
                                //                            },{
                                //                                $eq: ["$details.noAlokasi", "$$alokasi"]
                            }, {
                                $in: ["$status", ["FINISHED", "PROCESSED_BABG", "PROCESSED_SUPPLIER", "RECEIVED", "REQUESTED", "APPROVED_SUPPLIER"]]
                            }, ]
                        }
                    },
                    
                },
                {
                    $group: {
                        _id: {
                            po: "$_id",
                            buyerId: "$buyerId",
                            supplierId: "$supplierId",
                            noAlokasi: "$details.noAlokasi",
                            
                        },
                        qty: {
                            $sum: "$details.qty"
                        },
                        qtyDikirim: {
                            $sum: "$details.qtyDikirim"
                        },
                        qtyDiterima: {
                            $sum: "$details.qtyDiterima"
                        },
                        
                    }
                },
                {
                    $group: {
                        _id: {
                            //                            _id: "$_id._id",
                            noAlokasi: "$_id.noAlokasi",
                            buyer: "$_id.buyerId",
                            supplier: "$_id.supplierId",
                            
                        },
                        qty: {
                            $sum: "$qty"
                        },
                        qtyDikirim: {
                            $sum: "$qtyDikirim"
                        },
                        qtyDiterima: {
                            $sum: "$qtyDiterima"
                        },
                        
                    }
                },
                {
                    $project: {
                        _id: {
                            $cond: {
                                if : {
                                    $and: [{
                                        $eq: ["$_id.noAlokasi", "$$alokasi"]
                                    }]
                                },
                                then: {
                                    noAlokasi: "$_id.noAlokasi",
                                    buyer: "$_id.buyer",
                                    supplier: "$_id.supplier",
                                    qty: "$qty",
                                    qtyDikirim: "$qtyDikirim",
                                    qtyDiterima: "$qtyDiterima",
                                    
                                },
                                else : {
                                    noAlokasi: 0,
                                    buyer: 0,
                                    supplier: 0,
                                    qty: 0,
                                    qtyDikirim: 0,
                                    qtyDiterima: 0,
                                    
                                },
                                
                            }
                        }
                    }
                },
                
            ],
            as: "po"
        },
        
    },
    {
        $unwind: "$po",
        
    },
    {
        $unwind: "$po._id",
        
    },
    {
        $unwind: "$listSKU",
        
    },
    {
        $lookup: 
        {
            from: 'm_new_alokasi_bulanan_kontrak_unit',
            let: {
                idAlokasi: "$_id",
                "categoryLv1Name": "$categoryLv1Name",
                "updatedAlokasi": "$updated",
                "startDate": "$startDate",
                "endDate": "$endDate",
                "permanentlyNonactive": "$permanentlyNonactive",
                "namaSku": "$listSKU.namaSku",
                "buyer": "$po._id.buyer",
                "supplier": "$po._id.supplier",
                "qtyPo": "$po._id.qty",
                "qtyDikirim": "$po._id.qtyDikirim",
                "qtyDiterima": "$po._id.qtyDiterima",
                
            },
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $and: [{
                                $eq: ["$noAlokasi", "$$idAlokasi"]
                            }]
                        }
                    },
                    
                },
                {
                    $project: {
                        noAlokasi: "$noAlokasi",
                        "supplierName": "$supplierName",
                        "supplierId": "$supplierId",
                        "buyerName": "$buyerName",
                        "buyerId": "$buyerId",
                        "quota": "$quota",
                        "reservedQuota": "$reservedQuota",
                        "availableQuota": "$availableQuota",
                        "realisasi": "$realisasi",
                        "sumQuota": "$sumQuota",
                        "spb": "$spb",
                        "categoryLv1Name": {
                            $cond: {
                                if : {
                                    $and: [{
                                        $eq: ["$noAlokasi", "$$idAlokasi"]
                                    }, {
                                        $eq: ["$buyerId", "$$buyer"]
                                    }, {
                                        $eq: ["$supplierId", "$$supplier"]
                                    }]
                                },
                                then: "$$categoryLv1Name",
                                else : "$$categoryLv1Name",
                                
                            }
                        },
                        "namaSku": {
                            $cond: {
                                if : {
                                    $and: [{
                                        $eq: ["$noAlokasi", "$$idAlokasi"]
                                    }, {
                                        $eq: ["$buyerId", "$$buyer"]
                                    }, {
                                        $eq: ["$supplierId", "$$supplier"]
                                    }]
                                },
                                then: "$$namaSku",
                                else : "$$namaSku",
                                
                            }
                        },
                        "buyer": {
                            $cond: {
                                if : {
                                    $and: [{
                                        $eq: ["$noAlokasi", "$$idAlokasi"]
                                    }, {
                                        $eq: ["$buyerId", "$$buyer"]
                                    }, {
                                        $eq: ["$supplierId", "$$supplier"]
                                    }]
                                },
                                then: "$$buyer",
                                else : "$$buyer",
                                
                            }
                        },
                        "supplier": {
                            $cond: {
                                if : {
                                    $and: [{
                                        $eq: ["$noAlokasi", "$$idAlokasi"]
                                    }, {
                                        $eq: ["$buyerId", "$$buyer"]
                                    }, {
                                        $eq: ["$supplierId", "$$supplier"]
                                    }]
                                },
                                then: "$$supplier",
                                else : "$$supplier"
                            }
                        },
                        "qtyPo": {
                            $cond: {
                                if : {
                                    $and: [{
                                        $eq: ["$noAlokasi", "$$idAlokasi"]
                                    }, {
                                        $eq: ["$buyerId", "$$buyer"]
                                    }, {
                                        $eq: ["$supplierId", "$$supplier"]
                                    }]
                                },
                                then: "$$qtyPo",
                                else : 0
                            }
                        },
                        "qtyDikirim": {
                            $cond: {
                                if : {
                                    $and: [{
                                        $eq: ["$noAlokasi", "$$idAlokasi"]
                                    }, {
                                        $eq: ["$buyerId", "$$buyer"]
                                    }, {
                                        $eq: ["$supplierId", "$$supplier"]
                                    }]
                                },
                                then: "$$qtyDikirim",
                                else : 0
                            }
                        },
                        "qtyDiterima": {
                            $cond: {
                                if : {
                                    $and: [{
                                        $eq: ["$noAlokasi", "$$idAlokasi"]
                                    }, {
                                        $eq: ["$buyerId", "$$buyer"]
                                    }, {
                                        $eq: ["$supplierId", "$$supplier"]
                                    }]
                                },
                                then: "$$qtyDiterima",
                                else : 0
                            }
                        },
                        "updatedAlokasi": {
                            $cond: {
                                if : {
                                    $and: [{
                                        $eq: ["$noAlokasi", "$$idAlokasi"]
                                    }, {
                                        $eq: ["$buyerId", "$$buyer"]
                                    }, {
                                        $eq: ["$supplierId", "$$supplier"]
                                    }]
                                },
                                then: "$$updatedAlokasi",
                                else : "$$updatedAlokasi",
                                
                            }
                        },
                        "startDate": {
                            $cond: {
                                if : {
                                    $and: [{
                                        $eq: ["$noAlokasi", "$$idAlokasi"]
                                    }, {
                                        $eq: ["$buyerId", "$$buyer"]
                                    }, {
                                        $eq: ["$supplierId", "$$supplier"]
                                    }]
                                },
                                then: "$$startDate",
                                else : "$$startDate",
                                
                            }
                        },
                        "endDate": {
                            $cond: {
                                if : {
                                    $and: [{
                                        $eq: ["$noAlokasi", "$$idAlokasi"]
                                    }, {
                                        $eq: ["$buyerId", "$$buyer"]
                                    }, {
                                        $eq: ["$supplierId", "$$supplier"]
                                    }]
                                },
                                then: "$$endDate",
                                else : "$$endDate",
                                
                            }
                        },
                        "permanentlyNonactive": {
                            $cond: {
                                if : {
                                    $and: [{
                                        $eq: ["$noAlokasi", "$$idAlokasi"]
                                    }, {
                                        $eq: ["$buyerId", "$$buyer"]
                                    }, {
                                        $eq: ["$supplierId", "$$supplier"]
                                    }]
                                },
                                then: "$$permanentlyNonactive",
                                else : "$$permanentlyNonactive",
                                
                            }
                        },
                        
                    }
                },
                
            ],
            as: "detail"
        },
        
    },
    {
        $unwind: "$detail",
        
    },
    {
        $group: {
            _id: {
                _id: "$detail.noAlokasi",
                unitInduk: "$detail.buyerName",
                buyerId: "$detail.buyerId",
                supplierName: "$detail.supplierName",
                kategori: "$detail.categoryLv1Name",
                namaMaterial: "$detail.namaSku",
                totalAlokasiTerbit: "$detail.sumQuota",
                realisasi: "$detail.realisasi",
                updatedAlokasi: "$detail.updatedAlokasi",
                endDate: "$detail.endDate",
                startDate: "$detail.startDate",
                quota: "$detail.quota",
                permanentlyNonactive: "$detail.permanentlyNonactive",
                
            },
            qtyPo: {
                $sum: "$detail.qtyPo"
            },
            //            qtyPo: {
            //                $sum: "$detail.qtyPo"
            //            },
            //            qtyPo: {
            //                $sum: "$detail.qtyPo"
            //            },
            //            qtyPo: {
            //                $sum: "$detail.qtyPo"
            //            },
            qtyDikirim: {
                $sum: "$detail.qtyDikirim"
            },
            qtyDiterima: {
                $sum: "$detail.qtyDiterima"
            },
            
        }
    },
    {
        $lookup: {
            from: "m_company",
            let: {
                buyerId: "$_id.buyerId"
            },
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $and: [{
                                $eq: ["$_id", "$$buyerId"]
                            }]
                        }
                    }
                },
                {
                    $project: {
                        companyCode: 1,
                        _created: 1
                    }
                }
            ],
            as: "company"
        }
    },
    {
        $unwind: "$company"
    },
    {
        $group: {
            _id: {
                _id: "$_id._id",
                code: "$company.companyCode",
                unitInduk: "$_id.unitInduk",
                supplierName: "$_id.supplierName",
                totalAlokasiTerbit: "$_id.totalAlokasiTerbit",
                realisasi: "$_id.realisasi",
                sisaAlokasi: "$_id.quota",
                updatedAlokasi: "$_id.updatedAlokasi",
                noAlokasi: "$_id._id",
                kategori: "$_id.kategori",
                quota: "$_id.quota",
                permanentlyNonactive: "$_id.permanentlyNonactive",
                startDate: "$_id.startDate",
                endDate: "$_id.endDate",
                qtyPo: "$qtyPo",
                kirim: "$qtyDikirim",
                diterima: "$qtyDiterima"
            },
            //            kirim: {
            //                $sum: "$qtyDikirim"
            //            },
            //            qtyPo: {
            //                $sum: "$qtyPo"
            //            },
            namaMaterial: {
                $push: "$_id.namaMaterial"
            },
            
        }
    },
    {
        $project: {
            _id: "$_id._id",
            code: {
                $cond: {
                    if : {
                        $ifNull: ["$_id.code", false]
                    },
                    then: "$_id.code",
                    else : "-",
                    
                }
            },
            unitInduk: "$_id.unitInduk",
            kategori: "$_id.kategori",
            namaMaterial: {
                $reduce: {
                    input: "$namaMaterial",
                    initialValue: "",
                    in: {
                        $concat: ["$$value", "$$this", " , "]
                    }
                }
            },
            //            namaMaterial: "$_id.namaMaterial",
            totalAlokasiTerbit: "$_id.totalAlokasiTerbit",
            realisasi: "$_id.realisasi",
            //                        								qtyPo: "$_id.qtyPo",
            Delivered: "$_id.diterima",
            //            diterima: "$_id.diterima",
            belumDelivered: {
                $subtract: ["$_id.qtyPo", "$_id.diterima"]
            },
            sisaAlokasi: "$_id.quota",
            supplierName: "$_id.supplierName",
            updatedAlokasi: {
                $dateToString: {
                    format: "%d-%m-%Y",
                    date: "$_id.updatedAlokasi"
                }
            },
            jenisAlokasi: "KHS_IE",
            noAlokasi: "$_id._id",
            statusAlokasi: {
                $cond: {
                    if : {
                        $lte: ["$_id.startDate", "$$NOW"]
                    },
                    then: {
                        $cond: {
                            if : {
                                $lte: ["$_id.endDate", "$$NOW"]
                            },
                            then: {
                                $cond: {
                                    if : {
                                        $eq: ["$_id.permanentlyNonactive", true]
                                    },
                                    then: "TIDAK AKTIF PERMANENT",
                                    else : "TIDAK AKTIF"
                                }
                            },
                            else : "AKTIF",
                            
                        }
                    },
                    else : "BELUM AKTIF"
                }
            }
                //            detai: "$detail"
        }
    },
    {
        $sort: {
            noAlokasi: - 1,
            supplierName: 1,
            code: 1,
            //            unitInduk: 1,
            //						noAlokasi:1,
            //            namaMaterial: 1,
        }
    }
])

