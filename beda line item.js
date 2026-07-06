db.t_delivery_order.aggregate([
    {
        $match: {			
            _id: {
                $in: [
                    "DO202600014038"
                ]
            }
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
                _created: "$_created",
                noGrSAP: "$detail.noGrSAP",
                index: "$indexDetail"
            }
        }
    },
    {
        $project: {
            _id: "$_id._id",
            nopo: "$_id.nopo",
            buyerName: "$_id.buyerName",
            unitName: "$_id.unitName",
            //             noPoSAP: "$_id.noPoSAP",
            //             ratingDate: "$_id.ratingDate",
            //             itemId: "$_id.itemId",
            noSAP: "$_id.noSAP",
            skuName: "$_id.skuName",
            //             itemId: "$_id.itemId",
            status: "$_id.status",
            qty: "$_id.qty",
            qtyTerima: "$_id.qtyTerima",
            statusLuar: "$_id.statusLuar",
            //             _created: "$_id._created",
            noDoLineItem: "$_id.noDoLineItem",
            //             noDoItem: "$_id.noDoItem",
            //             tanggalDiterima: "$_id.tanggalDiterima",
            //             ratingDate: "$_id.ratingDate",
            mims: "$_id.mims",
            noGrSAP: "$_id.noGrSAP",
            keterangan: {
                $concat: [
                    "UPDATE mims_master.trans_delivery_order_details SET do_line_item='",
                    "$_id.noDoLineItem",
                    "' WHERE no_do_smar='",
                    "$_id._id",
                    "' AND no_mat_sap='",
                    "$_id.noSAP",
                    "';"
                ]
            },
            index: "$_id.index"
        }
    },
    // 		{$match:{noGrSAP:{$exists:false}}},
    {
        $sort: {
            noDoLineItem: 1,
            status: 1
        }
    }
]);



