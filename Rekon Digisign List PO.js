db.t_purchase_order.aggregate([{
    $match: {
        _created: {
            $gte: ISODate("2025-12-31T16:59:59.999Z"),
            $lte: ISODate("2026-04-30T16:59:59.999Z")
            // 			 $gte: ISODate("2024-10-31T17:00:00.000Z"), 
            //       $lte: ISODate("2025-12-31T16:59:59.999Z") 
        },
        digiSignStatus: {
            $in: ["INTERNAL", "EKSTERNAL"]
        },
        //         digiSignResSupplier: {
        //             $exists: true
        //         },
        //         digiSignResBuyer: {
        //             $exists: true
        //         },
        //         "digiSignLinkDoc.linkDocGm": {
        //             $exists: true
        //         },
        //         "digiSignLinkDoc.linkDocFinal": {
        //             $exists: true
        //         },
    }
}, {
    $project: {
        tglPO: {
            $dateToString: {
                format: "%d-%m-%Y",
                date: {
                    $add: ["$_created", 7 * 60 * 60 * 1000]
                },
                
            }
        },
				unit:"$buyerName",
				penyedia:"$supplierName",
				status:"$status",
    }
}])
