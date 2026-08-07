db.t_delivery_order.aggregate([
  {
    $match: {
      _created: {
        $gt: ISODate("2024-10-23T16:59:59.000Z"),
        $lte: ISODate("2025-12-31T16:59:59.000Z")
      },
      digiSignStatus: { $in: ["INTERNAL", "EKSTERNAL"] }
    }
  },
  { $unwind: "$detail" },

  {
    $project: {
      do: "$_id",
      nopo: "$nopo",
      sku: "$detail.skuName",
      status: "$detail.status",
      noGrSAP: "$detail.noGrSAP",
      Created: {
        $dateToString: {
          format: "%d-%m-%Y",
          date: { $add: ["$_created", 7 * 60 * 60 * 1000] }
        }
      },
      dokumen: [
        { jenis: "Tug 3 Persediaan", url: "$detail.linkDocDigiSignTug3Persediaan" },
        { jenis: "Tug 3 Karantina", url: "$detail.linkDocDigiSignTug3Karantina" },
        { jenis: "Tug 4 Pemeriksaan", url: "$detail.linkDocDigiSignTug4Pemeriksaan" }
      ]
    }
  },

  { $unwind: "$dokumen" },

  {
    $match: {
      "dokumen.url": { $nin: [null, "", "-"] }
    }
  },

  {
    $project: {
      _id: 0,
      do: 1,
      nopo: 1,
      sku: 1,
      status: 1,
      jenisdokumen: "$dokumen.jenis",
      noGrSAP: 1,
      Created: 1
    }
  }
]);
