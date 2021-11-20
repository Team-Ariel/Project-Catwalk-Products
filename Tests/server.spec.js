
const request = require("supertest");
const agent = require("superagent");


describe('/products/:product endpoint', () => {
  let id = 1;
  let path = `http://127.0.0.1:3000/products/${id}`

  var request = (url) => {
    return agent.get(url)
  }

  it('Should return results in the correct format', () => {
    return request(path)
    .then((result) => {
        expect(result.body).toEqual(expect.objectContaining({
          id: expect.any(Number),
          slogan: expect.any(String),
          description: expect.any(String),
          name: expect.any(String),
          category: expect.any(String),
          default_price: expect.any(String),
          features: expect.any(Array)
        }))
      })
    })
  it('Should not resolve request for invalid productID', () => {
     id = 2939249843028034820;
     path = `http://127.0.0.1:3000/products/${id}`
    return request(path)
    .then((response) => {
      expect(response).toBe(undefined);
    })
    .catch((err) => {
     expect(err).toBeDefined();
    })
  })
  it('Should resolve in under 2000ms', () => {
    const start = Date.now()
    id = 1000000;
    path = `http://127.0.0.1:3000/products/${id}`
    return request(path)
    .then((response) => {
      const duration = Date.now() - start
      console.log(`executed query in ${duration}`)
      expect(duration).toBeLessThanOrEqual(2000)
    })
  })
  })

describe('/products endpoint', () => {
  let page = 2;
  let count = 4;

  let request = (count, page = 1) => {
    return agent.get(`http://127.0.0.1:3000/products/?count=${count}&page=${page}`)
  }

  it('Should return results based on count parameter', async () => {
    counts = [5, 2, 3, 0, 2];
    let request0 = request(counts[0])
    let request1 = request(counts[1])
    let request2 = request(counts[2])
    let request3 = request(counts[3])
    let request4 = request(counts[4])

    return Promise.all([request0, request1, request2, request3, request4])
      .then((values) => {
      expect(values[0].body.length).toBe(5);
      expect(values[1].body.length).toBe(2);
      expect(values[2].body.length).toBe(3);
      expect(values[3].body.length).toBe(0);
      expect(values[4].body.length).toBe(2);

      })


  })
  it('Should resolve in under 2000ms', () => {
    const start = Date.now()
    return request(5, 200000)
    .then((response) => {
      const duration = Date.now() - start
      console.log(`executed query in ${duration} milliseconds`)
      expect(duration).toBeLessThanOrEqual(2000)
    })
  })
})

describe('/products/id/styles endpoint', () => {
  let id = 1000000;
  let path = `http://127.0.0.1:3000/products/${id}/styles`
  var request = (url) => {
    return agent.get(url)
  }

  it('Should return results in the correct format', () => {
    return request(path)
    .then((result) => {
      expect(result.body).toEqual(expect.objectContaining({
        results: expect.any(Object),
        product_id: expect.any(String)
      }))
      expect(result.body.results).toEqual(expect.objectContaining({
        style_id: expect.any(Number),
        name: expect.any(String),
        photos: expect.any(Array),
        skus: expect.any(Object)
      }))
      if(result.body.results.photos.length > 0) {
        result.body.results.photos.forEach(photo => {
          expect(photo).toEqual(expect.objectContaining({
            url: expect.any(String),
            thumbnail_url: expect.any(String)
          }))
        })
      }
      for (let key in result.body.results.skus) {
        expect(result.body.results.skus[key]).toEqual(expect.objectContaining({
          quantity: expect.any(Number),
          size: expect.any(String)
        }))
      }

    })
  })


  it('Should resolve in under 2000ms', () => {
    const start = Date.now()
    return request(path)
    .then((result) => {
      const duration = Date.now() - start
      console.log(`executed query in ${duration} milliseconds`)
      expect(Date.now() - start).toBeLessThanOrEqual(2000);
    })
  })

})

