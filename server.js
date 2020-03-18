
const http = require('http');
const path = require('path');
const fs = require('fs');
let battle_controller = require('./battle_controller')

async function move_unit_iteratively(data) {
  io.sockets.emit('drawpathstop', {})
  for (let i = data[0].length - 1; i >= 0 ; i--) {
    let curtile = controller.battlefield[data[0][i][0].X][data[0][i][0].Y]
    let moved = controller.move_squad_to_tile(data[1], data[0][i][0], {cost: curtile.mp_required})
    if (moved === false) {
      i = -1
      controller.players[data[1].player].squads[data[1].index].has_moved = true
      io.sockets.emit('updatesquad', {squad: controller.players[data[1].player].squads[data[1].index], index: data[1].index, player: data[1].player, path: []})
      break
    }
    let new_path = []
    new_path.push(data[0][i])

    io.sockets.emit('updatesquad', {squad: controller.players[data[1].player].squads[data[1].index], index: data[1].index, player: data[1].player, path: new_path})
    controller.players[data[1].player].create_visibility_map(controller.battlefield)
    controller.players[data[1].player].get_visible_tile(controller.battlefield)
    io.sockets.emit('getvisibility', {visibility_map: controller.players[data[1].player].visibility_map, player: data[1].player});
    await sleep(100)
  }
  controller.players[data[1].player].squads[data[1].index].has_moved = true
  io.sockets.emit('updatesquad', {squad: controller.players[data[1].player].squads[data[1].index], index: data[1].index, player: data[1].player, path: []})
}


function sleep(ms){
  return new Promise(resolve=>{
      setTimeout(resolve,ms)
  })
}
function handleRequest(req, res) {
  // What did we request?
  let pathname = req.url;
  
  // If blank let's ask for index.html
  if (pathname == '/') {
    pathname = '/index.html';
  }
  
  // Ok what's our file extension
  let ext = path.extname(pathname);

  // Map extension to file type
  const typeExt = {
    '.html': 'text/html',
    '.js':   'text/javascript',
    '.css':  'text/css'
  };

  // What is it?  Default to plain text
  let contentType = typeExt[ext] || 'text/plain';

  // Now read and write back the file with the appropriate content type
  fs.readFile(__dirname + pathname,
    function (err, data) {
      if (err) {
        res.writeHead(500);
        return res.end('Error loading ' + pathname);
      }
      // Dynamically setting content type
      res.writeHead(200,{ 'Content-Type': contentType });
      res.end(data);
    }
  );
}


