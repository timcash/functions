const rp = require('request-promise')
const ftp_client = require('ftp')
const fs = require('fs')
const moment = require('moment')
const co = require('co')

function log(d) {
  console.log(d)
}

// ==============================================
//
//                       FTP
//
// ==============================================
function writeToFtp(user, pass, host, port, file_prefix, data) {
  const time = moment().format('YYYYMMDDhhmm')
  const filename = `/Drop/${file_prefix}-${time}.xml`
  return new Promise((resolve, reject) => {
    var c = new ftp_client()
    c.on('ready', function() {
      log('CONNECTED')
      c.put(data, filename, function(err) {
        if (err) {
          log('ERROR')
          c.end()
          reject(err)
        } else {
          log('COMPLETE')
          c.end()
          resolve(`file uploaded to ${filename}`)
        }
      })
    })

    c.connect({
      host:host,
      port:parseInt(port),
      user:user,
      password:pass
    })
  })
}

// ==============================================
//
//                 Fetch the File
//
// ==============================================
const getTheFile = co.wrap(function*(url) {
  const options = {
    uri: url,
    headers: {
      'User-Agent': 'Request-Promise'
    }
  }
  const result = yield rp(options)
  return result
})

const moveTheFileFromTheUrl = co.wrap(function*(user, pass, host, port, file_prefix, url) {
  try {
    const data = yield getTheFile(url)
    const uploadResult = yield writeToFtp(user, pass, host, port, file_prefix, data)
    return uploadResult
  } catch (e) {
    return e.toString()
  }
})


exports.transfer_jobs = co.wrap(function *(req, res) {
  if (req.body.source_url === undefined) {
    res.status(400).send('No source_url defined');
  } else {
    const {user, pass, host, port, file_prefix, source_url} = req.body
    const result = yield moveTheFileFromTheUrl(user, pass, host, port, file_prefix, source_url)
    res.status(200).send('Success: ' + result)
  }
})
