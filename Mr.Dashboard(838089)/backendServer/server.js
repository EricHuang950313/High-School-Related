// Run "npm init in the Terminal"
// Use your own discord bot token, database, origin url

const express = require('express');
const cors = require('cors');
const corsOptions = {
  origin: [
    '#ORIGIN_URL#',
  ]
}

const axios = require('axios');
const NodeRSA = require('node-rsa');
var crypto = require('crypto');

converter = require('hex2dec');

const app = express();
const port = 3000;
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static('dist'));

let key = new NodeRSA({b:512});
let publicKey = key.exportKey('pkcs8-public');
let privateKey = key.exportKey('pkcs8-private');

const bot = '==BOT_TOKEN HERE==';

app.post('/getKey', (req, res) => {
  console.log('/getKey');
  res.send(publicKey);
})

app.post('/passSecret', async(req, res) => {
  console.log('/passSecret');
  let key = new NodeRSA({b:512});
  key.importKey(privateKey);
  let decrypted = key.decrypt(req.body.data, 'utf8');
  decrypted = decrypted.split(',');
  const admin = ['==ADMINID HERE=='];
  if (admin.includes(decrypted[0]) === false){
    res.send('failed-a');
  } else if (decrypted[1] !== '==PASSWORD HERE=='){
    res.send('failed-p');
  } else{
    let re = await axios({
      method: 'get',
      url: '==DATABASE URL==',
      headers: {
        Authorization: bot
      }
      });
    let data = re.data;
    let auth = 'Panel?authentication='+crypto.randomBytes(48).toString('hex');
    let href = '#ORIGIN_URL#/'+auth
    data[href] = Date.now();
    axios.post('==DATABASE URL==', data);
    res.send(auth);
  }
})

app.post('/panelauth', (req, res) => {
  console.log('/panelauth');
  axios.get('==DATABASE URL==')
    .then((ress) => { 
      var authlist = Object.keys(ress.data).map((key) => key);
      var tf = false;
      for (let i=0; i<Object.keys(ress.data).length; i++){
        if (authlist[i].slice(49) == req.body.data){
          tf = true;
          res.send('success');
          break;
        }
      }
      if (tf == false){
        res.send('failed');
      }
    })
})

app.post('/sendMessage', async(req, res) => {
  console.log('/sendMessage');
  let datetime = new Date();
  if (req.body.mesType == 'normal'){
    await axios({
      method: 'post',
      url: 'https://discord.com/api/channels/==DISCORD CHANNEL ID==/messages',
      headers: {
        Authorization: bot
      },
      data: {
        content: req.body.contents,
      }
    });
  } else{
    await axios({
      method: 'post',
      url: 'https://discord.com/api/channels/==DISCORD CHANNEL ID==/messages',
      headers: {
        Authorization: bot
      },
      data: {
        "embeds": [{
          "title": req.body.title,
          "description": `${req.body.contents}\n\n${req.body.s ? 'By SRAFFG Administrators\n' : ''}${req.body.d ? datetime.toISOString().slice(0,10) : ''}`,
          "color": converter.hexToDec(req.body.color)
        }]
      }
    })
  }
  res.send('success');
})

app.post('/sendDM', async(req, res) => {
  console.log('/sendDM');
  if (req.body.dm_stage==1){
    try {
      let re = await axios({
      method: 'get',
      url: `https://discord.com/api/guilds/==DISCORD GUILD ID==/members/${req.body.userId}`,
      headers: {
        Authorization: bot
      }
      })
      res.send(re.data['user']['username']+'#'+re.data['user']['discriminator']);
    } catch(err){
      res.send('noData');
    }
  } else{
    let re = await axios({
      method: 'post',
      url: 'https://discord.com/api/users/@me/channels',
      headers: {
        Authorization: bot
      },
      data: {
        recipient_id: req.body.userId
      }
    });
    await axios({
      method: 'post',
      url: `https://discord.com/api/channels/${Object.values(re).pop(-1)['id']}/messages`,
      headers: {
        Authorization: bot
      },
      data: {
        content: req.body.dmContents,
      }
    });
    res.send('success');
  }  
})

app.post('/search', async(req, res) => {
  console.log('/search');
  let re = await axios({
    method: 'get',
    url: `https://discord.com/api/guilds/==DISCORD GUILD ID==/members/search?query=${req.body.searchName}&limit=3`,
    headers: {
      Authorization: bot
    }
  });
  let list = [];
  for(let i=0; i<re.data.length; i+=1){
    list.push([re.data[i].user.id, re.data[i].user.username]);
  }
  res.send(list);
})

app.post('/getRole', async(req, res) => {
  console.log('/getRole');
  let re = await axios({
    method: 'get',
    url: 'https://discord.com/api/guilds/==DISCORD GUILD ID==/roles',
    headers: {
      Authorization: bot
    }
  });
  let list = [];
  for(let i=0; i<re.data.length; i+=1){
    list.push([re.data[i].id, re.data[i].name]);
  }
  res.send(list.slice(1, -1));
})

