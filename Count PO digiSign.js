db.t_delivery_order.aggregate([
    {
        $match: {
            _created:{
$gt:ISODate("2024-10-31T16:59:59.000Z"),
$lte:ISODate("2025-12-31T16:59:59.000Z")
},
digiSignStatus:{$in:["INTERNAL","EKSTERNAL"]},
        }
    },
    {
        $unwind: "$detail"
    },
    {
        $group: {
            _id: {
                do: {
                    $concat: ["$_id", "   "]
                },
                po: "$nopo",
                _created: "$_created",
                sku: "$detail.skuName",
                productId: "$detail.itemId",
                idRefStampTUG3: {
                    //                    $concat: ["TUG 3 Persediaan - ", {
                    $cond: {
                        
                        if : {
                            $ifNull: ["$detail.resDigisignTug3.ref_id", false]
                        },
                        then: "$detail.resDigisignTug3.ref_id",
                        else : "BELUM ADA",
                        
                    }
                        //                    }]
                },
                idRefStampTUG3Karantina: {
                    //                    $concat: ["TUG 3 Karantina - ", {
                    $cond: {
                        
                        if : {
                            $ifNull: ["$detail.resDigisignTug3Karantina.ref_id", false]
                        },
                        then: "$detail.resDigisignTug3Karantina.ref_id",
                        else : "BELUM ADA",
                        
                    }
                        //                    }]
                },
                idRefStampTUG4: {
                    //                    $concat: ["TUG 4- ", {
                    $cond: {
                        
                        if : {
                            $ifNull: ["$detail.resDigisignTug4PjbPemeriksaan.ref_id", false]
                        },
                        then: "$detail.resDigisignTug4PjbPemeriksaan.ref_id",
                        else : "BELUM ADA",
                        
                    }
                        //                    }]
                },
                linkDocDigiSignTug3Persediaan: {
                    
                    $cond: {
                        
                        if : {
                            $ifNull: ["$detail.linkDocDigiSignTug3Persediaan", false]
                        },
                        then: "$detail.linkDocDigiSignTug3Persediaan",
                        else : "-",
                        
                    }
                },
                linkDocDigiSignTug3Karantina: {
                    
                    $cond: {
                        
                        if : {
                            $ifNull: ["$detail.linkDocDigiSignTug3Karantina", false]
                        },
                        then: "$detail.linkDocDigiSignTug3Karantina",
                        else : "-",
                        
                    }
                },
                linkDocDigiSignTug4Pemeriksaan: {
                    
                    $cond: {
                        
                        if : {
                            $ifNull: ["$detail.linkDocDigiSignTug4Pemeriksaan", false]
                        },
                        then: "$detail.linkDocDigiSignTug4Pemeriksaan",
                        else : "-",
                        
                    }
                },
                tug3Url: {
                    
                    $cond: {
                        
                        if : {
                            $ifNull: ["$detail.tug3Url", false]
                        },
                        then: "$detail.tug3Url",
                        else : "-",
                        
                    }
                },
                tug3KarantinaUrl: {
                    
                    $cond: {
                        
                        if : {
                            $ifNull: ["$detail.tug3KarantinaUrl", false]
                        },
                        then: "$detail.tug3KarantinaUrl",
                        else : "-",
                        
                    }
                },
                tug4Url: {
                    
                    $cond: {
                        
                        if : {
                            $ifNull: ["$detail.tug4Url", false]
                        },
                        then: "$detail.tug4Url",
                        else : "-",
                        
                    }
                },
                lastApproveDigisignTug3Karantina: {
                    
                    $cond: {
                        
                        if : {
                            $ifNull: ["$detail.lastApproveDigisignTug3Karantina", false]
                        },
                        then: "$detail.lastApproveDigisignTug3Karantina",
                        else : 0,
                        
                    }
                },lastApproveDigisignTug3Persediaan: {
                    
                    $cond: {
                        
                        if : {
                            $ifNull: ["$detail.lastApproveDigisignTug3Persediaan", false]
                        },
                        then: "$detail.lastApproveDigisignTug3Persediaan",
                        else : 0
                        
                    }
                },lastApproveDigisignTug4Pemeriksaan: {
                    
                    $cond: {
                        
                        if : {
                            $ifNull: ["$detail.lastApproveDigisignTug4Pemeriksaan", false]
                        },
                        then: "$detail.lastApproveDigisignTug4Pemeriksaan",
                        else : 0
                        
                    }
                },
                
            }
        }
    },
    {
        $project: {
            _id: "$_id._id",
            do: "$_id.do",
            nopo: "$_id.po",
            _created: "$_id._created",
            productId: "$_id.productId",
            sku: "$_id.sku",
            REF_ID_TUG3: "$_id.idRefStampTUG3",
            REF_ID_TUG3Karantina: "$_id.idRefStampTUG3Karantina",
            REF_ID_TUG4: "$_id.idRefStampTUG4",
            linkDocDigiSignTug3Persediaan: "$_id.linkDocDigiSignTug3Persediaan",
            linkDocDigiSignTug3Karantina: "$_id.linkDocDigiSignTug3Karantina",
            linkDocDigiSignTug4Pemeriksaan: "$_id.linkDocDigiSignTug4Pemeriksaan",
            tug3Url: "$_id.tug3Url",
            tug3KarantinaUrl: "$_id.tug3KarantinaUrl",
            tug4Url: "$_id.tug4Url",
            lastApproveDigisignTug3Persediaan:{
        $add: [ "$_id.lastApproveDigisignTug3Persediaan", 7 * 60 * 60 * 1000]   // +7 jam
      },
            lastApproveDigisignTug3Karantina: {
        $add: ["$_id.lastApproveDigisignTug3Karantina", 7 * 60 * 60 * 1000]   // +7 jam
      },
            lastApproveDigisignTug4Pemeriksaan: {
        $add: ["$_id.lastApproveDigisignTug4Pemeriksaan", 7 * 60 * 60 * 1000]   // +7 jam
      },
        }
    },
		{$match:{
		lastApproveDigisignTug4Pemeriksaan:{$ne:25200000}
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
]);
