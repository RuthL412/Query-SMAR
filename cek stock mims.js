db.m_kontrak_pengadaan.aggregate([
    {
        $match: {
            noKontrak: "2045.Pj/DAN.01.01/F01020000/2025",
//             status: {
//                 $nin: ["TIDAK_AKTIF"]
//             },
            latest: true
        }
    },
    {
        $unwind: "$materials"
    },
    {
        $group: {
            _id: {
                noKontrak: "$noKontrak",
                supplierName: "$supplierName",
                sku: "$materials.skuId",
                productId: "$materials.productId",
                skuName: "$materials.skuId",
                skuName: "$materials.skuId",
                price: "$materials.contractPrice",
                volKhs: "$materials.jumlahSuplai",
                skuName: "$materials.skuName"
            }
        }
    },
    {
        $project: {
            _id: 0,
            noKontrak: "$_id.noKontrak",
            supplierName: "$_id.supplierName",
            sku: "$_id.sku",
            skuName: "$_id.skuName",
            productId: "$_id.productId",
            price: "$_id.price",
                volKhs: "$_id.volKhs",
                skuName: "$_id.skuName"
        }
    },
    {
        $lookup: {
            from: "m_product_sku",
            let: {
                skuId: "$sku"
            },
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $eq: ["$_id", "$$skuId"]
                        }
                    }
                },
                
            ],
            as: "sku"
        }
    },
    {
        $unwind: "$sku"
    },
    {
        $project: {
            supplierName: "$supplierName",
            volume_khs: "$volKhs",
            material: "$skuName",
            contract_clms_no: "$noKontrak",
            nomor_material: "$sku.noSap",
            productId: "$productId",
            
        }
    },
    {
        $lookup: {
            from: "m_product",
            let: {
                produk: "$productId"
            },
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $eq: ["$_id", "$$produk"]
                        }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        stock: 1
                    }
                }
            ],
            as: "product"
        }
    },
    {
        $addFields: {
            stock: {
                $arrayElemAt: ["$product.stock", 0]
            }
        }
    },
    {
        $project: {
            product: 0
        }
    },
    {
        $match: {
            nomor_material: {
                $in: [
       "000000000003210020",
                ]
            }
        }
    },
    {
        $lookup: {
            from: "t_historikal_stok_produk",
            let: {
                produk: "$productId"
            },
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $eq: ["$productId", "$$produk"]
                        }
                    }
                },
                {$sort:{
                    _created:-1

                }},
                {
                    $limit: 200
                }
            ],
            as: "history"
        }
    },
        {
        $lookup: {
            from: "m_ust_request_elab_summary",
            let: {
                kontrak: "$contract_clms_no",
                sku: "$material",
            },
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $and:[

                                {$eq: ["$noKontrak", "$$kontrak"]},
                                {$eq: ["$materialName", "$$sku"]}
                            ]
                        }
                    }
                },
               
            ],
            as: "summary"
        }
    },
    {
        $sort: {
            nomor_material: 1
        }
    }
])
