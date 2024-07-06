CREATE TABLE users (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    name TEXT NOT NULL, 
    email TEXT UNIQUE NOT NULL,
    password TEXT UNIQUE NOT NULL,
    created_at TEXT DEFAULT(DATETIME()) NOT NULL
);
CREATE TABLE products (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT NOT NULL
);
CREATE TABLE pedidos (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    preco_total REAL NOT NULL,
    comprador_id TEXT NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY (comprador_id) REFERENCES users(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);
CREATE TABLE produtos_pedidos(
    produto_id TEXT NOT NULL,
    pedidos_id TEXT NOT NULL,
    quantidades INTEGER NOT NULL,
    FOREIGN KEY (produto_id) REFERENCES products(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY (pedidos_id) REFERENCES pedidos(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);