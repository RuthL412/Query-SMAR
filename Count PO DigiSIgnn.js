db.t_purchase_order.aggregate([{$match:{
_created:{
 $gte: ISODate("2024-10-31T17:00:00.000Z"), 
      $lte: ISODate("2025-12-31T16:59:59.999Z") 
},
digiSignStatus:{$in:["INTERNAL","EKSTERNAL"]},
digiSignResSupplier:{$exists:true},
digiSignResBuyer:{$exists:true},
"digiSignLinkDoc.linkDocGm":{$exists:true},
"digiSignLinkDoc.linkDocFinal":{$exists:true},


}},

{
    $group: {
      _id: {
        year: {
          $year: {
            date: "$_created",
            timezone: "Asia/Jakarta"
          }
        },
        month: {
          $month: {
            date: "$_created",
            timezone: "Asia/Jakarta"
          }
        }
      },
      total: { $sum: 1 }
    }
  },

  {
    $addFields: {
      bulan: {
        $concat: [
          {
            $arrayElemAt: [
              ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
              { $subtract: ["$_id.month", 1] }
            ]
          },
          "-",
          { $substr: ["$_id.year", 2, 2] }
        ]
      }
    }
  },

  { $sort: { "_id.year": 1, "_id.month": 1 } },

  {
    $project: {
      _id: 0,
      bulan: 1,
      total: 1
    }
  }
])

