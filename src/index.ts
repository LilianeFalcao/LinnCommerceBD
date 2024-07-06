import express, { Request, Response } from 'express'
import cors from 'cors'
import { db } from './database/knex';

const app = express()

app.use(cors())
app.use(express.json())

app.listen(3003, () => {
  console.log(`Servidor rodando na porta ${3003}`)
});

app.get("/users", async(req: Request, res: Response) => {
  try {
    const result = await db.select("*").from("users")

    res.status(200).send(result)
    
  } catch (error) {
    console.log(error)
    res.status(400).send("Algo deu errado")
  }
})

app.post("/users", async(req: Request, res: Response) => {
    try {
      const id = req.body.id
      const name = req.body.name
      const email = req.body.email
      const password = req.body.password

      if (!id || !name ||!email || !password ) {
          res.status(400)
          throw new Error("Dados inválidos")
      }

      await db.insert({
        id: id,
        name: name,
        email: email,
        password: password,
      }).into("users")

      res.status(200).send({ message: "Usuário cadastrado com sucesso!" })
    } catch (error) {
        console.log(error)
        res.status(400).send("Algo deu errado")
    }
})

//produtos
app.get("/products", async(req: Request, res: Response) => {
  try {
    const result = await db.select("*").from("products")

    res.status(200).send(result)
    
  } catch (error) {
    console.log(error)
    res.status(400).send("Algo deu errado")
  }
})

app.post("/products", async(req: Request, res: Response) => {
  try {
    const id = req.body.id
    const name = req.body.name
    const price = req.body.price
    const description = req.body.description
    const image_url = req.body.image_url

    if (!id || !name || isNaN(price) ||!description || !image_url ) {
        res.status(400)
        throw new Error("Dados inválidos")
    }

    await db.insert({
      id: id,
      name: name,
      price: price,
      description: description,
      image_url: image_url,
    }).into("products")

    res.status(200).send({ message: "Produto cadastrado com sucesso!" })
  } catch (error) {
      console.log(error)
      res.status(400).send("Algo deu errado")
  }
})

//pedidos 

app.get("/pedidos", async(req: Request, res: Response) => {
  try {
    const result = await db.select("*").from("pedidos")

    res.status(200).send(result)
    
  } catch (error) {
    console.log(error)
    res.status(400).send("Algo deu errado")
  }
})

app.post("/pedidos", async(req: Request, res: Response) => {
  try {
    const id = req.body.id
    const preco_total = req.body.preco_total
    const comprador_id = req.body.comprador_id

    if (!id || isNaN(preco_total) || !comprador_id ) {
        res.status(400)
        throw new Error("Dados inválidos")
    }

    const createdAt = new Date().toISOString();

    await db.insert({
      id: id,
      preco_total: preco_total,
      comprador_id: comprador_id,
      created_at: createdAt,
    }).into("pedidos")

    res.status(200).send("Pedido realizado com sucesso!" )
  } catch (error) {
      console.log(error)
      res.status(400).send("Algo deu errado")
  }
})


app.post("/produtosPedidos", async(req: Request, res: Response) => {
  try {
      const produto_id = req.body.produto_id
      const pedidos_id = req.body.pedidos_id
      const quantidades = req.body.quantidades
  
      if (typeof quantidades !== 'number' || isNaN(quantidades) || quantidades <= 0) {
        res.status(400);
        throw new Error("quantidades inválida");
      }
  
      if (!produto_id || typeof produto_id !== 'string') {
        res.status(400);
        throw new Error("ID do produto inválido ou ausente");
      }
  
      if (!pedidos_id || typeof pedidos_id !== 'string') {
        res.status(400);
        throw new Error("ID do pedido inválido ou ausente");
      }
  
      await db.insert({
        produto_id: produto_id,
        pedidos_id: pedidos_id,
        quantidades: quantidades,
      }).into("produtos_pedidos");
  
      res.status(201).send("ProdutoPedido realizado com sucesso!" )
  } catch (error) {
      console.log(error)
      res.status(400).send("Algo deu errado")
  }
})

//update prod
app.put("/products/:id", async(req: Request, res: Response) => {
    try {
      const id = req.params.id

        const newId = req.body.id
        const newName = req.body.name
        const newPrice = req.body.price
        const newDescription = req.body.description
        const newImageUrl = req.body.image_url

        if(newId !== undefined){
          if(typeof newId !== "string"){
              res.status(400)
              throw new Error("'id' deve ser string")
          }

          if(newId.length < 2){
              res.status(400)
              throw new Error("'name' deve possuir no mínimo 2 caracteres")
          }
        }

        if( newPrice !== undefined){
            if (typeof newPrice !== "number") {
                res.status(400)
                throw new Error("'Price' deve ser number")
            }

            if (newPrice < 0) {
                res.status(400)
                throw new Error("'price' não pode ser negativo")
            }
        } 

        const [ products ] = await db.select("*").from("products").where({ id: id })

        if(products){
          await db.update({
            id: newId || products.id,
            name: newName || products.name,
            price:  newPrice || products.price,
            description: newDescription || products.description,
            image_url:  newImageUrl || products.image_url,
          }).from("products").where({ id: id })
        }else {
          res.status(404)
          throw new Error("'id' não encontrada")
        }

        res.status(200).send({ message: "Atualização realizada com sucesso" })
    } catch (error) {
      console.log(error)
      res.status(400).send("Algo deu errado")
    }
})

app.delete("/pedidos/:id", async(req: Request, res: Response) => {
  try {
    const idToDelete = req.params.id

    const [ pedido ] = await db.select("*").from("pedidos").where({id: idToDelete})

    if(!pedido){
      res.status(404)
      throw new Error("'id' não encontrada")
    }

    await db.delete().from("pedidos").where({ id: idToDelete })
    
    res.status(200).send({ message: "pedido deletado com sucesso" })
  } catch (error) {
    console.log(error)
    res.status(400).send("Algo deu errado")
  }
})

// Endpoint para obter um pedido por ID
app.get("/pedidos/:id", async (req: Request, res: Response) => {
  try {
    const idToSearch = req.params.id

    // Verifica se o ID é válido
    if (!idToSearch) {
      res.status(400).send({ message: "ID do pedido inválido ou ausente" });
      return;
    }

    // Busca o pedido pelo ID
    const result = await db.select("*").from("pedidos").where({ id: idToSearch });

    // Verifica se o pedido foi encontrado
    if (result.length === 0) {
      res.status(404).send({ message: "Pedido não encontrado" });
      return;
    }

    // Retorna os detalhes do pedido
    res.status(200).send(result[0]);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Algo deu errado", error});
  }
});
