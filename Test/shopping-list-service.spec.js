require('dotenv').config()
const { expect } = require('chai')
const supertest = require('supertest')
const knex = require('knex')
const ShoppingListService = require('../src/shopping-list-service')

describe('ShoppingList service object', ()=>{
    let db
    let testItems = [
        {   id: 1,
            name: 'slim jim',
            price: '1.55',
            date_added: new Date('2029-01-22T16:28:32.615Z'),
            checked: true,
            category: 'Snack'},
        {   id: 2,
            name: 'egg biscuit',
            price: '3.55',
            date_added: new Date('2029-01-22T16:28:32.615Z'),
            checked: false,
            category: 'Breakfast'},
        {
            id: 3,
            name: 'steak burrito',
            price: '9.55',
            date_added: new Date('2029-01-22T16:28:32.615Z'),
            checked: false,
            category: 'Lunch'}
    ]
    before(()=>{
        db = knex({
          client: 'pg',
          connection: process.env.TEST_DB_URL
        })
    })
    before(() => db('shopping_list').truncate())

    afterEach(() => db('shopping_list').truncate())

    after(()=>db.destroy())

    context('Given shopping_list with data',()=>{
        beforeEach(() => {
            return db
              .into('shopping_list')
              .insert(testItems)
          })
        it('Gets all items', ()=>{
            return ShoppingListService.getAllItems(db)
                .then(actual=>{
                    expect(actual).to.eql(testItems)
                })
        })
        it('Delete one item from shopping_list',()=>{
            const id = 3
            return ShoppingListService.deleteItem(db, id)
                .then(()=>ShoppingListService.getAllItems(db))
                .then(allItems =>{
                    const expected = testItems.filter(item=> item.id !== id)
                    expect(allItems).to.eql(expected)
                })
        })
        it(`get item by Id`, () => {
            const thirdId = 3
            const thirdTestItem = testItems[thirdId - 1]
            return ShoppingListService.getById(db, thirdId)
              .then(actual => {
                expect(actual).to.eql({
                  id: thirdId,
                  name: thirdTestItem.name,
                  price: thirdTestItem.price,
                  date_added: thirdTestItem.date_added,
                  checked: thirdTestItem.checked,
                  category: thirdTestItem.category
                })
              })
          })
        it('updates item details',()=>{
            const id = 3
            const newDetails = {
                name: 'updated item',
                price: '7.75',
                date_added: new Date(),
                checked: true,
                category: 'Main'
            }
            return ShoppingListService.updateItem(db, id, newDetails)
            .then(()=>ShoppingListService.getById(db, id))
            .then(item => {
                expect(item).to.eql({
                    id: id,
                    ...newDetails,
                })
            })
        })
    })
    it('Inserts items into shopping_list', ()=> {
        const newItem = {
            name: 'new item',
            price: '1.00',
            date_added: new Date('2029-01-22T16:28:32.615Z'),
            checked: false,
            category: 'Lunch'
        }
        return ShoppingListService.insertItem(db, newItem)
            .then(actual =>{
                expect(actual).to.eql({
                    id: 1,
                    name: newItem.name,
                    price: newItem.price,
                    date_added: newItem.date_added,
                    checked: newItem.checked,
                    category: newItem.category
                })
            })
    })
})