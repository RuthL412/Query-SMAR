db.t_delivery_order.aggregate([
    {
        $match: {
            _created: {
                $gt: ISODate("2023-12-21T17:00:00.000Z"),
                $lt: ISODate("2024-12-31T16:59:59.999Z")
            },
            "detail.itemId": "PLNMP166001051618888",
            status: {
                $in: [/proccessed/i, "FINISHED"]
            }
        }
    },
    {
        $unwind: "$detail"
    },
    {
        $group: {
            _id: "$detail.itemId",
            qty: {
                $sum: "$detail.qty"
            }
        }
    }
])

//2222578 - 2261398 = -38,820


db.m_ust_request_elab_summary.find({
    noKontrak: "2009.PJ/DAN.01.01/F01020000/2023"
})