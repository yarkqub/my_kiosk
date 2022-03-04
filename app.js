const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
    maxHttpBufferSize: 1e8
});
const fs = require('fs');
const admin_password = '123'
const port = process.env.PORT || 3000;
const electron = require('electron');

if (!fs.existsSync('item.json')) {
    fs.writeFileSync('item.json', '[]');
}
if (!fs.existsSync('order.json')) {
    fs.writeFileSync('order.json', '[]');
}
if (!fs.existsSync('./web/images/index.html')) {
    fs.writeFileSync('./web/images/index.html', '[]');
}

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
    socket.on("client_order", data => {
        let get_order = JSON.parse(fs.readFileSync('order.json'))
        socket.emit("order_id", { order_id: get_order.length, items: data })
        get_order.push({ id: get_order.length, items: data, status: 1 })
        let data_string = JSON.stringify(get_order)
        fs.writeFileSync('order.json', data_string)
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

    socket.on("delete_item", data => {
        let get = JSON.parse(fs.readFileSync('item.json'))
        let get_item = get
        let prev_item = get
        for (let i = 0; i < data.selected.length; i++) {
            get_item = get_item.find(item => item.code == data.selected[i])
            if (i == data.selected.length - 1) {
                if (data.selected.length > 1) {
                    let del_item = prev_item.sub_item
                    del_item.forEach(el => {
                        if (el.code == data.id) {
                            del_item.splice(del_item.indexOf(el), 1)
                        }
                    })
                }
                else {
                    get.forEach(el => {
                        if (el.code == data.id) {
                            get.splice(get.indexOf(el), 1)
                        }
                    })
                }
            }
            else {
                prev_item = get_item
                get_item = get_item.sub_item
            }
        }
        let data_string = JSON.stringify(get)
        fs.writeFileSync('item.json', data_string)
        io.emit("get_item", get)
    })

    socket.on("save_item", data => {
        let get_data = JSON.parse(fs.readFileSync('item.json'))
        let selected = data.edit_selected
        let the_item = get_data
        for (let i = 0; i < selected.length; i++) {
            the_item = the_item.find(item => item.code == selected[i])
            if (i == selected.length - 1) {
                the_item.code = data.code
                the_item.name = data.name
                the_item.price = data.price
                the_item.qty = data.qty
            }
            else {
                the_item = the_item.sub_item
            }
        }
        let data_string = JSON.stringify(get_data)
        fs.writeFileSync('item.json', data_string)
        io.emit("get_item", get_data)
    })

    socket.on("add_item", data => {
        if (data.image) {
            let save_image = data.image.replace(/^data:image\/\w+;base64,/, "")
            let new_name = Date.now() + "_" + rand(1000, 9999) + ".png"
            fs.writeFileSync(`./web/images/${new_name}`, save_image, 'base64')
            data.image = `${new_name}.png`
        }
        let get_data = JSON.parse(fs.readFileSync('item.json'))
        let parent = data.selected
        if (parent.length > 0) {
            let subitem = get_data
            for (let i = 0; i < parent.length; i++) {
                subitem = subitem.find(item => item.code == parent[i])
                if (i == parent.length - 1) {
                    if (subitem.sub_item.length) {
                        let check = subitem.sub_item.some(item => item.code == data.code)
                        if (check) {
                            socket.emit("error_msg", "Code already exist")
                        }
                        else {
                            subitem.sub_item.push(data)
                            let data_string = JSON.stringify(get_data)
                            fs.writeFileSync('item.json', data_string)
                            io.emit("get_item", get_data)
                        }
                    }
                    else {
                        subitem.sub_item.push(data)
                        let data_string = JSON.stringify(get_data)
                        fs.writeFileSync('item.json', data_string)
                        io.emit("get_item", get_data)
                    }
                }
                else {
                    if (subitem.sub_item.length) {
                        subitem = subitem.sub_item
                    }
                }
            }
        }
        else {
            let find1 = get_data.some(item => item.code == data.code)
            if (!find1) {
                get_data.push(data)
                let data_string = JSON.stringify(get_data)
                fs.writeFileSync('item.json', data_string)
                let get = JSON.parse(fs.readFileSync("item.json"))
                items = get
                io.emit("get_item", get)
            }
        }
    })
});

//create electron window
const createWindow = () => {
    const win = new electron.BrowserWindow({
        kiosk: true,
        autoHideMenuBar: true,
        webContents: {
            print: { silent: true }
        }
    });
    win.removeMenu();
    win.loadURL(`http://127.0.0.1:${port}/app.html`);
}
electron.app.whenReady().then(createWindow);

server.listen(port, () => {
    console.log(`listening on *: ${port}`);
});

function rand(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}