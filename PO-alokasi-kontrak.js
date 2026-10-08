db.t_purchase_order.aggregate([
    {
        $match: {
				_id:{$in:[
				"PO202600007886",
				"PO202600006601"
				]},
//            $expr: {
//                $and: [{
//                    
//                    $eq: [{
//                        $year: "$createdDate"
//                    }, 2025] // 1 untuk Januari},]}
//                }]
//            },
//            "categoryId": {
//                $in: ["plnmp086", "plnmp077"]
//            },
            //    "categoryName": {$in:["TRAFO POWER","MTU AIS"]},
        }
    },
    {
        $project: {
            _id: 1,
            createdDate: 1,
            poSendSupplierDate: 1,
            status: 1,
            buyerId: 1,
            buyerName: 1,
            supplierId: 1,
            supplierName: 1,
            "details.unitName": 1,
            "details.noAlokasi": 1,
            "details.sku": 1,
            "details.skuName": 1,
            "details.maxReceivedDay": 1,
            
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
                "nopo": "$_id",
                "createdDate": "$createdDate",
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
                "maxReceivedDay": "$details.maxReceivedDay",
                "index": "$indexDetail"
            }
        }
    },
    {
        $project: {
            _id: 0,
            "nopo": "$_id.nopo",
            "createdDate": "$_id.createdDate",
            "poSendSupplierDate": {
                $ifNull: ["$_id.poSendSupplierDate", "-"]
            },
            "status": "$_id.status",
            "buyerId": "$_id.buyerId",
            "buyerName": "$_id.buyerName",
            "supplierName": "$_id.supplierName",
            "supplierId": "$_id.supplierId",
            "unitName": "$_id.unitName",
            "noAlokasi": "$_id.noAlokasi",
            "sku": "$_id.sku",
            "skuName": "$_id.skuName",
            "maxReceivedDay": "$_id.maxReceivedDay",
            "index": "$_id.index",
            
        }
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
            as: "alokasiUnit",
            
        },
        
    },
    {
        $unwind: "$alokasiUnit"
    },
    {
        $project: {
            "No PO": "$nopo",
            "TGL PO Dibuat": "$createdDate",
            "Tgl Po Dikirim": "$poSendSupplierDate",
            //"buyerId": "$buyerId",
            "Unit Induk": "$buyerName",
            "Penyedia": "$supplierName",
            //"supplierId": "$supplierId",
            "status": "$status",
            "UP3 Tujuan": "$unitName",
            "Nomor Alokasi": "$noAlokasi",
            "Nomor Kontrak": "$alokasiUnit.noKontrak",
            "SKU": "$sku",
            "Nama Material": "$skuName",
            "SLA": "$maxReceivedDay",
            "index": "$index",
        }
    },
// 		{$match:{
// 		SLA:{$lt:240}
// 		}},
    {
        $sort: {
            "No PO":  1,
            index: 1
        }
    },
    //    {
    //        $limit: 1
    //    }
]);


//No PO |Tgl PO Dibuat | Tgl Po Dikirim | Unit INduk | UP3 tujuan | No Kontrak | SKU | Nama Material | SLA



//db.t_purchase_order.find({_id:"PO202500011160"})