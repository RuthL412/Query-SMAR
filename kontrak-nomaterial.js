db.m_kontrak_pengadaan.aggregate([
    {
        $match: {
            				noKontrak:"2000.Pj/DAN.01.01/F01020000/2025",
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
                skuName: "$materials.skuName",
                price: "$materials.contractPrice",
                volKhs: "$materials.jumlahSuplai"
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
            
            contract_clms_no: "$noKontrak",
            boq_type: "$sku.skuType",
            satuan: "$sku.satuanName",
            jumlah: {
                $multiply: ["$volKhs", {
                $cond: {
                    if : {
                        $ifNull:["$price",true]
                    },
                    then: "$sku.hps",
                    else : "$price",
                    
                }
            },]
            },
            harga_satuan: {
                $cond: {
                    if : {
                        $ifNull:["$price",true]
                    },
                    then: "$sku.hps",
                    else : "$price",
                    
                }
            },
            volume_khs: "$volKhs",
            is_ust: "$sku.isUst",
            nomor_material: "$sku.noSap",
            material: "$skuName",
//             productId: "$productId",
            
        }
    },
    {
        $sort: {
            contract_clms_no: 1
        }
    }
])

// db.m_product_sku.find().sort({_created:-1}).limit(2)
// "satuanName": "U",
// "isUst": true,
// isUseSkuPrice

// db.m_kontrak_pengadaan.find({noKontrak:"0602.Pj/DAN.01.01/F01020000/2023 - PT Samudra Harapan"})