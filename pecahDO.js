db.t_delivery_order.aggregate([
    {
        $match: {
            //				
            nopo: {
                $in: [
"PO202600000097",
                ]
            }
            //				noPoSAP:"8000015506"
//            				nopo:"PO202500009885"
            //_id:"DO202500026572"
            //            "detail.itemId": "PLNMP1651117877943843",
            //            status: {
            //                $in: ["FINISHED", "PROCCESSED"]
            //            }
        }
    },
    {
        $unwind: {
            path: "$detail",
            includeArrayIndex: "indexDetail" // <= menambahkan indeks
        }
    },
    {
        $group: {
            _id: {
						
                _id: "$_id",
                nopo: "$nopo",
                noPoSAP: "$noPoSAP",
                buyerName: "$buyerName",
                unitName: "$unitName",
                mims: "$mims",
                statusLuar: "$status",
                noSAP: "$detail.noSap",
                itemId: "$detail.itemId",
                skuName: "$detail.skuName",
                noDoLineItem: "$detail.noDoLineItem",
                noDoItem: "$detail.noDoItem",
                tanggalDiterima: "$detail.tanggalDiterima",
                ratingDate: "$detail.ratingDate",
                itemId: "$detail.itemId",
                status: "$detail.status",
                qty: "$detail.qty",
                qtyTerima: "$detail.qtyTerima",
                token: "$detail.token",
                _created: "$_created",
                noGrSAP: "$detail.noGrSAP",index: "$indexDetail" 
            }
        }
    },
    {
        $project: {
            _id: "$_id._id",
            nopo: "$_id.nopo",
            buyerName: "$_id.buyerName",
            unitName: "$_id.unitName",
            noPoSAP: "$_id.noPoSAP",
            ratingDate: "$_id.ratingDate",
            itemId: "$_id.itemId",
            noSAP: "$_id.noSAP",
            skuName: "$_id.skuName",
            itemId: "$_id.itemId",
            status: "$_id.status",
            qty: "$_id.qty",
            qtyTerima: "$_id.qtyTerima",
            statusLuar: "$_id.statusLuar",
            _created: "$_id._created",
            noDoLineItem: "$_id.noDoLineItem",
            noDoItem: "$_id.noDoItem",
            tanggalDiterima: "$_id.tanggalDiterima",
            ratingDate: "$_id.ratingDate",
            mims: "$_id.mims",
            noGrSAP: "$_id.noGrSAP",
						keterangan:{$concat:[
						"$_id._id", " || ", "$_id.unitName", " || ", "$_id.skuName", " || ","status ", "$_id.status", " || ", "mims ", {$toString:"$_id.mims"}, " || ", "Qty Terima ", {$toString:"$_id.qtyTerima"}, " dari " ,{$toString:"$_id.qty"},
						]},index: "$_id.index",token: "$_id.token", 
            
        }
    },
// 		{$match:{token:/draft/i}},
    {
        $sort: {
            noDoLineItem: 1,
            status: 1
        }
    }
]);

//db.m_product.find({skuId:"1671781051880","supplier.name":"PT MAGNAKABEL NUSANTARA"})
//
//db.m_kontrak_pengadaan.find({"materials.productId":"PLNMP1713519942871571"})

//db.t_delivery_order.find({nopo:"PO202500003809"}).limit(1)


