const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const fs = require('fs');
const admin_password = '123'

let items = []

app.use('/', express.static(__dirname + "/web"))

io.on('connection', (socket) => {
    socket.on("admin", data => {
        if (data == admin_password) {
            socket.emit("admin", true)
        }
        else {
            socket.emit("admin", false)
        }
    })
    socket.on("get_items", () => {
        let get = JSON.parse(fs.readFileSync('item.json'))
        items = get
        socket.emit("get_item", get)
    })
    socket.on("get_item", () => { //admin get item
        let get = JSON.parse(fs.readFileSync("item.json"))
        items = get
        socket.emit("get_item", get)
    })
    socket.on("get_order_id", () => {
        let get = JSON.parse(fs.readFileSync('order.json'))
        socket.emit("order_id", get.length)
        get.push({ id: get.length, items: [], status: 0 })
        let new_data = JSON.stringify(get)
        fs.writeFileSync('order.json', new_data)
    })
    socket.on("order", data => {
        let get_order = JSON.parse(fs.readFileSync('order.json'))
        if (data) {
            let select_order = get_order.find(or => or.id == data.order_id)
            if (select_order.items.length && JSON.stringify(select_order.items) != JSON.stringify(data.cart)) {
                //kalau order seblom ni tak sama, letak status 2 = edited
                select_order.status = 2
            }
            else {
                //kalau order sama tapi status edited, kekalkan edited status
                if (select_order.status == 2) {
                    select_order.status = 2
                }
                else {
                    select_order.status = 1
                }
            }
            select_order.items = data.cart
            let data_string = JSON.stringify(get_order)
            fs.writeFileSync('order.json', data_string)
        }
        io.emit("orders", get_order)
    })
    socket.on("get_order", data => {
        let get_order = JSON.parse(fs.readFileSync('order.json'))
        let order = get_order.find(or => or.id == data)
        socket.emit("order_data", order)
    })
    socket.on("order_done", data => {
        let get_order = JSON.parse(fs.readFileSync('order.json'))
        let order = get_order.find(or => or.id == data)
        order.status = 3
        io.emit("orders", get_order)
        let data_string = JSON.stringify(get_order)
        fs.writeFileSync('order.json', data_string)
    })

    socket.on("add_item", data => {
        let get_data = JSON.parse(fs.readFileSync('item.json'))
        let find1 = get_data.some(item => item.code == data.code)
        if (!find1) {
            get_data.push(data)
            let data_string = JSON.stringify(get_data)
            fs.writeFileSync('item.json', data_string)
            let get = JSON.parse(fs.readFileSync("item.json"))
            items = get
            socket.emit("get_item", get)
        }
    })
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});