#!/usr/bin/env node
/* globals ls */
// var program = require('commander')
// program.command('node scripts/upload.js')
require('shelljs/global')
var http = require('http');
var fs = require('fs');
var crypto = require('crypto')
var path = require('path')
// import {
//   dirname,
//   basename
// } from 'path'

var UploadFileData = []
var uploadPromise = []
const options = {
  hostname: 'member.koudaiqifu.cn',
  path: '/webTools/uploadImage',
  method: 'POST',
  headers: {
    'Content-Type': ' multipart/form-data;'
  }
}

// 1. 列出images文件夹中的所有文件并循环
ls(['images/**/**.*']).forEach(file => {
  upload(path.dirname(file), path.basename(file), getEtag(file))
})

function upload(path, name, hash) {
  if (/.(json|gitkeep)$/.test(name)) return ''
  var imgReg = /.+(.JPEG|.jpeg|.JPG|.jpg|.png)$/g
  if (!imgReg.test(name)) return ''
  let hasMessge = fs.existsSync(`images/message.json`)
  if (hasMessge) {
    const message = JSON.parse(fs.readFileSync(`images/message.json`))
    let isupload = false
    message.forEach((item) => {
      if (item.name === name && item.hash === hash) {
        isupload = true
      }
    })
    if (isupload) {
      console.log('已上传')
    } else {
      uploadPromise.push(uploadFun(path, name))
    }
  } else {
    uploadPromise.push(uploadFun(path, name))
  }
}
// 1.先检查images文件夹中是否有message.json文件
// let hasMessge = fs.existsSync(`images/message.json`)



// 2.文件夹文件读取
// var readDir = fs.readdirSync('images');

// 3.循环文件夹中的文件 是图片文件就上传
// readDir.forEach(file => {
//   var imgReg = /.+(.JPEG|.jpeg|.JPG|.jpg|.png)$/g
//   if (imgReg.test(file)) {
//     if (hasMessge) {
//       const message = JSON.parse(fs.readFileSync(`images/message.json`))
//       let isupload = false
//       message.forEach((item) => {
//         if (item.name === file && item.hash === getEtag(`images/${file}`)) {
//           isupload = true
//         }
//       })
//       if (isupload) {
//         // console.log('已上传')
//       } else {
//         uploadPromise.push(uploadFun(file))
//       }
//     } else {
//       uploadPromise.push(uploadFun(file))
//     }
//   }
// })

// 上传完所有图片后 创建message.json文件 存储图片信息
Promise.all(uploadPromise).then(res => {
  let hasMessge = fs.existsSync(`images/message.json`)
  if (hasMessge) {
    const message = JSON.parse(fs.readFileSync(`images/message.json`))
    const newArr = message.concat(UploadFileData)
    fs.unlinkSync(`images/message.json`)
    fs.appendFileSync('images/message.json', JSON.stringify(newArr, null, '\t'))
  } else {
    fs.appendFileSync('images/message.json', JSON.stringify(UploadFileData, null, '\t'))
  }
})


// 文件上传后读写到json文件中
const prepareData = (fileData, file) => {
  var uploadData = {}
  let hash = getEtag(`${file}`)
  uploadData.name = fileData.data.file_name
  uploadData.url = fileData.data.file_url
  uploadData.hash = hash
  UploadFileData.push(uploadData)
}

// 文件上传
function uploadFun(path, name) {
  let file = `${path}/${name}`
  console.log(file)
  return new Promise((resolve) => {
    var readfile = fs.readFileSync(`${file}`)
    const req = http.request(options, (res) => {
      res.on('data', (e) => {
        prepareData(JSON.parse(e), file)
        resolve()
      });
    })
    var boundaryKey = Math.random().toString(16);
    var enddata = '\r\n--' + boundaryKey + '--';
    var payload = '--' + boundaryKey + '\r\n'
      + 'Content-Type: image/jpeg\r\n'
      + 'Content-Disposition: form-data; name="file"; filename=' + file + '\r\n'
      + 'Content-Transfer-Encoding: binary\r\n\r\n';
    req.setHeader('Content-Type', 'multipart/form-data; boundary=' + boundaryKey + '');
    req.setHeader('Content-Length', Buffer.byteLength(payload) + Buffer.byteLength(enddata) + readfile.length);
    req.write(payload);
    req.on('error', function (e) {
      console.error("error:" + e);
    });
    var fileStream = fs.createReadStream(`${file}`);
    fileStream.pipe(req, { end: false });
    fileStream.on('end', function () {
      req.end(enddata);
    });
  })
}

// 获取hash 
function getEtag(file) {
  // 以4M为单位分割
  var blockSize = 4 * 1024 * 1024
  var sha1String = []
  var prefix = 0x16
  var blockCount = 0

  // sha1算法
  var sha1 = function (content) {
    var sha1 = crypto.createHash('sha1')
    sha1.update(content)
    return sha1.digest()
  }

  function calcEtag() {
    if (!sha1String.length) {
      return 'Fto5o-5ea0sNMlW_75VgGJCv2AcJ'
    }
    var sha1Buffer = Buffer.concat(sha1String, blockCount * 20)

    // 如果大于4M，则对各个块的sha1结果再次sha1
    if (blockCount > 1) {
      prefix = 0x96
      sha1Buffer = sha1(sha1Buffer)
    }

    sha1Buffer = Buffer.concat(
      [new Buffer([prefix]), sha1Buffer],
      sha1Buffer.length + 1
    )

    return sha1Buffer.toString('base64')
      .replace(/\//g, '_').replace(/\+/g, '-')
  }

  let buffer = fs.readFileSync(file)
  var bufferSize = buffer.length
  blockCount = Math.ceil(bufferSize / blockSize)

  for (var i = 0; i < blockCount; i++) {
    sha1String.push(sha1(buffer.slice(i * blockSize, (i + 1) * blockSize)))
  }

  return calcEtag()
}


