//db.t_delivery_order.find({
//    "buyerName": "PLN KD UID Jawa Barat",
//    "categoryLv1Name": {
//        $in: ["KWH METER", "MCB"]
//    }
//})
//

db.t_delivery_order.aggregate([
    
    {
        $match: {
            "buyerName": /Jawa Barat/i,
            "categoryLv1Name": {
                $in: ["KWH METER", "MCB"]
            }
        }
    },
    {
        $unwind: "$detail"
    },
    {
        $group: {
            _id: {
                _id: "$_id",
                tanggal: "$_created",
                productName: "$detail.productName",
                sku: "$detail.sku",
                noSap: "$detail.noSap",
                buyerId: "$buyerId",
                buyerName: "$buyerName",
                unitName: "$unitName",
                supplierName: "$supplierName",
                status: "$detail.status"
            }
        }
    },
    {
        $project: {
            _id: "$_id._id",
            tanggal: "$_id.tanggal",
            productName: "$_id.productName",
            sku: "$_id.sku",
            noSap: "$_id.noSap",
//            buyerId: "$_id.buyerId",
            buyerName: "$_id.buyerName",
            unitName: "$_id.unitName",
						noSN:"-",
            supplierName: "$_id.supplierName",
            status: "$_id.status",
						status2:"kirim material",
        }
    },
		{$match:{status:{$not:{$eq:"RATED"}}}}
])

//No | nama material | no sku | no sap | nama uid | nama up3 | no sn | nama penyedia | status "kirim material |



