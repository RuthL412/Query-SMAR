
db.sap_plant_material.find({plantCode:"2411",matNumber:"000000000002070968"});		

db.m_unit.find({},{plantCode:1,companyName:1})

db.sap_plant.find()

db.sap_plant_material.aggregate([
{
      $group :
        {
          plantCode : "$item",
					"stock": { "$sum": 1 },
        }
},
{ $project: {
        plantCode:1
    }},
]);