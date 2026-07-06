db.t_purchase_order.find({"details.noAlokasi": {$in: ['NA20230707-221757',
'NA20230707-221627',
'NA20230707-215027',
'NA20230707-210924',
'NA20230707-210414',
'NA20230707-203734']}})

db.t_purchase_order.find({_id:"PO202400005632"})