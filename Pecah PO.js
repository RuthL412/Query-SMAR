db.t_purchase_order.aggregate([
    {
        $match: {
            //				
                       _id: {
                           $in: [
                               "PO202500013546",
                               
                           ]
                       }
//             "details.sku": "1702630938822",
//             "details.unitId": {
//                 $in: [
//                     "pln_kd_uid_jawa_barat-pln_up3_bekasi",
//                     "pln_kd_uid_jawa_barat-pln_up3_cikarang"
//                 ]
//             }
            //				noPoSAP:"8000015506"
            //				nopo:"PO202500006176"
            //_id:"DO202500026572"
            //            "detail.itemId": "PLNMP1651117877943843",
            //            status: {
            //                $in: ["FINISHED", "PROCCESSED"]
            //            }
        }
    },
    {
        $unwind: "$details"
    },
    {
        $group: {
            _id: {
                nopo: "$_id",
                noPoSAP: "$noPoSAP",
                mims: "$mims",
                statusLuar: "$status",
                productId: "$details.productId",
                unitId: "$details.unitId",
                unitName: "$details.unitName",
                skuId: "$details.sku",
                skuName: "$details.skuName",
                status: "$details.detailStatus",
                qty: "$details.qty",
                _created: "$_created"
            }
        }
    },
    {
        $project: {
            _id: 0,
            nopo: "$_id.nopo",
            unitId: "$_id.unitId",
            unitName: "$_id.unitName",
            noPoSAP: "$_id.noPoSAP",
            mims: "$_id.mims",
            statusLuar: "$_id.statusLuar",
            productId: "$_id.productId",
            skuId: "$_id.skuId",
            skuName: "$_id.skuName",
            status: "$_id.status",
            qty: "$_id.qty",
            _created: "$_id._created"
        }
    },
    {
        $match: {
            statusLuar:{$in:["PROCESSED_BABG","PROCESSED_SUPPLIER"]},
            "skuId": "1702630938822",
            "unitId": {
                $in: [
                    "pln_kd_uid_jawa_barat-pln_up3_bekasi",
                    "pln_kd_uid_jawa_barat-pln_up3_cikarang"
                ]
            }
        }
    },
    {
        $group: {
            _id: {
                "unitId": "$unitId",
                "unitName": "$unitName",
                "skuId": "$skuId",
                
            },
            qty: {
                $sum: "$qty"
            }
        }
    },
		{
		$project:{
		 "unitId":"$_id.unitId",
"unitName":"$_id.unitName",
"skuId":"$_id.skuId", 
qty:"$qty"
		}
		},
    {
        $sort: {
            _created: 1,
            status: 1
        }
    }
]);

//db.m_product.find({skuId:"1671781051880","supplier.name":"PT MAGNAKABEL NUSANTARA"})
//
//db.m_kontrak_pengadaan.find({"materials.productId":"PLNMP1713519942871571"})

//db.t_delivery_order.find({nopo:"PO202500003809"}).limit(1)