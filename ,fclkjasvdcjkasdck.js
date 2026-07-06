db.m_kebutuhan_material_up3.find({isTahunan:false,tahun:2024,"buyerId":  "pln_kw_uiw_kalselteng"})
















db.t_delivery_order.find({_created:{$lte:ISODate("2024-03-06T05:00:00.694Z")}},{_created:1}).sort({_created:-1});








db.t_delivery_order.find({_created:{$lte:ISODate("2024-03-06T05:00:00.694Z")}},{_created:1,_updated:1}).sort({_created:-1});




db.log_general.find({"details.actor.level":null,_created:{$lte:ISODate("2024-03-06T04:00:00.694Z")},name:{$not:/sche/i}}).sort({_created:-1});

db.m_product_sku.find({_created:{$lte:ISODate("2024-03-06T05:00:00.694Z")}},{_created:1,_updated:1}).sort({_created:-1});


db.log_general.find({name:"UPDATE_COMPANY_SELLER"}).sort({_created:-1});

db.sys_auth_user.find({username:"ndaru.wicaksono.scm"})
