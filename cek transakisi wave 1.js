db.t_purchase_order.find({status:{$nin:[/reject/i]},buyerId:{$in:[
"pln_kw_uiw_bangka_belitung",
"pln_kw_uiw_s2jb",
"pln_kd_uid_lampung",
"pln_kd_uid_jakarta_raya",
"pln_kw_uiw_kalselteng",
"1e528304-6543-437c-9965-bde9a26bd675",
"408c011b-3f39-42cd-a16b-864ad9e8993f",

]}},{status:1,buyerName:1,supplierName:1,createdDate:1}).sort({status:1})