app.post('/modifyRole', async(req, res) => {
  console.log('/modifyRole');
  let include = null;
  let target = [];
  let re = '';
  for(let i=0; i<req.body.users.length; i++){
    target.push(req.body.users[i][0]);
  }
  for(let i=0; i<target.length; i++){
    re = await axios({
      method: 'get',
      url: `https://discord.com/api/guilds/==DISCORD GUILD ID==/members/${target[i]}`,
      headers: {
        Authorization: bot
      }
    });
    if(re.data.roles.includes(String(req.body.role[0]))){
      include = true;
    } else{
      include = false;
    }
  }
  if (req.body.type == 'add'){
    if (include==true){
      res.send('The user has the role already!');
    } else{
      for(let i=0; i<target.length; i++){
        re = await axios({
          method: 'put',
          url: `https://discord.com/api/guilds/==DISCORD GUILD ID==/members/${target[i]}/roles/${req.body.role[0]}`,
          headers: {
            Authorization: bot
          }
        }); 
      } 
      res.send('Successfully added the role!');
    }
  } else{
    if (include==false){
      res.send('The user doesn\'t has the role to remove!');
    } else{
      for(let i=0; i<target.length; i++){
        re = await axios({
          method: 'delete',
          url: `https://discord.com/api/guilds/==DISCORD GUILD ID==/members/${target[i]}/roles/${req.body.role[0]}`,
          headers: {
            Authorization: bot
          }
        }); 
      } 
      res.send('Successfully removed the role!');
    }
  }
})

app.post('/getBans', async(req, res) => {
  console.log('/getBans');
  let re = await axios({
    method: 'get',
    url: 'https://discord.com/api/guilds/==DISCORD GUILD ID==/bans',
    headers: {
      Authorization: bot
    }
  });
  if(re.data.length == 0){
    res.send(re.data);
  } else{
    let banList = [];
    for(let i=0; i<re.data.length; i++){
      banList.push([re.data[i].user.id, re.data[i].user.username]);
    }
    res.send(banList);
  }
})

app.post('/ban', async(req, res) => {
  console.log('/ban');
  let re = await axios({
    method: 'get',
    url: `https://discord.com/api/guilds/==DISCORD GUILD ID==/members/${req.body.id}`,
    headers: {
      Authorization: bot
    }
  });
  await axios({
    method: 'put',
    url: `https://discord.com/api/guilds/==DISCORD GUILD ID==/bans/${req.body.id}?reason=admin_decision`,
    headers: {
      Authorization: bot,
    }
  });
  let n_list = req.body.list;
  n_list.push([re.data.user.id, re.data.user.username]);
  res.send(n_list);
})

app.post('/removeBan', async(req, res) => {
  console.log('/removeBan');
  await axios({
    method: 'delete',
    url: `https://discord.com/api/guilds/==DISCORD GUILD ID==/bans/${req.body.list[req.body.id][0]}`,
    headers: {
      Authorization: bot
    }
  });
  let n_list = req.body.list;
  n_list.splice(req.body.id, 1);
  res.send(n_list);
})

app.post('/getLog', async(req, res) => {
  console.log('/getLog');
  axios.get('==DATABASE URL==')
    .then((ress) => { 
      res.send(ress.data);
    })
})

app.post('/sendLog', async(req, res) => {
  console.log('/sendLog');
  await axios({
    method: 'post',
    url: '==DATABASE URL==',
    data: {
      data: req.body.data
    }
  });
})

app.post('/getGoal', async(req, res) => {
  console.log('/getGoal');
  let re = await axios({
    method: 'get',
    url: '==DATABASE URL==',
  })
  res.send(re.data.data);
})

app.post('/updateGoal', async(req, res) => {
  console.log('/updateGoal');
  await axios({
    method: 'post',
    url: '==DATABASE URL==',
    data: {
      data: req.body.data
    } 
  });
})

app.get('/authAutoDelete', async(req, res) => {
  console.log('/authAutoDelete');
  let re = await axios({
    method: 'get',
    url: '==DATABASE URL=='
  });
  re = re.data;
  let times = Object.values(re);
  for(let i=0; i<times.length; i++){
    if(Date.now()-times[i]>600000){
      delete re[Object.keys(re)[i]];
    }
  }
  axios.post('==DATABASE URL==', re)
})

app.post('/authDelete', async(req, res) => {
  console.log('/authDelete');
  let del = '#ORIGIN_URL#/Panel?authentication='+req.body.data;
  let re = await axios({
    method: 'get',
    url: '==DATABASE URL=='
  })
  re = re.data;
  delete re[del];
  axios.post('==DATABASE URL==', re);
})


app.listen(port, () => {
  console.log(`./backendServer/server.js listening at http://localhost:${port}`)
})