// backup

db.t_purchase_order.find({
  _id: {
    $in: [
"PO202600001644",
"PO202600001643",
"PO202600000453",
    ],
  },
});

db.t_delivery_order.find({
  nopo: {
    $in: [
"PO202600001644",
"PO202600001643",
"PO202600000453",
    ],
  },
});

// update

db.t_purchase_order.updateMany(
  {
    _id: {
      $in: [
"PO202600001644",
"PO202600001643",
"PO202600000453",
      ],
    },
  },
  { $set: { noPoSAP: "", noOA: "" } },
);

db.t_delivery_order.updateMany(
  {
    nopo: {
      $in: [
"PO202600001644",
"PO202600001643",
"PO202600000453",
      ],
    },
  },
  { $set: { noPoSAP: "", "detail.$[].noGrSAP": "", mims: false } },
);