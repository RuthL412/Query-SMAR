db.m_setting_sla_digisign.find().sort({_created:-1});

db.t_purchase_order.find({}).sort({_created:-1}).limit(3)

db.t_purchase_order.find({$and:[{digiSignStatus:{$not:/OFF/i}},{digiSignStatus:{$exists:true}}]}).sort({_created:-1});