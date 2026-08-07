db.t_purchase_order.aggregate([
    {
        $match: {
            //            
            _id: {
                $in: [
 "PO202400008564", 
 "PO202400008436",  
 "PO202400008235", 

                    
                ]
            }
        }
    },

   {$project:{
	 _id:"$_id",
	 ams:"$nopoAms",
	 buyerName:"$buyerName",
	 supplierName:"$supplierName",
	 digiSignStatus:"$digiSignStatus",
	 alasanGmSetuju:{$cond:{
	 if:{$ne:["$alasanGmSetuju",""]},
	 then:"$alasanGmSetuju",
	 else:"-"
	 }},
	 }}
])
