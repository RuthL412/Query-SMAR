use mplace_dbstag_new
db.getSiblingDB('mplace_dbstag_new').m_kepdir.aggregate([
//{$match:{username:"ap.eic"}},
{
    $lookup:{
        from:"mplace_dev.m_kepdir",
        localField:"_id",
        foreignField:"_id",
        as:"oke"
    }
},
//{$project:{oke:1}}

])
