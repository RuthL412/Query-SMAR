db.m_kontrak_pengadaan.aggregate([
    {
        $match: {
            noKontrak: "2045.Pj/DAN.01.01/F01020000/2025",
            status: {
                $nin: ["TIDAK_AKTIF"]
            },
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
                volKhs: "$materials.skuName"
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
            volKhs: "$_id.volKhs"
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
    //     {
    //         $addFields: {
    //             noMaterial: {
    //                 $ifNull: [
    //                     {
    //                         $arrayElemAt: ["$sku.noSap", 0]
    //                     },
    //                     "-"
    //                 ]
    //             }
    //         }
    //     },
    {
        $project: {
            
            
            // boq_type: "$sku.skuType",
            // satuan: "$sku.satuanName",
            // jumlah: {
            //     $multiply: ["$volKhs", {
            //     $cond: {
            //         if : {
            //             $ifNull:["$price",true]
            //         },
            //         then: "$sku.hps",
            //         else : "$price",
            
            //     }
            // },]
            // },
            // harga_satuan: {
            //     $cond: {
            //         if : {
            //             $ifNull:["$price",true]
            //         },
            //         then: "$sku.hps",
            //         else : "$price",
            
            //     }
            // },
            supplierName: "$supplierName",
            volume_khs: "$volKhs",
//             is_ust: "$sku.isUst",
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
// 				volume_khs:{$gt:0},
            nomor_material: {
                $in: [
       "000000000003210020",
                ]
            }
        }
    },
    {
        $sort: {
            nomor_material: 1
        }
    }
])
