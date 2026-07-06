db.m_product.aggregate([
    {
        $match: {
            "categoryLv1Id": "plnmp088",
            "categoryLv1Name": "BOX APP",
            "supplier._id": {
                $in: [
                    "7ff2058b-d3d4-4787-9923-0f71207fdf13",
                    "a20da5ae-5cf1-4e27-9aac-3545963ccf23",
                    "fbbfdaa7-20a4-4a56-b9e6-5d6462feccfb",
                    "pt_bambang_djaja",
                    "pt_electra_inti_perkasa",
                    "pt_kurnia_abadi_padang",
                    "pt_nurinda",
                    "pt_panel_mulia_total",
                    "pt_powerindo_prima_perkasa",
                    "pt_symphos_electric",
                    "pt_travesindo_multi_elektrik",
                    "pt_tritunggal_swarna",
                    
                ]
            }
        }
    },
    {
        $unwind: "$supplier"
    },
    {
        $group: {
            _id: {
                supplierId: "$supplier._id",
                supplierName: "$supplier.name",
                sku: "$skuId",
                categoryLv1Name: "$categoryLv1Name",
                
            }
        }
    },
    {
        $project: {
            _id: 0,
            supplierId: "$_id.supplierId",
            supplierName: "$_id.supplierName",
            sku: "$_id.sku",
            categoryLv1Name: "$_id.categoryLv1Name",
            
        }
    },
    {
        $lookup: {
            from: "m_product_sku",
            let: {
                skuId: "$sku",
                
            },
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $and: [{
                                $eq: ["$_id", "$$skuId"]
                            }]
                        }
                    }
                },
                {
                    $project: {
                        noSap: 1
                    }
                }
            ],
            as: "skuData",
            
        }
    },
    {
        $unwind: "$skuData"
    },
    {
        $project: {
            supplierId: "$supplierId",
            supplierName: "$supplierName",
            categoryLv1Name: "$categoryLv1Name",
            nomorMaterial: "$skuData.noSap"
        }
    }
])