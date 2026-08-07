db.t_purchase_order.aggregate([
  {
    $match: {
      _id: { $in: ["PO202500014241"] }
    }
  },

  // Hitung nilai baru (sesuai pipeline lo)
  {
    $project: {
      _id: 1,

      // header hargaTotal baru = hargaTotal - ppn
      hargaTotalBaru: { $subtract: ["$hargaTotal", "$ppn"] },

      details: 1
    }
  },
  {
    $project: {
      _id: 1,
      hargaTotalBaru: 1,

      // array untuk detail: index + hargaTotalBaru per index
      po: {
        $map: {
          input: { $range: [0, { $size: { $ifNull: ["$details", []] } }] },
          as: "i",
          in: {
            index: "$$i",
            hargaTotalBaru: {
              $subtract: [
                { $arrayElemAt: ["$details.hargaTotal", "$$i"] },
                { $arrayElemAt: ["$details.ppn", "$$i"] }
              ]
            }
          }
        }
      }
    }
  },

  // Bangun string script
  {
    $project: {
      _id: 0,
      script: {
        $let: {
          vars: {
            poId: "$_id",

            // lines: "details.i.hargaTotal": NumberLong("...")
            detailHargaLines: {
              $reduce: {
                input: { $range: [0, { $size: { $ifNull: ["$po", []] } }] },
                initialValue: "",
                in: {
                  $let: {
                    vars: {
                      row: { $arrayElemAt: ["$po", "$$this"] }
                    },
                    in: {
                      $concat: [
                        "$$value",
                        { $cond: [{ $eq: ["$$value", ""] }, "", ",\n        "] },
                        "\"details.",
                        { $toString: "$$row.index" },
                        ".hargaTotal\": NumberLong(\"",
                        { $toString: { $ifNull: ["$$row.hargaTotalBaru", 0] } },
                        "\")"
                      ]
                    }
                  }
                }
              }
            },

            // lines: "details.i.ppn": NumberLong("0")
            detailPpnLines: {
              $reduce: {
                input: { $range: [0, { $size: { $ifNull: ["$po", []] } }] },
                initialValue: "",
                in: {
                  $let: {
                    vars: {
                      row: { $arrayElemAt: ["$po", "$$this"] }
                    },
                    in: {
                      $concat: [
                        "$$value",
                        { $cond: [{ $eq: ["$$value", ""] }, "", ",\n        "] },
                        "\"details.",
                        { $toString: "$$row.index" },
                        ".ppn\": NumberLong(\"0\")"
                      ]
                    }
                  }
                }
              }
            }
          },

          in: {
            $concat: [
              "// BACKUP\n",
              "//FIND\n",
              "db.t_purchase_order.find({\n",
              "    _id: \"", "$$poId", "\"\n",
              "})\n\n",
              "//UPDATE\n",
              "db.t_purchase_order.updateOne({\n",
              "    _id: '", "$$poId", "'\n",
              "}, {\n",
              "    $set: {\n",
              "        ppn: NumberLong(\"0\"),\n",
              "        hargaTotal: NumberLong(\"", { $toString: { $ifNull: ["$hargaTotalBaru", 0] } }, "\")",

              // details hargaTotal lines (kalau ada)
              {
                $cond: [
                  { $gt: [{ $size: { $ifNull: ["$po", []] } }, 0] },
                  { $concat: [",\n        ", "$$detailHargaLines"] },
                  ""
                ]
              },

              // details ppn lines (kalau ada)
              {
                $cond: [
                  { $gt: [{ $size: { $ifNull: ["$po", []] } }, 0] },
                  { $concat: [",\n        ", "$$detailPpnLines"] },
                  ""
                ]
              },

              "\n    }\n",
              "})"
            ]
          }
        }
      }
    }
  }
])