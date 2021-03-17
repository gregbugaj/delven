import { Enumerable } from "../query/internal"

describe("Enumerable SelectMany", () => {
  beforeAll(() => { })

    test("SelectMany-Flatten", async () => {
      const enumerable = Enumerable.of([{ 'name': 'Greg', 'items': [10, 20, 30] }, { 'name': 'Roman', 'items': [40, 50, 60] }])
      const selection = enumerable.SelectMany(x => x.items)
      const results = await selection.toArray()
      const expectedResult = [10, 20, 30, 40, 50, 60]
      expect(results).toEqual(expectedResult)
    })

    test("SelectMany-Transform Directly", async () => {
      const enumerable = Enumerable.of([
        { 'name': 'Higa', 'pets': ["Scruffy", "Sam"] },
        { 'name': 'Ashkenazi', 'pets': ["Walker", "Sugar"] },
        { 'name': 'Price', 'pets': ["Scratches", "Diesel"] },
        { 'name': 'Hines', 'pets': ["Dusty"] },
      ])

      const selection = enumerable.SelectMany(x => x.pets, (owner, name) => ({ 'owner': owner.name, 'name': name }))
      const results = await selection.toArray()

      const expectedResult = [
        { "owner": "Higa", "name": "Scruffy" },
        { "owner": "Higa", "name": "Sam" },
        { "owner": "Ashkenazi", "name": "Walker" },
        { "owner": "Ashkenazi", "name": "Sugar" },
        { "owner": "Price", "name": "Scratches" },
        { "owner": "Price", "name": "Diesel" },
        { "owner": "Hines", "name": "Dusty" }]

      expect(results).toEqual(expectedResult)
    })


  test("SelectMany-Transform with object transfer", async () => {
    const enumerable = Enumerable.of([
      { 'name': 'Higa', 'pets': ["Scruffy", "Sam"] },
      { 'name': 'Ashkenazi', 'pets': ["Walker", "Sugar"] },
      { 'name': 'Price', 'pets': ["Scratches", "Diesel"] },
      { 'name': 'Hines', 'pets': ["Dusty"] },
    ])

    const selection = enumerable
      .SelectMany(x => x.pets, (owner, name) => ({ 'owner': owner, 'name': name }))
      .Where(ownerAndPet => ownerAndPet.owner.name === 'Price')
      .Select(ownerAndPet => (
        { 'owner': ownerAndPet.owner.name, 'pet': ownerAndPet.name }
      ))

    const results = await selection.toArray()
    const expectedResult = [
      { "owner": "Price", "pet": "Scratches" },
      { "owner": "Price", "pet": "Diesel" }
    ]

    expect(results).toEqual(expectedResult)
  })

})
