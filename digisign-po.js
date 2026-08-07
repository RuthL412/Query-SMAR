db.t_purchase_order.aggregate([
    {
        $match: {
            _id: {
                $in: [
                    "PO202400008328",
                    "PO202400008271",
                    "PO202400008269",
                    
                ]
            }
        }
    },
    {
        $project: 
        {
				_id:"$_id",
            nopoAms: "$nopoAms",
            buyerName: "$buyerName",
            supplierName: "$supplierName",
            digiSignStatus: "$digiSignStatus",
            alasanGmSetuju: "$alasanGmSetuju",
            
        }
    }
])