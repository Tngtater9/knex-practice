require('dotenv').config()
const knex = require('knex')

const knexInstance = knex({
  client: 'pg',
  connection: process.env.DB_URL
})

function searchForItem (searchTerm) {
    knexInstance
        .select('*')
        .from('shopping_list')
        .where('name', 'ILIKE', `%${searchTerm}%`)
        .then(result => {
            console.log(result)
        })
}

function allItemsPaginated (pageNumber){
    const itemsPerPage = 6;
    const offset = itemsPerPage * (pageNumber - 1);
    knexInstance
        .select('*')
        .from('shopping_list')
        .limit(itemsPerPage)
        .offset(offset)
        .then(result => {
            console.log(result)
        })
}

function itemsAddedAfterDate (daysAgo){
    knexInstance
        .select('*')
        .from('shopping_list')
        .where('date_added', 
        '>',
        knexInstance.raw(`now() - '?? days'::INTERVAL`, daysAgo)
        )
        .then(result => {
            console.log(result)
        })
}

function totalCostByCategory (){
    knexInstance
        .select('category')
        .from('shopping_list')
        .sum('price')
        .groupBy('category')
        .then(result => {
            console.log(result)
        })
}

searchForItem('burger');
allItemsPaginated(2);
itemsAddedAfterDate(3);
totalCostByCategory();