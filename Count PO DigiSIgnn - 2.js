db.t_purchase_order.aggregate([{
    $match: {
        
        $or: [{
            purchaseOrderLogList: {
                $elemMatch: {
                    status: "REQUESTED_DIGISIGN_GM",
                    createdDate: {
                        $gte: ISODate("2025-12-31T16:59:59.999Z"),
                        $lte: ISODate("2026-04-30T16:59:59.999Z")
                        // 			 $gte: ISODate("2024-10-31T17:00:00.000Z"), 
                        //       $lte: ISODate("2025-12-31T16:59:59.999Z") 
                    },
                    
                }
            },
            
        },
// 				{
//             purchaseOrderLogList: {
//                 $elemMatch: {
//                     status: "REQUESTED_DIGISIGN_SUPPLIER",
//                     createdDate: {
//                         $gte: ISODate("2025-12-31T16:59:59.999Z"),
//                         $lte: ISODate("2026-04-30T16:59:59.999Z")
//                         // 			 $gte: ISODate("2024-10-31T17:00:00.000Z"), 
//                         //       $lte: ISODate("2025-12-31T16:59:59.999Z") 
//                     },
//                     
//                 }
//             },
//             
//         }
				],
        // _created:{
        // 			$gte: ISODate("2025-12-31T16:59:59.999Z"),
        //       $lte: ISODate("2026-04-30T16:59:59.999Z") 
        // // 			 $gte: ISODate("2024-10-31T17:00:00.000Z"), 
        // //       $lte: ISODate("2025-12-31T16:59:59.999Z") 
        // },
        digiSignStatus: {
            $in: ["INTERNAL", "EKSTERNAL"]
        },
        digiSignResSupplier: {
            $exists: true
        },
        digiSignResBuyer: {
            $exists: true
        },
        "digiSignLinkDoc.linkDocGm": {
            $exists: true
        },
        "digiSignLinkDoc.linkDocFinal": {
            $exists: true
        },
        
    }
},{
    $project: {
        createdA: {
            $arrayElemAt: [
                {
                    $map: {
                        input: {
                            $filter: {
                                input: "$purchaseOrderLogList",
                                as: "item",
                                cond: {
                                    $eq: ["$$item.status", "REQUESTED_DIGISIGN_GM"]
                                }
                            }
                        },
                        as: "item",
                        in: "$$item.createdDate"
                    }
                },
                0
            ]
        }
    }
},
{
    $group: {
        _id: {
            year: {
                $year: {
                    date: "$createdA",
                    timezone: "Asia/Jakarta"
                }
            },
            month: {
                $month: {
                    date: "$createdA",
                    timezone: "Asia/Jakarta"
                }
            }
        },
        total: {
            $sum: 1
        }
    }
}, {
    $addFields: {
        bulan: {
            $concat: [
                {
                    $arrayElemAt: [
                        ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                        {
                            $subtract: ["$_id.month", 1]
                        }
                    ]
                },
                "-",
                {
                    $substr: ["$_id.year", 2, 2]
                }
            ]
        }
    }
}, {
    $sort: {
        "_id.year": 1,
        "_id.month": 1
    }
}, {
    $project: {
        _id: 0,
        bulan: 1,
        total: 1
    }
}])