let server = http.createServer(handleRequest);
let controller = battle_controller.new()
server.listen(8082);
let io = require('socket.io').listen(server);
io.sockets.on('connection',
  function (socket) {
    console.log("We have a new client: " + socket.id);
    io.sockets.emit('Init', controller)

    socket.on('movesquadtile',
    function (data) {
      // console.log(data)
      let squad = controller.players[data.player].squads[data.index]
      let squadX = squad.X
      let squadY = squad.Y
      let target_tile = controller.battlefield[data.X][data.Y]
      let squad_info = {player: data.player, index: data.index}
      let res = controller.check_squad_access_tile(squad_info, {X: squadX, Y: squadY}, target_tile)
      if (res) {
        // console.log(res)
        io.sockets.emit('drawpath', {res: res})
      }
      // io.sockets.emit('updatesquad', {squad: controller.players[data.player].squads[data.index], index: data.index, player: data.player})

    }
  );
  socket.on('movesquadtile2',
  async function (data) {
    move_unit_iteratively(data)
   }
  );

    socket.on('attacksquad',
    function (data) {
      // console.log(data)
      let attacker = controller.players[data.attacker.player].squads[data.attacker.index]
      let defender = controller.players[data.defender.player].squads[data.defender.index]
      let range =  Math.abs(attacker.X - defender.X) + Math.abs(attacker.Y - defender.Y)
      if (range <= attacker.max_range && range >= attacker.min_range){
        if (attacker.has_attacked === false) {
          let tgt_tile = controller.battlefield[defender.X][defender.Y]
          attacker.attack_squad(defender, range, tgt_tile)
          controller.players[data.defender.player].check_squad_existing(controller.battlefield)
          io.sockets.emit('updatesquad', {squad: attacker, index: data.attacker.index, player:data.attacker.player, path: []})
          io.sockets.emit('updatesquad', {squad: defender, index: data.defender.index, player:data.defender.player, path: []})
        } else {
          console.log("Squad already attacked")
        }
      }else {
        console.log("Out of range")
      }
    
    }
  );
    socket.on('endturn',
    function (data) {
        for (let j = 0; j < controller.players[controller.turn].squads.length; j++){
          let squad = controller.players[controller.turn].squads[j]
          controller.turn = data.index
          if (squad.owner === data.index) {
              squad.has_attacked = false
              squad.has_moved = false
              squad.cur_movement = squad.movement
              io.sockets.emit('updatesquad', {squad: squad, index: j, player: controller.turn, path: []})
        }
      }
      if (controller.turn === 0){
        controller.turn = 1

        //move AI
          for (let l = 0; l < controller.players[controller.turn].squads.length; l++) {
            let squads_that_acted = []
            let attacked_squads = []
            let squad = controller.player_reb.squads[l]
            // console.log(squad.vision)
            if (squad.AI) {
                controller.players[controller.turn].create_visibility_map(controller.battlefield)
                controller.players[controller.turn].get_visible_tile(controller.battlefield)
                squad.AI.update_desire_map(controller.battlefield, squad.X, squad.Y, controller.players[controller.turn].visibility_map)
                let distances = squad.AI.BFS({X: squad.X, Y: squad.Y}, controller.battlefield, 1)
                let in_potential_range = [] 
                for (let i = 0 ; i < controller.battlefield.length; i++) {
                    for (let j = 0 ; j < controller.battlefield[0].length; j++) {
                        if (distances[i][j] <= squad.cur_movement) {
                            in_potential_range.push({X: i, Y: j, priority: squad.AI.final_desire_map[i][j]})
                            // if (squad.AI.behavior === 'attack') {
                            //     in_potential_range.push({X: i, Y: j, priority: squad.AI.desire_map_attack[i][j]})
                            // }
                            // if (squad.AI.behavior === 'flee') {
                            //     in_potential_range.push({X: i, Y: j, priority: squad.AI.desire_map_flee[i][j]})
                            // }
                        }
                    }
                }
                
                let tile_inf = controller.get_tile_to_move(in_potential_range)
                while (tile_inf[1] !== -1) {
                    let tile = in_potential_range[tile_inf[1]]
                    let checkAccess = controller.check_squad_access_tile({player: controller.turn, index: l}, squad, controller.battlefield[tile.X][tile.Y])
                    if (checkAccess) {
                      
                      let canGo = checkAccess[3]
                      if (canGo !== null) {
                        move_unit_iteratively(checkAccess)
                        // controller.move_squad_to_tile({player: controller.turn, index: l},{X: tile.X, Y: tile.Y}, canGo)
                        // controller.players[controller.turn].create_visibility_map(controller.battlefield)
                        // controller.players[controller.turn].get_visible_tile(controller.battlefield)
                        squads_that_acted.push({squad: squad, index: l, player: 1, path: []})
                        priority = 1001
                        for (let k = 0; k < controller.players[0].squads.length; k++) {
                          let target_squad = controller.players[0].squads[k]
                          if (controller.players[controller.turn].visibility_map[target_squad.X][target_squad.Y] !== 0) {
                          let range = Math.abs(squad.X - target_squad.X) + Math.abs(squad.Y - target_squad.Y)
                          if (range <= squad.max_range && range >= squad.min_range) {
                            if (squad.has_attacked === false) {
                              
                                let tgt_tile = controller.battlefield[target_squad.X][target_squad.Y]
                                squad.attack_squad(target_squad, range, tgt_tile)
                                controller.players[target_squad.owner].check_squad_existing(controller.battlefield)
                                attacked_squads.push({squad: target_squad, index: k, player: 0, path: []})
                            }
                          }
                        }
                        }
                        // tile_inf[1] = -1
                        break
                      } else {
                        in_potential_range.splice(tile_inf[1], 1)
                        tile_inf = controller.get_tile_to_move(in_potential_range)
                      }
                    } else {
                      in_potential_range.splice(tile_inf[1], 1)
                      tile_inf = controller.get_tile_to_move(in_potential_range)
                    }
                }
            if (squads_that_acted.length > 0) {
              for (let squad of squads_that_acted) {
                io.sockets.emit('updatesquad', squad)
              }
              if (attacked_squads.length > 0) {
                for (let squad of attacked_squads) {
                  io.sockets.emit('updatesquad', squad)
                }
              }
            }
          }
        }
        io.sockets.emit('getvisibility', {visibility_map: controller.players[controller.turn].visibility_map, player: controller.turn});
      } else {
        controller.turn = 0
      }
      
      io.sockets.emit('updateturn', {index: controller.turn})
    }
  );
  }
);

console.log('Server started on port 8082');