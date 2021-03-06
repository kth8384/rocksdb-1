const test       = require('tape')
    , testCommon = require('abstract-leveldown/testCommon')
    , leveldown  = require('../')

var db

test('setUp common', testCommon.setUp)

test('setUp db', function (t) {
  db = leveldown(testCommon.location())
  db.open(t.end.bind(t))
})

test('test compactRange() frees disk space after key deletion', function (t) {
  var key1 = '000000'
  var key2 = '000001'
  var val1 = Buffer(64).fill(1)
  var val2 = Buffer(64).fill(1)
  db.put(key1, val1, function() {
    db.put(key2, val2, function() {
      db.compactRange(key1, key2, function() {
        db.approximateSize('0', 'z', function(err, sizeAfterPuts) {
          db.del(key1, function() {
            db.del(key2, function() {
              db.compactRange(key1, key2, function() {
                db.approximateSize('0', 'z', function(err, sizeAfterCompact) {
                  t.ok(sizeAfterCompact < sizeAfterPuts);
                  t.end()
                })
              })
            })
          })
        })
      })
    })
  })
})

test('tearDown', function (t) {
  db.close(testCommon.tearDown.bind(null, t))
})
